# 🚀 SimpleSwap - Decentralized Exchange

<h4 align="center">
  A decentralized exchange (DEX) built with Scaffold-ETH 2
</h4>

<p align="center">
  <strong>Trade tokens instantly. Provide liquidity to earn fees from trades.</strong>
</p>

## 📖 Overview

SimpleSwap is a decentralized exchange that replicates core Uniswap functionality with a clean, modern interface. Built on Ethereum, it allows users to swap ERC-20 tokens and provide liquidity to earn trading fees.

### ✨ Features

- 🔄 **Token Swapping**: Swap any ERC-20 token for another using automated market maker (AMM) pools
- 💧 **Liquidity Provision**: Add and remove liquidity to earn trading fees
- 📊 **Real-time Pricing**: Get live token prices and swap estimates
- 🛡️ **Slippage Protection**: Set custom slippage tolerance to protect against price movements
- 🔍 **Pool Information**: View detailed pool statistics including reserves and token balances
- 🎨 **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- 🔗 **Wallet Integration**: Connect with any Web3 wallet (MetaMask, WalletConnect, etc.)
- 🔧 **Direct Contract Interaction**: Access the Utility Contracts page to interact directly with smart contracts
- 🪙 **Token Minting**: Mint ALE and ROB tokens for testing purposes

### 🏗️ Architecture

- **Smart Contracts**: Solidity contracts implementing AMM functionality with constant product formula (x \* y = k)
- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and DaisyUI
- **Web3 Integration**: Wagmi + Viem for Ethereum interactions
- **Development**: Hardhat for smart contract development and testing

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (>= v20.18.3)
- [Yarn](https://yarnpkg.com/) (v1 or v2+)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd simpleswap-frontend
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Start local Hardhat blockchain**

   ```bash
   yarn chain
   ```

4. **Deploy smart contracts** (in a new terminal)

   ```bash
   yarn deploy
   ```

5. **Start the frontend** (in a new terminal)

   ```bash
   yarn start
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

**Note**: The application is configured to use the local Hardhat network for development. This provides a fast, local blockchain environment for testing and development.

## 📋 Smart Contracts

### Core Contracts

- **`SimpleSwap.sol`**: Main DEX contract implementing AMM functionality
- **`LPToken.sol`**: ERC-20 token representing liquidity provider shares
- **`ERC20Token.sol`**: Sample ERC-20 token for testing
- **`ALE Token`**: Test token that can be minted for development
- **`ROB Token`**: Test token that can be minted for development

### Key Functions

#### Swapping

- `swapExactTokensForTokens()`: Swap exact input tokens for output tokens
- `getAmountOut()`: Calculate output amount for a given input
- `getPrice()`: Get current token price in a pool

#### Liquidity

- `addLiquidity()`: Add liquidity to a token pair
- `removeLiquidity()`: Remove liquidity and receive underlying tokens
- `_calculateOptimalAmounts()`: Calculate optimal token amounts for liquidity provision

## 🎯 Usage Guide

### Swapping Tokens

1. **Connect your wallet** using the connect button
2. **Enter token addresses** for the tokens you want to swap
3. **Set the amount** you want to swap
4. **Review the swap details** including:
   - Estimated output amount
   - Price impact
   - Slippage tolerance
5. **Approve tokens** if needed (first-time interaction)
6. **Execute the swap**

### Providing Liquidity

1. **Navigate to the Liquidity page**
2. **Enter token addresses** for the pair you want to provide liquidity to
3. **Set amounts** for both tokens
4. **Review pool information** including:
   - Current reserves
   - Your share of the pool
   - Estimated LP tokens to receive
5. **Approve both tokens** if needed
6. **Add liquidity**

### Removing Liquidity

1. **Switch to the "Remove" tab** on the Liquidity page
2. **Enter the amount of LP tokens** you want to burn
3. **Set minimum amounts** for both tokens (slippage protection)
4. **Review the removal details**
5. **Remove liquidity**

### Advanced Usage

#### Direct Contract Interaction

For advanced users or developers who want to interact directly with the smart contracts:

1. **Navigate to the Utility Contracts page** (accessible from the main menu)
2. **Select the contract** you want to interact with (SimpleSwap, ALE Token, or ROB Token)
3. **Choose the function** you want to call
4. **Fill in the parameters** and execute the transaction

#### Token Minting

To get test tokens for development and testing:

1. **Go to the Utility Contracts page**
2. **Select ALE Token or ROB Token** from the contract list
3. **Find the `mint` function**
4. **Enter the amount** you want to mint
5. **Execute the mint transaction**

This is particularly useful for:

- Testing swap functionality
- Creating liquidity pools
- Development and debugging

## 🧪 Testing

Run the test suite to verify smart contract functionality:

```bash
yarn hardhat:test
```

## 🔧 Development

### Project Structure

```
simpleswap-frontend/
├── packages/
│   ├── hardhat/          # Smart contracts and deployment
│   │   ├── contracts/    # Solidity contracts
│   │   ├── deploy/       # Deployment scripts
│   │   └── test/         # Contract tests
│   └── nextjs/           # Frontend application
│       ├── app/          # Next.js app directory
│       ├── components/   # React components
│       └── hooks/        # Custom React hooks
```

### Available Scripts

- `yarn chain`: Start local Hardhat node
- `yarn deploy`: Deploy contracts to local network
- `yarn start`: Start Next.js development server
- `yarn build`: Build for production
- `yarn hardhat:test`: Run smart contract tests
- `yarn lint`: Run ESLint
- `yarn format`: Format code with Prettier

### Configuration

- **Network Configuration**: Edit `packages/hardhat/hardhat.config.ts`
- **Frontend Configuration**: Edit `packages/nextjs/scaffold.config.ts`
- **Contract Addresses**: Automatically generated in `packages/nextjs/contracts/deployedContracts.ts`

## 🌐 Deployment

### Local Development

The project is configured for local development with Hardhat. All contracts deploy to the local network automatically.

### Production Deployment (Sepolia)

The application automatically switches to Sepolia testnet when deployed to production. Here's how to deploy:

#### 1. **Set up Environment Variables**

Create a `.env.local` file in the root directory:

```bash
# Alchemy API Key (get one at https://dashboard.alchemyapi.io)
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here

# WalletConnect Project ID (get one at https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id_here

# Deployer private key (for contract deployment)
DEPLOYER_PRIVATE_KEY=your_private_key_here
```

#### 2. **Deploy Smart Contracts to Sepolia**

```bash
# Deploy to Sepolia testnet
yarn deploy --network sepolia
```

#### 3. **Build and Deploy Frontend**

```bash
# Build for production
yarn build

# Deploy to your hosting platform (e.g., Vercel, Netlify)
```

#### 4. **Environment Configuration for Hosting**

When deploying to platforms like Vercel, set these environment variables:

- `NEXT_PUBLIC_ALCHEMY_API_KEY`: Your Alchemy API key
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: Your WalletConnect project ID
- `NODE_ENV`: Set to `production` (this automatically switches to Sepolia)

### Network Configuration

The application automatically detects the environment:

- **Development**: Uses Hardhat network (localhost:8545)
- **Production**: Uses Sepolia testnet

You can also manually override the network by setting `NEXT_PUBLIC_TARGET_NETWORK` environment variable.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2)
- Inspired by [Uniswap](https://uniswap.org/)
- Uses [OpenZeppelin](https://openzeppelin.com/) contracts for security

**Happy swapping! 🚀**
