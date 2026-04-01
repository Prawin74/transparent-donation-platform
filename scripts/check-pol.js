import hre from "hardhat";
import { config } from 'dotenv';
config();

async function main() {
  const [owner] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(owner.address);
  
  console.log("👤 Address:", owner.address);
  console.log("💰 POL Balance:", hre.ethers.formatEther(balance), "POL");
  
  const required = "0.05"; // 0.05 POL needed
  if (parseFloat(hre.ethers.formatEther(balance)) < parseFloat(required)) {
    console.log("❌ Need at least", required, "POL for deployment");
    console.log("💧 Faucets:");
    console.log("   https://faucet.polygon.technology/");
    console.log("   https://www.alchemy.com/faucets/polygon-amoy");
  } else {
    console.log("✅ Ready to deploy!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
  });
