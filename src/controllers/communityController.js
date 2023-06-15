const Community = require('../models/community');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const pictureGenerator = require('../utilities/createImage');

const createCommunity = async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({
            message: `Please ensure all fields are filled out, missing ${
                !name ? 'name' : 'description'
            }`,
        });
    }

    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const userData = await User.findOne({ _id: decoded.id });

        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        const community = new Community({
            name,
            owner: userData.tag,
            description,
            icon: pictureGenerator.createProfilePicture(name),
            members: [userData._id],
        });

        userData.servers.push({
            serverId: community._id,
            role: 'owner',
        });

        await userData.save();
        await community.save();

        return res.status(201).json({ community });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getCommunityById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: `Please provide a community ID` });
    }

    try {
        const community = await Community.findOne({ _id: id });

        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        return res.status(200).json({ community });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateCommunity = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Please provide a community ID' });
    }

    try {
        const community = await Community.findOne({ _id: id });

        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        if (community.owner !== decoded.tag) {
            return res
                .status(401)
                .json({ message: 'You are not the owner of this community' });
        }

        community.name = name;
        community.description = description;

        await community.save();

        return res.status(200).json({ community });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteCommunity = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Please provide a community ID' });
    }

    try {
        const community = await Community.findOne({ _id: id });

        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        if (community.owner !== decoded.tag) {
            return res
                .status(401)
                .json({ message: 'You are not the owner of this community' });
        }

        await community.remove();

        return res.status(200).json({ community });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllCommunities = async (req, res) => {
    try {
        const communities = await Community.find({});
        return res.status(200).json({ communities });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createCommunity,
    getCommunityById,
    updateCommunity,
    deleteCommunity,
    getAllCommunities,
};
