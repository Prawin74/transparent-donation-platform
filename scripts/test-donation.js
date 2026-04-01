import hre from "hardhat";

async function main() {
  // Replace with your actual contract address from deployment
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Copy from deployment output
  
  const DonationCampaign = await hre.ethers.getContractFactory("DonationCampaign");
  const donationCampaign = DonationCampaign.attach(contractAddress);
  
  console.log("=== 🎗️ Campaign Information ===");
  const info = await donationCampaign.getCampaignInfo();
  console.log("📝 Name:", info.name);
  console.log("📋 Description:", info.description);
  console.log("💰 Total Donations:", hre.ethers.formatEther(info.total), "ETH");
  console.log("🏦 Current Balance:", hre.ethers.formatEther(info.currentBalance), "ETH");
  console.log("📊 Donation Count:", info.donationCount.toString());
  console.log("💸 Withdrawal Count:", info.withdrawalCount.toString());
  
  // Make a donation (using account #1 as donor)
  const [owner, donor] = await hre.ethers.getSigners();
  console.log("\n=== 🤝 Making Donation ===");
  console.log("Donor:", donor.address);
  
  const donationAmount = hre.ethers.parseEther("0.1"); // 0.1 ETH
  const tx = await donationCampaign.connect(donor).donate({ value: donationAmount });
  await tx.wait();
  
  console.log("✅ Donation successful!");
  console.log("📫 Transaction Hash:", tx.hash);
  
  // Check updated info
  console.log("\n=== 📈 Updated Campaign Info ===");
  const updatedInfo = await donationCampaign.getCampaignInfo();
  console.log("💰 Total Donations:", hre.ethers.formatEther(updatedInfo.total), "ETH");
  console.log("📊 Donation Count:", updatedInfo.donationCount.toString());
  console.log("🏦 Current Balance:", hre.ethers.formatEther(updatedInfo.currentBalance), "ETH");
  
  // Get the specific donation details
  console.log("\n=== 📋 Latest Donation Details ===");
  const donationIndex = Number(updatedInfo.donationCount) - 1;
  const donation = await donationCampaign.getDonation(donationIndex);
  console.log("👤 Donor:", donation.donor);
  console.log("💎 Amount:", hre.ethers.formatEther(donation.amount), "ETH");
  console.log("⏰ Timestamp:", new Date(Number(donation.timestamp) * 1000).toLocaleString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });