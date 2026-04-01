const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
require('dotenv').config();

const http = require('http');
const { initsocket } = require('./services/socketService');
const { startBlockchainListener } = require('./services/blockchainListener');

const app = express();
const server = http.createServer(app);
const io = initsocket(server); // Initialize Socket.IO

// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const campaignRoutes = require('./routes/campaignRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/transactions', require('./routes/transactionRoutes'));

// Start Blockchain Listener
startBlockchainListener();

const PORT = 3001;

// Configuration
// Hardhat Local Node
const PROVIDER_URL = "http://127.0.0.1:8545";
// Account #0 Private Key (Hardhat Default)
const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

// MongoDB Connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/globalgive')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));


const MOCK_TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const PAYMENT_LOGGER_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

// Minimal ABIs
const TOKEN_ABI = [
    "function mint(address to, uint256 amount) external",
    "function balanceOf(address owner) view returns (uint256)"
];
const LOGGER_ABI = [
    "function logDeposit(string memory paymentId, uint256 fiatAmount, uint256 conversionRate, uint256 cryptoAmount, address userAddress) external"
];

// Setup Provider and Wallet
const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const tokenContract = new ethers.Contract(MOCK_TOKEN_ADDRESS, TOKEN_ABI, wallet);
const loggerContract = new ethers.Contract(PAYMENT_LOGGER_ADDRESS, LOGGER_ABI, wallet);

// Mock Database for status
const users = {};

app.post('/api/create-payment-intent', (req, res) => {
    const { amount, currency } = req.body;
    // Simulate Stripe Payment Intent
    const paymentId = "pi_" + Math.random().toString(36).substr(2, 9);
    console.log(`Created Payment Intent: ${paymentId} for ${amount} ${currency}`);
    res.json({ clientSecret: "secret_" + paymentId, paymentId });
});

app.post('/api/execute-swap', async (req, res) => {
    const { paymentId, amount, userAddress } = req.body;

    console.log(`Processing swap for ${paymentId}: $${amount} -> Crypto for ${userAddress}`);

    try {
        // 1. Calculate Conversion (Mock Rate: 1 USD = 0.98 USDC after fees)
        const rate = 0.98;
        const cryptoAmount = amount * rate;
        const cryptoAmountWei = ethers.parseUnits(cryptoAmount.toString(), 18); // USDC usually 6 decimals but MockToken I made is default 18 unless specified. I used ERC20 default which is 18.

        // 2. Mint Tokens to User (Simulating transfer from exchange)
        console.log(`Minting ${cryptoAmount} tokens to ${userAddress}...`);
        const mintTx = await tokenContract.mint(userAddress, cryptoAmountWei);
        await mintTx.wait();
        console.log(`Minted: ${mintTx.hash}`);

        // 3. Log to Blockchain
        console.log(`Logging deposit...`);
        const amountWei = ethers.parseUnits(amount.toString(), 18); // varying precision but fine for log
        // rate is float, lets instantiate rate as wei or fixed point? 
        // Contract expects uint256 for all. Let's send rate as 98 (cents) or 9800 (basis points).
        // Let's use basis points: 9800 = 0.98. 
        // Or just store the string rep if needed, but contract says uint256. 
        // I'll assume rate is scaled by 10000.
        const conversionRateScaled = BigInt(Math.floor(rate * 10000));

        const logTx = await loggerContract.logDeposit(
            paymentId,
            amountWei,
            conversionRateScaled,
            cryptoAmountWei,
            userAddress
        );
        await logTx.wait();
        console.log(`Logged: ${logTx.hash}`);

        res.json({
            status: "success",
            txHash: mintTx.hash,
            logHash: logTx.hash,
            cryptoAmount: cryptoAmount,
            symbol: "USDC"
        });

    } catch (error) {
        console.error("Swap failed:", error);
        res.status(500).json({ error: error.message });
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please free the port and try again.`);
        process.exit(1);
    } else {
        console.error('Server error:', e);
    }
});
