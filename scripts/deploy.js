async function main() {
  const RealEstateRegistry = await ethers.getContractFactory("RealEstateRegistry");
  const contract = await RealEstateRegistry.deploy();
  await contract.waitForDeployment();
  console.log("Deployed to:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
