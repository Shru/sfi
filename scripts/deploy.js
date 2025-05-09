async function main() {
  const SoulboundToken = await ethers.getContractFactory("SoulboundToken");
  const contract = await SoulboundToken.deploy("SocialFi SBT", "SBT");
  await contract.deployed();
  console.log("SoulboundToken deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 