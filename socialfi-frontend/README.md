# SocialFi Frontend

This is the frontend for the SocialFi Soulbound Token (SBT) dApp. It allows users to connect their wallet, enter their social media handles, and mint a non-transferable SBT on Base Sepolia.

## Project Initialization

This project was bootstrapped with [Vite](https://vitejs.dev/) and the React + TypeScript template:

```bash
npm create vite@latest socialfi-frontend -- --template react-ts
```

## Key Dependencies

The following packages are used for wallet connection, blockchain interaction, and routing:

```bash
npm install wagmi @rainbow-me/rainbowkit @tanstack/react-query viem react-router-dom
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or v20 recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Getting Started

1. **Install dependencies**

   All required dependencies (including wallet and blockchain libraries) are already listed in `package.json`. If you are missing any, use the install command above.

   Using npm:
   ```bash
   npm install
   ```
   Or using yarn:
   ```bash
   yarn install
   ```

2. **Run the development server**

   Using npm:
   ```bash
   npm run dev
   ```
   Or using yarn:
   ```bash
   yarn dev
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173) by default (Vite default port).

3. **Build for production**

   Using npm:
   ```bash
   npm run build
   ```
   Or using yarn:
   ```bash
   yarn build
   ```

   The production-ready static files will be output to the `dist/` directory.

4. **Preview the production build locally**

   Using npm:
   ```bash
   npm run preview
   ```
   Or using yarn:
   ```bash
   yarn preview
   ```

   This will serve the built app locally for testing before deployment.

## Features
- Connect your wallet (MetaMask, WalletConnect, etc.)
- Enter your Twitter, LinkedIn, and Instagram handles
- Mint a Soulbound Token (SBT) with your social info
- Disconnect wallet and clear session

## Notes
- Make sure your wallet is connected to the **Base Sepolia** network.
- You need SepoliaETH on Base Sepolia to pay for gas. Use the official [Base bridge](https://bridge.base.org/deposit) if needed.
- If you deploy a new contract, update the contract address and ABI in the code (see `src/Mint.tsx`).
- **Update contract address in scripts:**
  - The backend scripts in the `scripts/` directory (such as `mintOrUpdate.js` and `tryTransfer.js`) also require the correct contract address. Edit the `contractAddress` or `address` variable in each script to match your deployed contract.
- **Pinata account and API keys:**
  - To upload metadata to IPFS, you need a [Pinata](https://pinata.cloud/) account. After signing up, go to your Pinata dashboard, navigate to the API Keys section, and create a new key. Use the generated API Key and Secret in your environment or directly in the code (for testing only; use environment variables for production).
  - **Where to update Pinata API keys:** The Pinata API key and secret are currently set at the top of `src/Mint.tsx` as `PINATA_API_KEY` and `PINATA_API_SECRET`. For production, move these to environment variables (e.g., `.env`) and access them in your code using `import.meta.env.VITE_PINATA_API_KEY` and `import.meta.env.VITE_PINATA_API_SECRET` (see [Vite env docs](https://vitejs.dev/guide/env-and-mode.html)).
- **WalletConnect Project ID:**
  - The wallet connection uses WalletConnect via RainbowKit. In `src/wallet.tsx`, you will see a `projectId` field. You can get your own project ID by signing up at [WalletConnect Cloud](https://cloud.walletconnect.com/) and creating a new project. Replace the existing `projectId` with your own for production use.

## Project Structure
- `src/` — React components and app logic
- `App.tsx` — Main app entry
- `Mint.tsx` — Minting form and wallet logic

## Customization
- Update contract address and ABI in the code as needed for your deployment.
- Update contract address in all scripts in the `scripts/` directory.
- Use your own Pinata API keys and WalletConnect project ID for production security.

---

For backend/smart contract setup, see the main project README.
