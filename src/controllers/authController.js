const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
require('dotenv').config();

const secret = process.env.JWT_SECRET;

const login = async (req, res) => {
    const { tag, password } = req.body;

    try {
        // Find the user in the database
        const user = await User.findOne({ tag });

        // If the user doesn't exist, send an error response
        if (!user) {
            return res.status(401).json({
                error: {
                    message: 'Invalid email or password'
                }
            });
        }

        // Check if the password is correct
        const passwordMatches = await bcrypt.compare(password, user.password);

        // If the password is incorrect, send an error response
        if (!passwordMatches) {
            return res.status(401).json({
                error: {
                    message: 'Invalid email or password'
                }
            });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });

        // Send the token in the response
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                message: 'Internal server error'
            }
        });
    }
};

const logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        // Update user in the database to remove the token
        const user = await User.findById(userId);
        user.token = null;
        await user.save();

        res.status(204).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { login, logout };