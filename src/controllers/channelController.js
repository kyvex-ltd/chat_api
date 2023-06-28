const Channel = require('../models/channel');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {authorise} = require('../utilities/auth');

const createChannel = async (req, res) => {

    const {name, description} = req.body;

    if (!name || !description) {
        return res.status(400).json({
            status: 400,
            message: `Please ensure all fields are filled out, missing ${
                !name ? 'name' : 'description'
            }`,
        });
    }

    try {

        const userData = authorise(req.headers.authorization);
        if (userData.status !== 200) return res.status(userData.status).json({userData, message: userData.message, status: userData.status});

        const channel = new Channel({
            name,
            owner: userData.tag,
            description,
            members: [userData._id],
        });

        userData.servers.push({
            serverId: channel._id,
            role: 'owner',
        });

        await userData.save();
        await channel.save();

        return res.status(201).json({status: 201, channel});
    } catch (e) {
        console.error(e);
        return res.status(500).json({message: 'Internal server error', status: 500});
    }

}