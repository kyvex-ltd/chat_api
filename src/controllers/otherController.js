const
    User = require('../models/user'),
    Community = require('../models/community');

const getUserCount = async (req, res) => {
    try {
        const count = await User.countDocuments();
        return res.status(200).json({count: count});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: err.message});
    }
}

const getCommunityCount = async (req, res) => {
    try {
        const count = await Community.countDocuments();
        return res.status(200).json({count: count});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: err.message});
    }
}

module.exports = {
    getUserCount,
    getCommunityCount
}
