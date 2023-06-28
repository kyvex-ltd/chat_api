const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function authorise(token) {
    const tokenWithoutBearer = token.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        if (!decoded) return { status: 401, message: 'Unauthorised' };

        const userData = await User.findOne({ _id: decoded._id });
        if (!userData) return { status: 401, message: 'Unauthorised' };

        return userData;
    } catch (error) {
        if (error.name === 'JsonWebTokenError') throw new Error('Invalid token');
         else if (error.name === 'TokenExpiredError') throw new Error('Token expired');
        else throw error;
    }
}

module.exports = authorise;
