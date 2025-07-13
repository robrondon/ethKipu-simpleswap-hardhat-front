import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { hardhat } from "viem/chains";
import { CurrencyDollarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { Faucet } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useGlobalState } from "~~/services/store/store";

/**
 * Site footer
 */
export const Footer = () => {
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0 bg-base-100">
      <div>
        <div className="fixed flex justify-between items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">
          <div className="flex flex-col md:flex-row gap-2 pointer-events-auto">
            {nativeCurrencyPrice > 0 && (
              <div>
                <div className="btn btn-primary btn-sm font-normal gap-1 cursor-auto bg-primary text-primary-content border-primary">
                  <CurrencyDollarIcon className="h-4 w-4" />
                  <span>{nativeCurrencyPrice.toFixed(2)}</span>
                </div>
              </div>
            )}
            {isLocalNetwork && (
              <>
                <Faucet />
                <Link
                  href="/blockexplorer"
                  passHref
                  className="btn btn-primary btn-sm font-normal gap-1 bg-primary text-primary-content border-primary hover:bg-primary/90"
                >
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  <span>Block Explorer</span>
                </Link>
              </>
            )}
          </div>
          <SwitchTheme className={`pointer-events-auto ${isLocalNetwork ? "self-end md:self-auto" : ""}`} />
        </div>
      </div>
      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex justify-center items-center gap-2 text-sm w-full text-base-content">
            <div className="flex justify-center items-center gap-2">
              <a
                className="flex justify-center items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                href="https://www.linkedin.com/in/robrondon"
                target="_blank"
                rel="noreferrer"
              >
                <FaLinkedin />
                <span className="link">LinkedIn</span>
              </a>
            </div>
            <span className="text-base-content">·</span>
            <div className="text-center">
              <p className="m-0 text-center text-base-content">@2024 SimpleSwap</p>
            </div>
            <span className="text-base-content">·</span>
            <div className="flex justify-center items-center gap-1">
              <FaGithub className="text-primary" />
              <a
                href="https://github.com/robrondon"
                target="_blank"
                rel="noreferrer"
                className="link text-primary hover:text-primary/80 transition-colors"
              >
                Github
              </a>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};
