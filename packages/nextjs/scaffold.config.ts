import * as chains from "viem/chains";

export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  rpcOverrides?: Record<number, string>;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
};

export const DEFAULT_ALCHEMY_API_KEY = "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";

// Helper function to determine target networks
const getTargetNetworks = () => {
  // Allow manual override via environment variable
  if (process.env.NEXT_PUBLIC_TARGET_NETWORK) {
    switch (process.env.NEXT_PUBLIC_TARGET_NETWORK.toLowerCase()) {
      case "hardhat":
        return [chains.hardhat];
      case "sepolia":
        return [chains.sepolia];
      case "mainnet":
        return [chains.mainnet];
      default:
        console.warn(`Unknown network: ${process.env.NEXT_PUBLIC_TARGET_NETWORK}`);
    }
  }

  // Default: hardhat for development, sepolia for production
  return process.env.NODE_ENV === "production" ? [chains.sepolia] : [chains.hardhat];
};

const scaffoldConfig = {
  // The networks on which your DApp is live
  // Use hardhat network for development, sepolia for production
  targetNetworks: getTargetNetworks(),

  // The interval at which your front-end polls the RPC servers for new data
  // it has no effect if you only target the local network (default is 4000)
  pollingInterval: 30000,

  // This is ours Alchemy's default API key.
  // You can get your own at https://dashboard.alchemyapi.io
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || DEFAULT_ALCHEMY_API_KEY,

  // If you want to use a different RPC for a specific network, you can add it here.
  // The key is the chain ID, and the value is the HTTP RPC URL
  rpcOverrides: {
    // Example:
    // [chains.mainnet.id]: "https://mainnet.buidlguidl.com",
  },

  // This is ours WalletConnect's default project ID.
  // You can get your own at https://cloud.walletconnect.com
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",

  // Only show the Burner Wallet when running on hardhat network
  onlyLocalBurnerWallet: true,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
