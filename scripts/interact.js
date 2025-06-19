async function main() {
  const RealEstateRegistry = await ethers.getContractFactory("RealEstateRegistry");
  const contract = await RealEstateRegistry.attach("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"); // Use your current deployed address

  // Get the total number of properties
  const nextId = await contract.nextPropertyId();
  for (let i = 0; i < nextId; i++) {
    const property = await contract.getProperty(i);
    console.log(`Property #${i}:`, property);
  }
}

main().catch(console.error);
