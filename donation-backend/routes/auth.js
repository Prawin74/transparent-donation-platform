const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Verify role is valid
        if (!['donor', 'ngo'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User (NGOs require verification)
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            isVerified: true // NGO verification temporarily disabled
            // isVerified: role === 'donor' // Donors auto-verified, NGOs pending
        });

        await newUser.save();

        // Generate Token
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role, isVerified: newUser.isVerified },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                isVerified: newUser.isVerified
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Role-specific check
        /* NGO verification temporarily disabled
        if (user.role === 'ngo' && !user.isVerified) {
            return res.status(403).json({
                error: 'Your NGO account is pending verification.',
                pendingVerification: true
            });
        }
        */

        const token = jwt.sign(
            { id: user._id, role: user.role, isVerified: user.isVerified },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET PROFILE
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET PENDING NGOs (Admin only)
router.get('/pending-ngos', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }
        const pendingNGOs = await User.find({ role: 'ngo', isVerified: false })
            .select('-password');
        res.json(pendingNGOs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADMIN VERIFICATION
router.patch('/verify-ngo/:userId', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }

        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.role !== 'ngo') {
            return res.status(400).json({ error: "User is not an NGO" });
        }

        user.isVerified = true;
        await user.save();

        res.json({ message: `NGO ${user.name} has been verified.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
