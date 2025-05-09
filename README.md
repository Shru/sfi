# SocialFi Soulbound Token (SBT) MVP

A minimal Soulbound Token (SBT) dApp for sharing and updating your social media identity, deployed on Base Sepolia.

---

## 🚀 Features

- **Mint a Soulbound Token (SBT)** to your connected wallet (free, just pay gas)
- **Update your SBT**: Change your social info anytime—one SBT per wallet
- **Required Socials**: X (Twitter), LinkedIn, GitHub, Discord, Telegram, Farcaster
- **All data stored off-chain** in token metadata (IPFS)
- **Beautiful wallet connection** (MetaMask, WalletConnect) via RainbowKit

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Shru/sfi.git
cd sfi
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```
PRIVATE_KEY=your_private_key_here
```
> ⚠️ **Never share your private key. Use a test wallet!**

---

## 🧑‍💻 Build & Compile Contracts

```bash
npx hardhat compile
```

---

## 🚀 Deploy to Base Sepolia

1. **Configure the network** in `hardhat.config.js` (already set for Base Sepolia):

    ```js
    networks: {
      sepolia_base: {
        url: "https://sepolia.base.org",
        accounts: [process.env.PRIVATE_KEY]
      }
    }
    ```

2. **Deploy the contract:**

    ```bash
    npx hardhat run scripts/deploy.js --network sepolia_base
    ```

---

## 🦊 MetaMask Network Settings (Base Sepolia)

To interact with your SBT on Base Sepolia, add the network to MetaMask:

- **Network Name:** Base Sepolia
- **New RPC URL:** `https://sepolia.base.org`
- **Chain ID:** `84532`
- **Currency Symbol:** ETH
- **Block Explorer URL:** [https://sepolia-explorer.base.org](https://sepolia-explorer.base.org)

**How to add:**
1. Open MetaMask, click the network dropdown, and select "Add network."
2. Enter the details above and save.

---

## 🧪 Testing with Scripts

### 1. Mint or Update Your SBT (`scripts/mintOrUpdate.js`)

This script lets you mint a new SBT or update your existing SBT's metadata.

**Before running:**
- Update the `contractAddress` variable in the script to your deployed contract address.
- Update the `tokenURI` variable to your actual IPFS metadata URI (or use the placeholder for testing).

**Run the script:**
```bash
npx hardhat run scripts/mintOrUpdate.js --network sepolia_base
```
- The script will print the transaction hash and confirm mint/update.
- Run it again with a different `tokenURI` to test updating your SBT.

### 2. Test Non-Transferability (`scripts/tryTransfer.js`)

This script attempts to transfer an SBT and should always fail, confirming the token is non-transferable.

**Before running:**
- Update the `address` variable to your deployed contract address.
- Update the `recipient` variable to any valid Ethereum address (not your own).
- Update the tokenId (e.g., `1`) to a token you own.

**Run the script:**
```bash
npx hardhat run scripts/tryTransfer.js --network sepolia_base
```
- You should see an error message: `Transfer failed as expected: SBT: non-transferable`

---

## 🖼️ SBT Metadata & Image

- All social info is stored in the token's metadata on IPFS.
- **Placeholder image**: `SBT image.png` (in `/assets`).
- Metadata follows the ERC-721 standard.

---

## 🦊 Frontend (Vite + React + TypeScript)

- Connect wallet (MetaMask, WalletConnect)
- Fill out required socials form (all fields required, validated)
- Mint or update your SBT (calls smart contract)
- All data stored off-chain (IPFS)

---


## 💡 Future Improvements

- Add more social platforms
- Social account verification (OAuth, social proof)
- AI-generated images for SBTs
- Network switching and mainnet support

---

## 📄 License

MIT