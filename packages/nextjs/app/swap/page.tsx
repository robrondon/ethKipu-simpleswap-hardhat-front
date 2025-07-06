"use client";

import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

const SwapPage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");

  const handleSwap = () => {
    // Aquí irá la lógica de swap con tus smart contracts
    console.log("Swapping tokens...");
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
              value={amountA}
              onChange={e => setAmountA(e.target.value)}
              className="input input-bordered flex-1"
            />
            <select value={tokenA} onChange={e => setTokenA(e.target.value)} className="select select-bordered w-24">
              <option value="">Token</option>
              <option value="ETH">ETH</option>
              <option value="DAI">DAI</option>
              <option value="USDC">USDC</option>
            </select>
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center mb-6">
          <button className="btn btn-circle btn-outline">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>

        {/* Token B Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">To</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="0.0"
              value={amountB}
              onChange={e => setAmountB(e.target.value)}
              className="input input-bordered flex-1"
              readOnly
            />
            <select value={tokenB} onChange={e => setTokenB(e.target.value)} className="select select-bordered w-24">
              <option value="">Token</option>
              <option value="ETH">ETH</option>
              <option value="DAI">DAI</option>
              <option value="USDC">USDC</option>
            </select>
          </div>
        </div>

        {/* Connected Address */}
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Connected Address:</p>
          <Address address={connectedAddress} />
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={!connectedAddress || !tokenA || !tokenB || !amountA}
          className="btn btn-primary w-full mb-4"
        >
          {!connectedAddress ? "Connect Wallet" : "Swap Tokens"}
        </button>

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
