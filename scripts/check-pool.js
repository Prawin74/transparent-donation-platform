const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const { TARGET_CONTRACT_ADDRESS } = process.env;
  if (!TARGET_CONTRACT_ADDRESS) {
    throw new Error("Set TARGET_CONTRACT_ADDRESS in .env");
  }

  const decimals = Number(process.env.STABLECOIN_DECIMALS || 6);
  const campaign = await hre.ethers.getContractAt("DonationCampaign", TARGET_CONTRACT_ADDRESS);
  const summary = await campaign.getSummary();

  console.log("🏦 Campaign Pool State");
  console.log("----------------------");
  console.log("Title:", summary[0]);
  console.log("Description:", summary[1]);
  console.log("Goal:", hre.ethers.formatUnits(summary[2], decimals));
  console.log("Total Raised:", hre.ethers.formatUnits(summary[3], decimals));
  console.log("Donations Count:", summary[4].toString());
  console.log("Withdrawals Count:", summary[5].toString());

  const donations = await campaign.getDonations();
  console.log("\n📥 Donations:");
  donations.forEach((d, idx) => {
    console.log(`#${idx} donor=${d.donor} amount=${hre.ethers.formatUnits(d.amount, decimals)} ts=${d.timestamp}`);
  });

  const withdrawals = await campaign.getWithdrawals();
  console.log("\n📤 Withdrawals:");
  withdrawals.forEach((w, idx) => {
    console.log(`#${idx} amount=${hre.ethers.formatUnits(w.amount, decimals)} purpose=${w.purpose} proof=${w.proofIpfsHash} ts=${w.timestamp}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

