const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

/**
 * This middleware function checks for user authentication.
 * It verifies the provided JSON Web Token, checks if the user exists and returns a status message.
 * If the process fails at any step, an appropriate error status and message are returned.
 *
 * @param {string} token - The token for user authentication.
 *
 * @returns {Promise<Object>} The response is a promise resolving to an object with a `status` property indicating the HTTP status code, a `message` property providing clarification on the status, and, if successful, a `user` property with the authenticated user's data.
 *
 * @async
 *
 * @throws Will throw an error if the provided token is invalid or if the user associated with the token does not exist.
 */


async function auth(token) {
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
