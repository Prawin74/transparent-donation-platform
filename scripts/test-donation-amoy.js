import hre from "hardhat";
import { config } from 'dotenv';
config();

async function main() {
  // Replace with your actual contract address after deployment
  const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
  
  const DonationCampaign = await hre.ethers.getContractFactory("DonationCampaign");
  const donationCampaign = DonationCampaign.attach(contractAddress);
  
  console.log("=== 🎗️ Campaign Information ===");
  const info = await donationCampaign.getCampaignInfo();
  console.log("📝 Name:", info.name);
  console.log("📋 Description:", info.description);
  console.log("💰 Total Donations:", hre.ethers.formatEther(info.total), "POL");
  console.log("🏦 Current Balance:", hre.ethers.formatEther(info.currentBalance), "POL");
  console.log("📊 Donation Count:", info.donationCount.toString());
  console.log("💸 Withdrawal Count:", info.withdrawalCount.toString());
  
  // Make a test donation
  const [owner, donor] = await hre.ethers.getSigners();
  console.log("\n=== 🤝 Making Test Donation ===");
  
  const donationAmount = hre.ethers.parseEther("0.001"); // Small amount
  const tx = await donationCampaign.connect(donor).donate({ value: donationAmount });
  console.log("📫 Transaction sent:", tx.hash);
  
  await tx.wait();
  console.log("✅ Donation confirmed!");
  
  // Check updated info
  console.log("\n=== 📈 Updated Campaign Info ===");
  const updatedInfo = await donationCampaign.getCampaignInfo();
  console.log("💰 Total Donations:", hre.ethers.formatEther(updatedInfo.total), "POL");
  console.log("📊 Donation Count:", updatedInfo.donationCount.toString());
  
  console.log("\n🌐 View on Polygonscan: https://amoy.polygonscan.com/address/" + contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
