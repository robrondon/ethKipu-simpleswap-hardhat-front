"use client";

import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { isAddress, parseEther } from "viem";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const PoolPage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [activeTab, setActiveTab] = useState<"add" | "remove">("add");
  const [tokenAAddress, setTokenAAddress] = useState("");
  const [tokenBAddress, setTokenBAddress] = useState("");
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [lpTokenAmount, setLpTokenAmount] = useState("");
  const [amountAMin, setAmountAMin] = useState("");
  const [amountBMin, setAmountBMin] = useState("");

  // Hook para escribir al contrato SimpleSwap
  const { writeContractAsync: writeSimpleSwap, isMining } = useScaffoldWriteContract({
    contractName: "SimpleSwap",
  });

  // Validar que las direcciones sean válidas
  const isTokenAValid = tokenAAddress && isAddress(tokenAAddress);
  const isTokenBValid = tokenBAddress && isAddress(tokenBAddress);
  const areTokensDifferent = tokenAAddress !== tokenBAddress && tokenAAddress && tokenBAddress;

  const handleAddLiquidity = async () => {
    if (!connectedAddress || !isTokenAValid || !isTokenBValid || !amountA || !amountB) {
      notification.error("Please fill all fields with valid token addresses");
      return;
    }

    if (!areTokensDifferent) {
      notification.error("Token A and Token B must be different");
      return;
    }

    try {
      // Convertir las cantidades a wei
      const amountADesired = parseEther(amountA);
      const amountBDesired = parseEther(amountB);
      const amountAMinValue = parseEther(amountAMin || "0");
      const amountBMinValue = parseEther(amountBMin || "0");

      // Deadline: 20 minutos desde ahora
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 20 * 60);

      await writeSimpleSwap({
        functionName: "addLiquidity",
        args: [
          tokenAAddress,
          tokenBAddress,
          amountADesired,
          amountBDesired,
          amountAMinValue,
          amountBMinValue,
          connectedAddress,
          deadline,
        ],
      });

      notification.success("Liquidity added successfully!");

      // Limpiar formulario
      setAmountA("");
      setAmountB("");
      setAmountAMin("");
      setAmountBMin("");
    } catch (error) {
      console.error("Error adding liquidity:", error);
      notification.error("Failed to add liquidity");
    }
  };

  const handleRemoveLiquidity = async () => {
    if (!connectedAddress || !isTokenAValid || !isTokenBValid || !lpTokenAmount) {
      notification.error("Please fill all fields with valid token addresses");
      return;
    }

    if (!areTokensDifferent) {
      notification.error("Token A and Token B must be different");
      return;
    }

    try {
      // Convertir las cantidades a wei
      const liquidity = parseEther(lpTokenAmount);
      const amountAMinValue = parseEther(amountAMin || "0");
      const amountBMinValue = parseEther(amountBMin || "0");

      // Deadline: 20 minutos desde ahora
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 20 * 60);

      await writeSimpleSwap({
        functionName: "removeLiquidity",
        args: [tokenAAddress, tokenBAddress, liquidity, amountAMinValue, amountBMinValue, connectedAddress, deadline],
      });

      notification.success("Liquidity removed successfully!");

      // Limpiar formulario
      setLpTokenAmount("");
      setAmountAMin("");
      setAmountBMin("");
    } catch (error) {
      console.error("Error removing liquidity:", error);
      notification.error("Failed to remove liquidity");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <div className="bg-base-100 rounded-3xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Liquidity Pool</h1>

        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button className={`tab ${activeTab === "add" ? "tab-active" : ""}`} onClick={() => setActiveTab("add")}>
            Add Liquidity
          </button>
          <button
            className={`tab ${activeTab === "remove" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("remove")}
          >
            Remove Liquidity
          </button>
        </div>

        {/* Token Addresses - Shared between both tabs */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Token A Address</label>
          <input
            type="text"
            placeholder="0x..."
            value={tokenAAddress}
            onChange={e => setTokenAAddress(e.target.value)}
            className={`input input-bordered w-full ${tokenAAddress && !isTokenAValid ? "input-error" : ""}`}
          />
          {tokenAAddress && !isTokenAValid && <p className="text-error text-xs mt-1">Invalid token address</p>}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Token B Address</label>
          <input
            type="text"
            placeholder="0x..."
            value={tokenBAddress}
            onChange={e => setTokenBAddress(e.target.value)}
            className={`input input-bordered w-full ${tokenBAddress && !isTokenBValid ? "input-error" : ""}`}
          />
          {tokenBAddress && !isTokenBValid && <p className="text-error text-xs mt-1">Invalid token address</p>}
        </div>

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

        {activeTab === "add" ? (
          <>
            {/* Add Liquidity Form */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Amount Token A</label>
              <input
                type="text"
                placeholder="0.0"
                value={amountA}
                onChange={e => setAmountA(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Amount Token B</label>
              <input
                type="text"
                placeholder="0.0"
                value={amountB}
                onChange={e => setAmountB(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            {/* Slippage Protection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Slippage Protection (Optional)</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Min Token A</label>
                  <input
                    type="text"
                    placeholder="0.0"
                    value={amountAMin}
                    onChange={e => setAmountAMin(e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Min Token B</label>
                  <input
                    type="text"
                    placeholder="0.0"
                    value={amountBMin}
                    onChange={e => setAmountBMin(e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleAddLiquidity}
              disabled={
                !connectedAddress ||
                !isTokenAValid ||
                !isTokenBValid ||
                !amountA ||
                !amountB ||
                !areTokensDifferent ||
                isMining
              }
              className="btn btn-primary w-full mb-4"
            >
              {!connectedAddress ? "Connect Wallet" : isMining ? "Adding Liquidity..." : "Add Liquidity"}
            </button>
          </>
        ) : (
          <>
            {/* Remove Liquidity Form */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">LP Token Amount</label>
              <input
                type="text"
                placeholder="0.0"
                value={lpTokenAmount}
                onChange={e => setLpTokenAmount(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            {/* Slippage Protection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Slippage Protection (Optional)</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Min Token A</label>
                  <input
                    type="text"
                    placeholder="0.0"
                    value={amountAMin}
                    onChange={e => setAmountAMin(e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Min Token B</label>
                  <input
                    type="text"
                    placeholder="0.0"
                    value={amountBMin}
                    onChange={e => setAmountBMin(e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleRemoveLiquidity}
              disabled={
                !connectedAddress ||
                !isTokenAValid ||
                !isTokenBValid ||
                !lpTokenAmount ||
                !areTokensDifferent ||
                isMining
              }
              className="btn btn-secondary w-full mb-4"
            >
              {!connectedAddress ? "Connect Wallet" : isMining ? "Removing Liquidity..." : "Remove Liquidity"}
            </button>
          </>
        )}

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

export default PoolPage;
