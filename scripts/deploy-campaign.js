const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const {
    STABLECOIN_ADDRESS,
    CAMPAIGN_TITLE = "Transparent Donation Campaign",
    CAMPAIGN_DESCRIPTION = "On-chain, auditable donations with stablecoin transparency.",
    CAMPAIGN_GOAL = "1000",
    STABLECOIN_DECIMALS = "6",
    CAMPAIGN_METADATA_IPFS_HASH = "",
  } = process.env;

  if (!STABLECOIN_ADDRESS) {
    throw new Error("Set STABLECOIN_ADDRESS in .env");
  }

  const goalAmount = hre.ethers.parseUnits(CAMPAIGN_GOAL, Number(STABLECOIN_DECIMALS));

  console.log("🚀 Deploying DonationCampaign...");
  console.log("Deployer:", deployer.address);
  console.log("Stablecoin:", STABLECOIN_ADDRESS);

  const DonationCampaign = await hre.ethers.getContractFactory("DonationCampaign");
  const donationCampaign = await DonationCampaign.deploy(
    CAMPAIGN_TITLE,
    CAMPAIGN_DESCRIPTION,
    goalAmount,
    STABLECOIN_ADDRESS,
    CAMPAIGN_METADATA_IPFS_HASH
  );

  await donationCampaign.waitForDeployment();
  const contractAddress = await donationCampaign.getAddress();

  console.log("✅ DonationCampaign deployed to:", contractAddress);
  console.log("ℹ️  Title:", CAMPAIGN_TITLE);
  console.log("ℹ️  Goal:", CAMPAIGN_GOAL);
  console.log("🔗 Explorer:", `https://explorer-or-scan/{network}/address/${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

