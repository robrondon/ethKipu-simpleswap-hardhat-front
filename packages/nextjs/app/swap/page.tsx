"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { isAddress, parseEther } from "viem";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const SwapPage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [tokenAAddress, setTokenAAddress] = useState("");
  const [tokenBAddress, setTokenBAddress] = useState("");
  const [amountIn, setAmountIn] = useState("");
  const [amountOutMin, setAmountOutMin] = useState("");
  const [estimatedAmountOut, setEstimatedAmountOut] = useState("");

  // Hook para escribir al contrato SimpleSwap
  const { writeContractAsync: writeSimpleSwap, isMining } = useScaffoldWriteContract({
    contractName: "SimpleSwap",
  });

  // Validar que las direcciones sean válidas
  const isTokenAValid = tokenAAddress && isAddress(tokenAAddress);
  const isTokenBValid = tokenBAddress && isAddress(tokenBAddress);
  const areTokensDifferent = tokenAAddress !== tokenBAddress && tokenAAddress && tokenBAddress;

  // Calcular estimación cuando cambian los inputs
  useEffect(() => {
    if (amountIn && isTokenAValid && isTokenBValid && areTokensDifferent) {
      // Aquí podrías llamar a getAmountOut del contrato para obtener una estimación real
      // Por ahora usamos un cálculo simple
      const amountInNum = parseFloat(amountIn);
      const estimatedOut = amountInNum * 0.98; // 2% slippage aproximado
      setEstimatedAmountOut(estimatedOut.toFixed(6));
    } else {
      setEstimatedAmountOut("");
    }
  }, [amountIn, areTokensDifferent, isTokenAValid, isTokenBValid, tokenAAddress, tokenBAddress]);

  const handleSwap = async () => {
    if (!connectedAddress || !isTokenAValid || !isTokenBValid || !amountIn || !areTokensDifferent) {
      notification.error("Please fill all fields with valid token addresses");
      return;
    }

    try {
      // Convertir las cantidades a wei
      const amountInWei = parseEther(amountIn);
      const amountOutMinWei = parseEther(amountOutMin || "0");

      // Deadline: 20 minutos desde ahora
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 20 * 60);

      // Path para el swap (array de direcciones de tokens)
      const path = [tokenAAddress, tokenBAddress];

      await writeSimpleSwap({
        functionName: "swapExactTokensForTokens",
        args: [amountInWei, amountOutMinWei, path, connectedAddress, deadline],
      });

      notification.success("Swap executed successfully!");

      // Limpiar formulario
      setAmountIn("");
      setAmountOutMin("");
      setEstimatedAmountOut("");
    } catch (error) {
      console.error("Error executing swap:", error);
      notification.error("Failed to execute swap");
    }
  };

  const handleSwitchTokens = () => {
    setTokenAAddress(tokenBAddress);
    setTokenBAddress(tokenAAddress);
    setAmountIn("");
    setAmountOutMin("");
    setEstimatedAmountOut("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <div className="bg-base-100 rounded-3xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Token Swap</h1>

        {/* Token A Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">From</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="0.0"
              value={amountIn}
              onChange={e => setAmountIn(e.target.value)}
              className="input input-bordered flex-1"
            />
            <input
              type="text"
              placeholder="0x..."
              value={tokenAAddress}
              onChange={e => setTokenAAddress(e.target.value)}
              className={`input input-bordered flex-1 ${tokenAAddress && !isTokenAValid ? "input-error" : ""}`}
            />
          </div>
          {tokenAAddress && !isTokenAValid && <p className="text-error text-xs mt-1">Invalid token address</p>}
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center mb-6">
          <button
            className="btn btn-circle btn-outline"
            onClick={handleSwitchTokens}
            disabled={!tokenAAddress || !tokenBAddress}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>

        {/* Token B Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">To (estimated)</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="0.0"
              value={estimatedAmountOut}
              className="input input-bordered flex-1"
              readOnly
            />
            <input
              type="text"
              placeholder="0x..."
              value={tokenBAddress}
              onChange={e => setTokenBAddress(e.target.value)}
              className={`input input-bordered flex-1 ${tokenBAddress && !isTokenBValid ? "input-error" : ""}`}
            />
          </div>
          {tokenBAddress && !isTokenBValid && <p className="text-error text-xs mt-1">Invalid token address</p>}
        </div>

        {/* Slippage Protection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Slippage Protection (Optional)</label>
          <input
            type="text"
            placeholder="0.0"
            value={amountOutMin}
            onChange={e => setAmountOutMin(e.target.value)}
            className="input input-bordered w-full"
          />
          <p className="text-xs text-gray-600 mt-1">
            {"Minimum amount you're willing to receive (leave empty for no protection)"}
          </p>
        </div>

        {/* Swap Info */}
        {amountIn && estimatedAmountOut && (
          <div className="bg-base-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-2">Swap Details</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Input Amount:</span>
                <span>{amountIn}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Output:</span>
                <span>{estimatedAmountOut}</span>
              </div>
              <div className="flex justify-between">
                <span>Price Impact:</span>
                <span>~2%</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Messages */}
        {!areTokensDifferent && tokenAAddress && tokenBAddress && (
          <div className="alert alert-warning mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span>Token A and Token B must be different addresses</span>
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={
            !connectedAddress || !isTokenAValid || !isTokenBValid || !amountIn || !areTokensDifferent || isMining
          }
          className="btn btn-primary w-full mb-4"
        >
          {!connectedAddress ? "Connect Wallet" : isMining ? "Swapping..." : "Swap Tokens"}
        </button>

        {/* Connected Address */}
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Connected Address:</p>
          <Address address={connectedAddress} />
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="link link-primary">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SwapPage;
