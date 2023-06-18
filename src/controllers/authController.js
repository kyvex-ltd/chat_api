require('dotenv').config();

const
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    User = require('../models/user'),
    auth = require('../middleware/auth'),
    tokenExpiry = process.env.JWT_EXPIRY,
    secret = process.env.JWT_SECRET;

/*
    - Login: Check if user exists, check if password matches, create token
    - Logout: Invalidate token
 */

const login = async (req, res) => {

    const {tag, password} = req.body;

    try {

        let token;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.findOne({tag: tag});
        if (!user) return res.status(400).json({message: 'User does not exist'});

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({message: 'Invalid credentials'});

        try {
            token = await jwt.sign({id: user._id}, secret, {expiresIn: tokenExpiry});
        } catch (err) {
            console.error(err)
            return res.status(500).json({message: 'Error signing token'});
        }

        return res.status(200).json({
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
        return res.status(400).json({message: err.message});
    }
};
const logout = async (req, res) => {
    try {

        // Get token from header
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({message: 'No token, authorization denied'});

        // Verify token
        const decoded = jwt.verify(token, secret);
        if (!decoded) return res.status(401).json({message: 'Token is not valid'});

        return res.status(200).json({message: 'Logout successful'});
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
}

module.exports = {login, logout}