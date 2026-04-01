const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const { authMiddleware } = require('../middleware/auth');
const Donation = require('../models/Donation');
const { getIo } = require('../services/socketService');

// Manual POST to log donation (Audit Trail redundancy)
router.post('/log-donation', async (req, res) => {
    try {
        const { campaignId, transactionHash, amount, donor, status } = req.body;

        // Basic check if already logged by listener
        const existing = await Donation.findOne({ transactionHash });
        if (existing) {
            return res.status(200).json({ message: "Donation already logged" });
        }

        const donation = new Donation({
            campaign: campaignId,
            donor,
            transactionHash,
            amount,
            timestamp: new Date()
        });
        await donation.save();

        // Update campaign raised amount if not already done
        // Note: Listener handles this usually. We'll skip double counting here 
        // or add logic to check if listener processed it. 
        // For now, we'll just save the record if missing.

        res.status(201).json(donation);
    } catch (error) {
        console.error("Donation log error:", error);
        res.status(500).json({ error: error.message });
    }
});

// CREATE CAMPAIGN (NGO Only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'ngo') {
            return res.status(403).json({ error: "Access denied. Only NGOs can create campaigns." });
        }

        const { title, description, targetAmount, deadline, category, beneficiaryName, image, walletAddress, network } = req.body;

        if (!title || !description || !targetAmount || !deadline || !beneficiaryName || !walletAddress || !network) {
            return res.status(400).json({ error: "All required fields must be provided, including wallet address and network." });
        }

        // Basic EVM Address Validation
        const evmAddressRegex = /^0x[a-fA-F0-9]{40}$/;
        if (!evmAddressRegex.test(walletAddress)) {
            return res.status(400).json({ error: "Invalid wallet address format. Must be a valid Ethereum-style address." });
        }

        const newCampaign = new Campaign({
            title,
            description,
            targetAmount,
            deadline,
            category,
            beneficiaryName,
            image,
            walletAddress,
            network,
            owner: req.user.id
        });

        const savedCampaign = await newCampaign.save();

        // Emit Socket Event
        try {
            const io = getIo();
            io.emit('campaignCreated', savedCampaign);
        } catch (socketError) {
            console.error("Socket emit failed:", socketError);
        }

        res.status(201).json(savedCampaign);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET MY CAMPAIGNS (Authenticated User)
router.get('/my', authMiddleware, async (req, res) => {
    try {
        const campaigns = await Campaign.find({
            owner: req.user.id,
            isDeleted: false  // Exclude deleted campaigns
        }).sort({ createdAt: -1 });
        res.json(campaigns);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET ALL CAMPAIGNS (Public)
router.get('/', async (req, res) => {
    try {
        const campaigns = await Campaign.find({
            status: { $in: ['Active', 'ONGOING'] },
            isDeleted: false  // Exclude deleted campaigns
        }).sort({ createdAt: -1 });
        res.json(campaigns);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET SINGLE CAMPAIGN
router.get('/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id).populate('owner', 'name email');
        if (!campaign) return res.status(404).json({ error: "Campaign not found" });

        // Block access to deleted campaigns
        if (campaign.isDeleted) {
            return res.status(410).json({ error: "Campaign has been deleted" });
        }

        res.json(campaign);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/campaigns/:id/donations - Record a donation
router.post('/:id/donations', authMiddleware, async (req, res) => {
    try {
        const { transactionHash, amount } = req.body;
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        const donation = new Donation({
            campaign: campaign._id,
            donor: req.user.userId,
            transactionHash,
            amount
        });

        await donation.save();

        // Update campaign raised amount
        campaign.raisedAmount = (campaign.raisedAmount || 0) + Number(amount);
        await campaign.save();

        // Emit Socket Event for Donation
        try {
            const io = getIo();
            io.emit('donationUpdated', {
                campaignId: campaign._id,
                raisedAmount: campaign.raisedAmount,
                recentDonation: donation
            });
        } catch (socketError) {
            console.error("Socket emit failed:", socketError);
        }

        res.status(201).json(donation);
    } catch (error) {
        console.error("Error recording donation:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/campaigns/:id/donations - Get donation history
router.get('/:id/donations', async (req, res) => {
    try {
        const donations = await Donation.find({ campaign: req.params.id })
            .sort({ timestamp: -1 });
        res.json(donations);
    } catch (error) {
        console.error("Error fetching donations:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/campaigns/user/:walletAddress - Get all donations by a user wallet
router.get('/user/:walletAddress', async (req, res) => {
    try {
        const { walletAddress } = req.params;
        // Case insensitive match
        const regex = new RegExp(walletAddress, 'i');
        const donations = await Donation.find({ donor: { $regex: regex } })
            .populate('campaign', 'title status raisedAmount targetAmount')
            .sort({ timestamp: -1 });
        res.json(donations);
    } catch (error) {
        console.error("Error fetching user donations:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Soft Delete a campaign
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        // Check if already deleted
        if (campaign.isDeleted) {
            return res.status(410).json({ message: 'Campaign already deleted' });
        }

        // Check if user is the owner
        if (campaign.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this campaign' });
        }

        // Soft delete: mark as deleted instead of removing
        campaign.isDeleted = true;
        campaign.deletedAt = new Date();
        campaign.status = 'Deleted';
        await campaign.save();

        // Emit Socket Event for Deletion
        try {
            const io = getIo();
            io.emit('campaignDeleted', campaign._id);
        } catch (socketError) {
            console.error("Socket emit failed:", socketError);
        }

        res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
