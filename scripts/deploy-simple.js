const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const { STABLECOIN_ADDRESS, SIMPLE_POOL_NAME = "Quick Donation Pool" } = process.env;
  if (!STABLECOIN_ADDRESS) {
    throw new Error("Set STABLECOIN_ADDRESS in .env");
  }

  const SimpleDonation = await hre.ethers.getContractFactory("SimpleDonation");
  const simpleDonation = await SimpleDonation.deploy(SIMPLE_POOL_NAME, STABLECOIN_ADDRESS);

  await simpleDonation.waitForDeployment();
  const contractAddress = await simpleDonation.getAddress();

  console.log("✅ SimpleDonation deployed to:", contractAddress);
  console.log("📝 Pool name:", await simpleDonation.name());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
