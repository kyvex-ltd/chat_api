require('dotenv').config();

const
    jwt = require('jsonwebtoken'),
    User = require('../models/user'),
    bcrypt = require('bcrypt'),
    tokenExpiry = process.env.JWT_EXPIRY,
    secret = process.env.JWT_SECRET;
const authorise = require("../utilities/auth");

/*
    - Login: Check if user exists, check if password matches, create token
    - Logout: Invalidate token
    - Logged in: Check if token is valid
 */

const login = async (req, res) => {

    const {tag, password} = req.body;

    try {

        let token;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.findOne({tag: tag});
        if (!user) return res.status(400).json({status: 400, message: 'User does not exist'});

        // Check if password matches
        const isMatch = await bcrypt.compare(hashedPassword, user.password);
        if (!isMatch) return res.status(400).json({status: 400, message: 'Invalid credentials'});

        try {
            token = await jwt.sign({id: user._id}, secret, {expiresIn: tokenExpiry});
        } catch (err) {
            console.error(err)
            return res.status(500).json({status: 500, message: 'Error signing token'});
        }

        return res.status(200).json({
            status: 200,
            token: token,
            user: {
                id: user._id,
                tag: user.tag,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err)
        return res.status(400).json({status: 500, message: "Internal server error"});
    }
};
const logout = async (req, res) => {
    try {
        // Get token from header
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({status: 401, message: 'No token, authorisation denied'});

        // Verify token
        const decoded = jwt.verify(token, secret);
        if (!decoded) return res.status(401).json({status: 401, message: 'Token is not valid'});

        return res.status(200).json({status: 200, message: 'Logged out successfully'});
    } catch (err) {
        return res.status(500).json({status: 500, message: err.message});
    }
};
const loggedIn = async (req, res) => {
    const userData = authorise(req.headers.authorization);
    if (userData.status !== 200) return res.status(userData.status).json({status: userData.status, message: userData.message});
}

module.exports = {login, logout, loggedIn}