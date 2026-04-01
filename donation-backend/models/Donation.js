const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true
    },
    donor: {
        type: String, // Wallet Address
        required: true
    },
    transactionHash: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'ETH'
    },
    status: {
        type: String,
        enum: ['success', 'failed'],
        required: true,
        default: 'success'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Donation', donationSchema);
