import hre from "hardhat";
import { config } from 'dotenv';
config();

async function main() {
  console.log("🌐 Testing Polygon Amoy Connection...");
  
  try {
    const provider = hre.ethers.provider;
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    
    console.log("✅ Connected to network:", network.name);
    console.log("📦 Chain ID:", network.chainId);
    console.log("🔢 Current Block:", blockNumber);
    
    const [owner] = await hre.ethers.getSigners();
    const balance = await provider.getBalance(owner.address);
    
    console.log("👤 Owner Address:", owner.address);
    console.log("💰 Balance:", hre.ethers.formatEther(balance), "POL");
    
    if (balance > 0) {
      console.log("✅ You have POL for gas fees!");
    } else {
      console.log("❌ You need POL! Get from: https://faucet.polygon.technology/");
    }
    
  } catch (error) {
    console.log("❌ Connection failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
