async function main() {
    const [deployer] = await ethers.getSigners();
    const address = "0x026a85733caac36A773aC3725241012faBbf9800";
    const SoulboundToken = await ethers.getContractAt("SoulboundToken", address);
  
    // Replace with any valid Ethereum address (not your own)
    const recipient = "0x053721725E92ec84e0a14C550797Eb35829b8304";
  
    // Try to transfer tokenId 1 to another address
    try {
      await SoulboundToken.transferFrom(deployer.address, recipient, 1);
    } catch (err) {
      console.log("Transfer failed as expected:", err.message);
    }
  }
  
  main().catch(console.error);