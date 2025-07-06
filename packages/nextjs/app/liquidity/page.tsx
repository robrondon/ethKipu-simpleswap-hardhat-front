"use client";

import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

const PoolPage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [activeTab, setActiveTab] = useState<"add" | "remove">("add");
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [lpTokenAmount, setLpTokenAmount] = useState("");

  const handleAddLiquidity = () => {
    // Aquí irá la lógica para agregar liquidez
    console.log("Adding liquidity...");
  };

  const handleRemoveLiquidity = () => {
    // Aquí irá la lógica para remover liquidez
    console.log("Removing liquidity...");
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

        {activeTab === "add" ? (
          <>
            {/* Add Liquidity Form */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Token A</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="0.0"
                  value={amountA}
                  onChange={e => setAmountA(e.target.value)}
                  className="input input-bordered flex-1"
                />
                <select
                  value={tokenA}
                  onChange={e => setTokenA(e.target.value)}
                  className="select select-bordered w-24"
                >
                  <option value="">Token</option>
                  <option value="ETH">ETH</option>
                  <option value="DAI">DAI</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Token B</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="0.0"
                  value={amountB}
                  onChange={e => setAmountB(e.target.value)}
                  className="input input-bordered flex-1"
                />
                <select
                  value={tokenB}
                  onChange={e => setTokenB(e.target.value)}
                  className="select select-bordered w-24"
                >
                  <option value="">Token</option>
                  <option value="ETH">ETH</option>
                  <option value="DAI">DAI</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAddLiquidity}
              disabled={!connectedAddress || !tokenA || !tokenB || !amountA || !amountB}
              className="btn btn-primary w-full mb-4"
            >
              {!connectedAddress ? "Connect Wallet" : "Add Liquidity"}
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

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Pool Pair</label>
              <div className="flex gap-2">
                <select
                  value={tokenA}
                  onChange={e => setTokenA(e.target.value)}
                  className="select select-bordered flex-1"
                >
                  <option value="">Select Token A</option>
                  <option value="ETH">ETH</option>
                  <option value="DAI">DAI</option>
                  <option value="USDC">USDC</option>
                </select>
                <span className="self-center">-</span>
                <select
                  value={tokenB}
                  onChange={e => setTokenB(e.target.value)}
                  className="select select-bordered flex-1"
                >
                  <option value="">Select Token B</option>
                  <option value="ETH">ETH</option>
                  <option value="DAI">DAI</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleRemoveLiquidity}
              disabled={!connectedAddress || !tokenA || !tokenB || !lpTokenAmount}
              className="btn btn-secondary w-full mb-4"
            >
              {!connectedAddress ? "Connect Wallet" : "Remove Liquidity"}
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
