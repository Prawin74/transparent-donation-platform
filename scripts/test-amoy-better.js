import hre from "hardhat";
import { config } from 'dotenv';
config();

async function main() {
  console.log("🧪 Testing Donation Platform on Amoy...");
  
  // First, let's check if we're connected properly
  const provider = hre.ethers.provider;
  const network = await provider.getNetwork();
  console.log("📡 Connected to:", network.name, "(Chain ID:", network.chainId + ")");
  
  const [owner, donor] = await hre.ethers.getSigners();
  console.log("👤 Owner Address:", owner.address);
  console.log("👥 Donor Address:", donor.address);
  
  // Check balances
  const ownerBalance = await provider.getBalance(owner.address);
  const donorBalance = await provider.getBalance(donor.address);
  console.log("💰 Owner Balance:", hre.ethers.formatEther(ownerBalance), "POL");
  console.log("💰 Donor Balance:", hre.ethers.formatEther(donorBalance), "POL");
  
  // Ask for contract address
  console.log("\n📝 Please enter your deployed contract address:");
  console.log("   (Run: npx hardhat run scripts/deploy-amoy.js --network amoy)");
  console.log("   Then copy the address and update this script.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
