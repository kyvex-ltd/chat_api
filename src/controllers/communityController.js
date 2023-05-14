const Community = require('../models/community');

const create = async (req, res) => {
    try {
        const {name, description} = req.body;

        // Create new community
        const community = new Community({name, description});
        const savedCommunity = await community.save();

        res.status(201).json(savedCommunity);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const get = async (req, res) => {
    try {
        const {id} = req.params;

        // Find community by ID
        const community = await Community.findById(id);
        if (!community) {
            return res.status(404).json({error: 'Community not found'});
        }

        res.status(200).json(community);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const update = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, description} = req.body;

        // Find community by ID
        const community = await Community.findById(id);
        if (!community) {
            return res.status(404).json({error: 'Community not found'});
        }

        // Update community
        community.name = name;
        community.description = description;
        const savedCommunity = await Community.save();

        res.status(200).json(savedCommunity);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const remove = async (req, res) => {
    try {
        const {id} = req.params;

        // Find community by ID
        const community = await Community.findById(id);
        if (!community) {
            return res.status(404).json({error: 'Community not found'});
        }

        // Delete community
        await community.remove();

        res.status(204).json();
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = {create, get, update, remove}
