const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = 'mongodb://localhost:27017/globalgive';

async function main() {
    try {
        await mongoose.connect(MONGO_URI);
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    }

    const email = 'admin@globalgive.com';
    const password = 'adminpassword';

    let admin = await User.findOne({ email });

    if (admin) {
        console.log('Admin already exists.');
    } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        admin = new User({
            name: 'Super Admin',
            email,
            password: hashedPassword,
            role: 'admin',
            isVerified: true
        });

        await admin.save();
        console.log(`Admin created: ${email} / ${password}`);
    }

    await mongoose.disconnect();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
