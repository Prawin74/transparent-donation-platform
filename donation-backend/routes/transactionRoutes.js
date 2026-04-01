const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const { getIo } = require('../services/socketService');

// POST /api/transactions - Validates and creates a transaction
router.post('/', async (req, res) => {
    try {
        const { campaignId, transactionHash, amount, donor, donorName, status } = req.body;

        if (!campaignId || !transactionHash || !amount || !donor) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check for duplicates
        const existing = await Donation.findOne({ transactionHash });
        if (existing) {
            return res.status(200).json({ message: "Transaction already recorded", transaction: existing });
        }

        const donation = new Donation({
            campaign: campaignId,
            donor,
            transactionHash,
            amount,
            status: status || 'success',
            timestamp: new Date()
        });

        await donation.save();

        // Update Campaign Raised Amount
        const campaign = await Campaign.findById(campaignId);
        if (campaign) {
            campaign.raisedAmount = (campaign.raisedAmount || 0) + Number(amount);
            await campaign.save();
        }

        // Emit Real-time Event
        try {
            const io = getIo();
            const eventPayload = {
                transactionId: donation._id,
                campaignId: campaignId,
                donorName: donorName || 'Anonymous', // Use provided name or default
                amount: amount,
                timestamp: donation.timestamp,
                transactionHash: transactionHash,
                status: donation.status
            };

            io.emit('transactionCreated', eventPayload);
            console.log(`[Socket] Emitted transactionCreated: ${transactionHash}`);
        } catch (socketError) {
            console.error("Socket emit failed:", socketError);
            // Don't fail the request if socket fails
        }

        res.status(201).json({ message: "Transaction recorded", transaction: donation });

    } catch (error) {
        console.error("Transaction Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/transactions - Get recent transactions (Limit 20)
router.get('/', async (req, res) => {
    try {
        const transactions = await Donation.find()
            .sort({ timestamp: -1 })
            .limit(20)
            .populate('campaign', 'title');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
