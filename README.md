# SocialFi 


This project demonstrates a minimal Soulbound Token (SBT) implementation on the Base Sepolia testnet using Hardhat and OpenZeppelin.

---

## Getting Started

### 1. **Clone the Repository**
```bash
git clone https://github.com/Shru/sfi.git
cd sfi
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Set Up Environment Variables**
Create a `.env` file in the root directory with your wallet's private key:
```
PRIVATE_KEY=your_private_key_here
```
**Never share your private key. Use a test wallet!**

---

## Building & Compiling Contracts
```bash
npx hardhat compile
```

---

## Deploying the Soulbound Token (SBT) Contract

### 1. **Configure the Network**
The `hardhat.config.js` is already set up for Base Sepolia:
- RPC URL: `https://sepolia.base.org`
- Chain ID: `84532`

### 2. **Deploy**
```bash
npx hardhat run scripts/deploy.js --network sepolia_base
```
- The deployed contract address will be printed in the console.

---

## Testing Non-Transferability

After deploying and minting a token, you can test that transfers are blocked:
```bash
npx hardhat run scripts/tryTransfer.js --network sepolia_base
```
- You should see an error message confirming transfer is not allowed.


---

## MetaMask Network Settings (Base Sepolia)
| Field              | Value                          |
|--------------------|-------------------------------|
| Network Name       | Base Sepolia                   |
| New RPC URL        | https://sepolia.base.org       |
| Chain ID           | 84532                          |
| Currency Symbol    | ETH                            |
| Block Explorer URL | https://sepolia-explorer.base.org |

---

## Notes
- Only the `SoulboundToken.sol` contract is needed for the MVP.
- All other contracts and tests have been removed for clarity.
- For frontend integration, use the contract ABI from `artifacts/contracts/SoulboundToken.sol/` after compilation.

---

## Useful Hardhat Commands
```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia_base
npx hardhat run scripts/tryTransfer.js --network sepolia_base
```
