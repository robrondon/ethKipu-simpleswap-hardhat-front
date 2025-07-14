# 🚀 SimpleSwap Deployment Guide

This guide explains how to deploy SimpleSwap to different networks for development and production.

## 📋 Prerequisites

Before deploying, make sure you have:

1. **Node.js** (>= v20.18.3)
2. **Yarn** package manager
3. **Git** for version control
4. **MetaMask** or another Web3 wallet
5. **Test ETH** for the target network (for gas fees)

## 🔧 Environment Setup

### 1. Create Environment File

Create a `.env.local` file in the root directory:

```bash
# Alchemy API Key (get one at https://dashboard.alchemyapi.io)
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here

# WalletConnect Project ID (get one at https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id_here

# Deployer private key (for contract deployment)
DEPLOYER_PRIVATE_KEY=your_private_key_here

# Optional: Override target network
NEXT_PUBLIC_TARGET_NETWORK=sepolia
```

### 2. Get Required API Keys

#### Alchemy API Key

1. Go to [Alchemy Dashboard](https://dashboard.alchemyapi.io)
2. Create a new app
3. Select the network (Sepolia, Mainnet, etc.)
4. Copy the API key

#### WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Copy the project ID

## 🌐 Network Deployment

### Local Development (Hardhat)

For local development and testing:

```bash
# Start local blockchain
yarn chain

# Deploy contracts to local network
yarn deploy

# Start frontend
yarn start
```

**Network**: `localhost:8545` (Hardhat)
**Gas**: Free
**Speed**: Instant

### Sepolia Testnet

For testing on a public testnet:

```bash
# Deploy contracts to Sepolia
yarn deploy:sepolia

# Build for production
yarn build
```

**Network**: Sepolia Testnet
**Gas**: Test ETH (free from faucets)
**Speed**: ~15 seconds per block

### Mainnet

For production deployment:

```bash
# Deploy contracts to Mainnet
yarn deploy:mainnet

# Build for production
yarn build
```

**Network**: Ethereum Mainnet
**Gas**: Real ETH (expensive)
**Speed**: ~12 seconds per block

## 🎯 Deployment Commands

| Command               | Description                     | Network        |
| --------------------- | ------------------------------- | -------------- |
| `yarn deploy`         | Deploy to local Hardhat network | localhost:8545 |
| `yarn deploy:sepolia` | Deploy to Sepolia testnet       | Sepolia        |
| `yarn deploy:mainnet` | Deploy to Ethereum mainnet      | Mainnet        |

## 🔄 Network Configuration

The application automatically detects the environment:

- **Development** (`NODE_ENV=development`): Uses Hardhat network
- **Production** (`NODE_ENV=production`): Uses Sepolia testnet

### Manual Network Override

You can manually override the network using environment variables:

```bash
# Force Hardhat network
NEXT_PUBLIC_TARGET_NETWORK=hardhat yarn start

# Force Sepolia network
NEXT_PUBLIC_TARGET_NETWORK=sepolia yarn start

# Force Mainnet network
NEXT_PUBLIC_TARGET_NETWORK=mainnet yarn start
```

## 🏗️ Frontend Deployment

### Vercel Deployment

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   ```
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_key
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_id
   NODE_ENV=production
   ```
3. **Deploy** - Vercel will automatically build and deploy

### Netlify Deployment

1. **Connect your repository** to Netlify
2. **Set environment variables** in Netlify dashboard
3. **Build command**: `yarn build`
4. **Publish directory**: `.next`

### Manual Deployment

```bash
# Build the application
yarn build

# The built files will be in packages/nextjs/.next/
# Upload these files to your hosting provider
```

## 🔍 Post-Deployment Verification

After deployment, verify that:

1. **Contracts are deployed** and accessible
2. **Frontend connects** to the correct network
3. **Wallet connection** works
4. **Swap functionality** works with test tokens
5. **Liquidity provision** works

### Contract Verification

Verify your contracts on Etherscan:

```bash
# Verify on Sepolia
yarn hardhat:verify --network sepolia

# Verify on Mainnet
yarn hardhat:verify --network mainnet
```

## 🛠️ Troubleshooting

### Common Issues

1. **"Insufficient funds"**

   - Get test ETH from a faucet
   - Check your deployer account balance

2. **"Network not supported"**

   - Check your `NEXT_PUBLIC_TARGET_NETWORK` setting
   - Ensure the network is configured in `hardhat.config.ts`

3. **"Contract not found"**

   - Verify contracts are deployed to the correct network
   - Check contract addresses in `deployedContracts.ts`

4. **"RPC error"**
   - Check your Alchemy API key
   - Verify the RPC URL is correct

### Getting Test ETH

- **Sepolia**: [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- **Goerli**: [Goerli Faucet](https://goerlifaucet.com/)
- **Local**: Use the burner wallet or import accounts

## 📞 Support

If you encounter issues:

1. Check the [Scaffold-ETH 2 documentation](https://docs.scaffoldeth.io)
2. Review the [Hardhat documentation](https://hardhat.org/docs)
3. Open an issue on GitHub
4. Check the console for error messages

---

**Happy deploying! 🚀**
