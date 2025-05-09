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

## 🧪 Testing Non-Transferability

Soulbound Tokens are **non-transferable** by design. To test this:

1. Try to transfer your SBT using a script or via a block explorer.
2. The transaction will **fail** with a revert message (e.g., `SBT: non-transferable`).
3. This ensures your SBT cannot be sent or sold to another address.

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