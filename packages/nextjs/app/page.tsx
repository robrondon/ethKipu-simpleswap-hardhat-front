"use client";

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
      {/* <div className="flex items-center flex-col pt-10"> */}
      <div className="px-60 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="@container">
            <div className="@[480px]:px-4 @[480px]:py-3">
              <div
                className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-[#121417] @[480px]:rounded-xl min-h-80"
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
          <p className="text-white text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
            Trade tokens instantly. Provide liquidity to earn fees from trades.
          </p>
          <div className="flex justify-center items-center space-x-2 flex-col pb-3 px-4">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 max-w-[480px] justify-center">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-[#adc7ea] text-[#121417] text-base font-bold leading-normal tracking-[0.015em] grow">
                <span className="truncate">Swap</span>
              </button>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-[#2b3036] text-white text-base font-bold leading-normal tracking-[0.015em] grow">
                <span className="truncate">Pool</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">SimpleSwap</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>

          <p className="text-center text-lg">Trade tokens instantly. Provide liquidity to earn fees from trades.</p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
        </div> */}

      {/* <div className="grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col md:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div> */}
      {/* </div> */}
    </>
  );
};

export default Home;
