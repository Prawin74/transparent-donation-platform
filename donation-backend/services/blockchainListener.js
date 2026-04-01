const { ethers } = require('ethers');
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const { getIo } = require('./socketService');

// ABI for DonationReceived event
const CONTRACT_ABI = [
    "event DonationReceived(address indexed donor, string campaignId, uint256 amount, address indexed recipient, uint256 timestamp)"
];

const startBlockchainListener = async () => {
    try {
        const providerUrl = process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology'; // Default to Amoy Testnet
        const contractAddress = process.env.DONATION_PLATFORM_ADDRESS;

        if (!contractAddress) {
            console.warn("⚠️  DONATION_PLATFORM_ADDRESS not set. Blockchain listener skipped.");
            return;
        }

        console.log(`📡 Starting Blockchain Listener on ${providerUrl} for contract ${contractAddress}`);

        const provider = new ethers.JsonRpcProvider(providerUrl, undefined, {
            staticNetwork: true // Optimisation for known networks
        });

        // Explicitly disable ENS to prevent "network does not support ENS" errors on Amoy
        const network = await provider.getNetwork();
        if (network.chainId === 80002n) {
            network.ensAddress = null;
        }
        const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);

        contract.on('DonationReceived', async (donor, campaignId, amount, recipient, timestamp, event) => {
            console.log(`🔔 Donation Event Detected: ${ethers.formatEther(amount)} ETH to ${campaignId}`);

            try {
                const amountEth = parseFloat(ethers.formatEther(amount));
                const txHash = event.log.transactionHash;

                // 1. Save to Database
                // Check if already exists to avoid dupes from re-orgs or restarts
                const existing = await Donation.findOne({ transactionHash: txHash });
                if (existing) return;

                // Find campaign to get internal ID
                const campaign = await Campaign.findById(campaignId);
                if (!campaign) {
                    console.error(`Campaign ${campaignId} not found for donation ${txHash}`);
                    return;
                }

                const newDonation = new Donation({
                    campaign: campaign._id,
                    donor: null, // We can try to look up user by address if we want, but keeping it simple
                    transactionHash: txHash,
                    amount: amountEth,
                    timestamp: new Date(Number(timestamp) * 1000)
                });

                await newDonation.save();

                // Update Campaign Total
                campaign.raisedAmount = (campaign.raisedAmount || 0) + amountEth;
                await campaign.save();

                // 2. Emit Real-Time Event via Socket.IO
                const io = getIo();
                io.emit('newDonation', {
                    campaignId: campaignId,
                    amount: amountEth,
                    donor: donor,
                    transactionHash: txHash,
                    timestamp: new Date()
                });

                console.log(`✅ Processed & Emitted Donation: ${txHash}`);

            } catch (err) {
                console.error("Error processing blockchain event:", err);
            }
        });

    } catch (error) {
        console.error("❌ Blockchain Listener Error:", error);
    }
};

module.exports = { startBlockchainListener };
