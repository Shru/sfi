# SocialFi Frontend

This is the frontend for the SocialFi Soulbound Token (SBT) dApp. It allows users to connect their wallet, enter their social media handles, and mint a non-transferable SBT on Base Sepolia.

## Getting Started

Follow these steps to set up and run the project after cloning:

1. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Set up environment variables** (if required)
   - If you are using Pinata for IPFS uploads, create a `.env` file and add your Pinata API keys:
     ```env
     VITE_PINATA_API_KEY=your_pinata_api_key
     VITE_PINATA_API_SECRET=your_pinata_api_secret
     ```
   - If you want to use your own WalletConnect project ID, add it as well:
     ```env
     VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
     ```
   - Update the code in `src/Mint.tsx` and `src/wallet.tsx` to use these environment variables if not already set.

3. **Update contract address and ABI**
   - If you have deployed your own contract, update the contract address and ABI in `src/Mint.tsx`.
   - Also update the contract address in the scripts in the `scripts/` directory (`mintOrUpdate.js`, `tryTransfer.js`).

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) by default.

5. **Build for production** (optional)
   ```bash
   npm run build
   # or
   yarn build
   ```
   The production-ready static files will be output to the `dist/` directory.

6. **Preview the production build locally** (optional)
   ```bash
   npm run preview
   # or
   yarn preview
   ```

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

## Historical Context

This project was bootstrapped with [Vite](https://vitejs.dev/) and the React + TypeScript template:

```bash
npm create vite@latest socialfi-frontend -- --template react-ts
```

### Key Dependencies

The following packages are used for wallet connection, blockchain interaction, and routing:

```bash
npm install wagmi @rainbow-me/rainbowkit @tanstack/react-query viem react-router-dom
```

For backend/smart contract setup, see the main project README.
