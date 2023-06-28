const
    User = require('../models/user'),
    Community = require('../models/community');

const getCount = async (Model, req, res) => {
    try {
        const count = await Model.countDocuments();
        return res.status(200).json({ status: 200, count });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
}

const getUserCount = (req, res) => getCount(User, req, res);
const getCommunityCount = (req, res) => getCount(Community, req, res);

module.exports = {
    getUserCount,
    getCommunityCount
}
