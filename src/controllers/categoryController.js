const Channel = require('../models/category');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {authorise} = require('../utilities/auth');
const auth = require("../middleware/auth");

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

        let userData = await auth(req.headers.authorization.split(' ')[1]);
        if (userData.status !== 200) return res.status(userData.status).json({ message: userData.message, status: userData.status });
        userData = userData.user;

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

