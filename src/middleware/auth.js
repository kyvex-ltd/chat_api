const
    jwt = require('jsonwebtoken');

// Authentication middle ware
const auth = async (req, res, next) => {
    try {
        // Authenticate the user
        const
            token = req.headers.authorization.split(' ')[1],
            decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user to request
        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

module.exports = auth;
