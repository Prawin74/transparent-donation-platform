const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    targetAmount: {
        type: Number,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        enum: ['Medical', 'Education', 'Disaster Relief', 'Social Cause'],
        default: 'Social Cause'
    },
    beneficiaryName: {
        type: String,
        required: true
    },
    image: {
        type: String // URL or base64 string
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    raisedAmount: {
        type: Number,
        default: 0
    },
    // Wallet Architecture
    walletAddress: {
        type: String,
        required: true,
        trim: true
    },
    network: {
        type: String,
        enum: ['Ethereum', 'Polygon', 'BSC'],
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'ONGOING', 'Completed', 'Expired', 'Deleted'],
        default: 'ONGOING'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
