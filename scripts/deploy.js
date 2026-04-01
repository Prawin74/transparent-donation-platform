import hre from "hardhat";

async function main() {
  console.log("Deploying DonationCampaign...");
  
  const DonationCampaign = await hre.ethers.getContractFactory("DonationCampaign");
  const donationCampaign = await DonationCampaign.deploy(
    "Help Ukraine Refugees", 
    "Emergency fund for Ukrainian refugees affected by war"
  );
  
  // Wait for deployment to complete - NEW WAY
  await donationCampaign.waitForDeployment();
  
  // Get the contract address
  const contractAddress = await donationCampaign.getAddress();
  
  console.log("DonationCampaign deployed to:", contractAddress);
  console.log("Campaign Name:", await donationCampaign.campaignName());
  console.log("Owner:", await donationCampaign.owner());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });