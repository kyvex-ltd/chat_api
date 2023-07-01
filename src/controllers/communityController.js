const Community = require('../models/community');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const pictureGenerator = require('../utilities/createImage');
const { authorise } = require('../utilities/auth');
const userModel = require("../models/user");

const createCommunity = async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({
            status: 400,
            message: `Please ensure all fields are filled out, missing ${
                !name ? 'name' : 'description'
            }`,
        });
    }

    try {
        let userData = await auth(req.headers.authorization.split(' ')[1]);
        if (userData.status !== 200) return res.status(userData.status).json({ message: userData.message, status: userData.status });
        userData = userData.user;

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

        return res.status(201).json({ message: 'Community created', community, status: 201 });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
};

const getCommunityById = async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: `Please provide a community ID`, status: 400 });
        try {
        const community = await Community.findOne({ _id: id });

        if (!community) {
            return res.status(404).json({ message: 'Community not found', status: 404 });
        }

        return res.status(200).json({ community, status: 200 });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
};

const updateCommunity = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Please provide a community ID', status: 400 });
    }

    try {
        const community = await Community.findOne({ _id: id });

        if (!community) {
            return res.status(404).json({ message: 'Community not found', status: 404 });
        }

        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) return res.status(401).json({ message: 'Invalid token', status: 401 });


        if (community.owner !== decoded.tag) {
            return res
                .status(401)
                .json({ message: 'You are not the owner of this community', status: 401 });
        }

        community.name = name;
        community.description = description;

        await community.save();

        return res.status(200).json({ community });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
};

const deleteCommunity = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Please provide a community ID', status: 400 });
    }

    try {
        const community = await Community.findOne({ _id: id });
        if (!community) return res.status(404).json({ message: 'Community not found', status: 404 });

        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token', status: 401 });
        }

        if (community.owner !== decoded.tag) {
            return res
                .status(401)
                .json({ message: 'You are not the owner of this community', status: 401 });
        }

        await community.remove();

        return res.status(200).json({ community, status: 200 });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
};

const getAllCommunities = async (req, res) => {
    try {
        const communities = await Community.find({});
        return res.status(200).json({ communities, status: 200 });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
};

module.exports = {
    createCommunity,
    getCommunityById,
    updateCommunity,
    deleteCommunity,
    getAllCommunities,
};
