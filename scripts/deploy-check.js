const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🔍 Deployment readiness check");
  const network = await hre.ethers.provider.getNetwork();
  const [owner] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(owner.address);
  const feeData = await hre.ethers.provider.getFeeData();

  console.log("Network:", network.name, "(", network.chainId.toString(), ")");
  console.log("Deployer:", owner.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "native");
  console.log("Gas price:", feeData.gasPrice ? hre.ethers.formatUnits(feeData.gasPrice, "gwei") : "n/a", "gwei");

  if (balance === 0n) {
    throw new Error("Deployer has zero native balance for gas.");
  }

  console.log("✅ Environment ready. Run `node scripts/deploy-campaign.js` or `node scripts/deploy-simple.js` next.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
