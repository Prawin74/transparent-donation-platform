const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DonationCampaignModule", (m) => {
  const title = m.getParameter("title", "Transparent Donation Campaign");
  const description = m.getParameter("description", "Public, auditable donations");
  const goalAmount = m.getParameter("goalAmount", 0);
  const stablecoinToken = m.getParameter("stablecoinToken");
  const metadataIpfsHash = m.getParameter("metadataIpfsHash", "");

  const donationCampaign = m.contract("DonationCampaign", [
    title,
    description,
    goalAmount,
    stablecoinToken,
    metadataIpfsHash,
  ]);

  return { donationCampaign };
});

