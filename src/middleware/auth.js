const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

// Authentication middle ware
async function auth(token) {
    // Check if the token is valid
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return {status: 401, message: 'Invalid token'};

        // Check if the user exists
        const user = await userModel.findOne({_id: decoded.id});
        if (!user) return {status: 404, message: 'User not found'};

        return {status: 200, message: 'OK', user: user};

    } catch (e) {
        return {status: 401, message: 'Invalid token'};
    }
}

module.exports = auth;
