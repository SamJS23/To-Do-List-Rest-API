const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');
require('dotenv').config();


// Create refresh token
function createRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
}

// Validate password
function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    return re.test(password);
}

// Sign Up
const signUp = async (req, res) => {
    try {
        const { email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                message: "Password must be 6–20 characters long and include an uppercase, lowercase, and a number."
            });
        }

        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user without passing `name` (it will be optional)
        await Users.create({
            email,
            password: hashedPassword
        });

        res.json({ message: "Registration successful!" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Sign In 
const signIn = async (req, res) => {
    try {
        const { email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }
        const allUsers = await Users.findAll();
        const user = allUsers.find(u => 
            u.email.toLowerCase() === email.toLowerCase().trim()
        );

        if (!user) return res.status(400).json({ message: "Email Not Found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Password Not Found" });

        const refreshToken = createRefreshToken({ id: user.id });
        const expiry = 24 * 60 * 60 * 1000;

        res.cookie('refreshtoken', refreshToken, {
            httpOnly: true,
            path: '/',
            maxAge: expiry,
            expires: new Date(Date.now() + expiry)
        });

        res.json({
            message: "Signed in successfully!",
            token: refreshToken,
            user: {
                id: user.id,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get User Info
const userInfo = async (req, res) => {
    try {
        const userId = req.user.id;

        const allUsers = await Users.findAll();
        const user = allUsers.find(u => u.id === userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        const userObj = user.toJSON?.();
        const { password, ...userWithoutPassword } = userObj;

        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update User Data
const updateUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;

        if (!name || name.length < 3) {
            return res.status(400).json({ message: "Name must be at least 3 characters long" });
        }

        const allUsers = await Users.findAll();
        const user = allUsers.find(u => u.id === userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = name;
        await user.save();

        res.json({ message: "Name updated successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Logout function
const logout = async (req, res) => {
    try {
        res.clearCookie('refreshtoken', { path: '/', httpOnly: true, expires: new Date(0) });
        res.json({ message: "Logged out successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





module.exports = {
    signUp,
    signIn,
    userInfo,
    updateUser,
    logout
};
