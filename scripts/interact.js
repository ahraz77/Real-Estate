async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  const RealEstateRegistry = await ethers.getContractFactory("RealEstateRegistry");
  const contract = await RealEstateRegistry.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"); // Updated deployed address

  // Register a new property for testing
  const tx = await contract.registerProperty("Test Location", 1000);
  await tx.wait();
  console.log("Registered new property: Test Location, 1000");

  // Get the total number of registered properties
  const nextId = await contract.nextPropertyId();
  for (let i = 0; i < nextId; i++) {
    try {
      const property = await contract.getProperty(i);
      console.log(`Property #${i}:`, property);
    } catch (err) {
      console.log(`Property #${i} does not exist.`);
    }
  }

  // Example: Get all properties owned by the deployer/owner address
  const propertyIds = await contract.getPropertiesByOwner(owner.address);
  for (const id of propertyIds) {
    const property = await contract.getProperty(id);
    console.log(`Property #${id} (owned by deployer):`, property);
  }
}

main().catch(console.error);
