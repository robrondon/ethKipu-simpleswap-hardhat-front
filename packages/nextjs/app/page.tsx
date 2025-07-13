"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

const backgroundStyle = {
  backgroundImage: `
      linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%),
      url("https://lh3.googleusercontent.com/aida-public/AB6AXuA-CWeCMPlXBzGnHDxRf2ZCy8M41FtB3Q5os1VKt6WDqf6W4Evc87cYvjHTiZjg5pGWHUf1bFV01brTUUcC8gKV7OpYSXlnbsEiRp6CJf4041PEjS5l5BiQgIJRS2WMWyI8qsuDZrF6rlBN5ZIdF6lWWgphBXJzBEMxlhxVkykwgV_OnJme1AbjEOaaSjlppbZo1Tk5uZ4qgaai55S3rKZRccn5Kai4sB1mrMCXnfS47mapzEp3K-dbPA_bn5bYq-duiv20qrCyZes")
    `,
};

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="px-60 flex flex-1 justify-center py-5 bg-base-100">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="@container">
            <div className="@[480px]:px-4 @[480px]:py-3">
              <div
                className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-base-100 @[480px]:rounded-xl min-h-80 border border-primary/20"
                style={backgroundStyle}
              >
                <div className="flex justify-center p-2">
                  <p className="text-white tracking-light text-[24px] font-bold leading-tight">Welcome to</p>
                </div>
                <div className="flex justify-center p-4 mb-8">
                  <p className="text-white tracking-light text-[60px] font-bold leading-tight">SimpleSwap</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-base-content text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
            Trade tokens instantly. Provide liquidity to earn fees from trades.
          </p>
          <div className="flex justify-center items-center space-x-2 flex-col pb-3 px-4">
            <p className="my-2 font-medium text-base-content">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 max-w-[480px] justify-center">
              <Link href={"/swap"} passHref>
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-primary text-primary-content text-base font-bold leading-normal tracking-[0.015em] grow hover:bg-primary/90 transition-colors">
                  <span className="truncate">Swap</span>
                </button>
              </Link>
              <Link href={"/liquidity"} passHref>
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-base-300 text-base-content text-base font-bold leading-normal tracking-[0.015em] grow hover:bg-base-300/80 transition-colors border border-primary/30">
                  <span className="truncate">Liquidity</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
