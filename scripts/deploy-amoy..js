import hre from "hardhat";
import { config } from 'dotenv';
config();

async function main() {
  console.log("🚀 Deploying to Polygon Amoy...");
  
  const DonationCampaign = await hre.ethers.getContractFactory("DonationCampaign");
  const donationCampaign = await DonationCampaign.deploy(
    "Transparent Ukraine Relief Fund", 
    "100% transparent donations for humanitarian aid. All transactions publicly verifiable on blockchain."
  );
  
  await donationCampaign.waitForDeployment();
  const contractAddress = await donationCampaign.getAddress();
  
  console.log("✅ DonationCampaign deployed to:", contractAddress);
  console.log("📝 Campaign Name:", await donationCampaign.campaignName());
  console.log("👤 Owner:", await donationCampaign.owner());
  console.log("🌐 Check on Polygonscan: https://amoy.polygonscan.com/address/" + contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });