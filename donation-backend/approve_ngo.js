const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = 'mongodb://localhost:27017/globalgive';

async function main() {
    try {
        await mongoose.connect(MONGO_URI);
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    }

    const targetEmail = process.argv[2];

    if (targetEmail) {
        const user = await User.findOne({ email: targetEmail });
        if (!user) {
            console.log(`User with email ${targetEmail} not found.`);
        } else if (user.role !== 'ngo') {
            console.log(`User ${targetEmail} is not an NGO. Role is ${user.role}`);
        } else {
            user.isVerified = true;
            await user.save();
            console.log(`Successfully verified NGO: ${user.name} (${user.email})`);
        }
    } else {
        console.log("--- Pending NGO Verifications ---");
        const pendingNGOs = await User.find({ role: 'ngo', isVerified: false });
        if (pendingNGOs.length === 0) {
            console.log("No pending NGOs found.");
        } else {
            pendingNGOs.forEach(ngo => {
                console.log(`- Name: ${ngo.name}, Email: ${ngo.email}, ID: ${ngo._id}`);
            });
            console.log("\nTo verify an NGO, run: node approve_ngo.js <email>");
        }
    }

    await mongoose.disconnect();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
