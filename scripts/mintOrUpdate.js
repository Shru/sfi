const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  // Replace with your deployed contract address
  const contractAddress = "0x79485FAAc82C16301C20177392bBE6C5da8c753a";
  // Replace with your actual IPFS URI when ready
  const tokenURI = "ipfs://QmPlaceholderMetadataHash";

  // Get signer (first account from private key in .env)
  const [signer] = await ethers.getSigners();
  console.log("Using wallet:", signer.address);

  // Get contract instance
  const SoulboundToken = await ethers.getContractFactory("SoulboundToken");
  const contract = SoulboundToken.attach(contractAddress);

  // Call mintOrUpdate
  const tx = await contract.connect(signer).mintOrUpdate(tokenURI);
  console.log("Transaction sent. Hash:", tx.hash);
  await tx.wait();
  console.log("Mint or update complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 