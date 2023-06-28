// messageController.js

const
    Message = require('../models/message'),
    User = require('../models/user'),
    Channel = require('../models/channel'),
    Server = require('../models/community'),
    jwt = require('jsonwebtoken');

const notImplemented = async (req, res) => {
    return res.status(501).json({status: 501, message: 'Not implemented'});
}

/*
    - [X] Create a new message
    - [X] Get a message by ID
    - [X] Delete a message by ID - keep no records.
    - [ ] Get messages by user ID - contemplating whether this should be implemented
    - [ ] Edit a message by ID - Soon
 */

const createMessage = async (req, res) => {

    // Check that required fields are present
    // Then authenticate the user and verify that they:
    // - Are a member of the server
    // - Have permission to send messages in the channel
    // Then create the message


    const {content, channel} = req.body;
    if (!content || !channel) return res.status(400).json({status: 400, message: `Missing fields: ${!content ? 'content' : ''} ${!channel ? 'channel' : ''}`});

    // Get token from header and authenticate the user
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({status: 401, message: 'No token, authorisation denied'});
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({status: 401, message: 'Invalid token'});

    try {

        // Get user from token
        const userData = await User.findById(decoded.id);
        if (!userData) return res.status(401).json({message: 'User does not exist', status: 401});

        // Get the channel from ID
        const channelData = Channel.findById(channel);
        if (!channelData) return res.status(401).json({message: 'Channel does not exist', status: 401});

        // Get channel's parent server
        const serverData = await Server.findById(channelData.parentServer);
        if (!serverData) return res.status(401).json({message: 'Server does not exist', status: 401});
        if (!serverData.members.includes(userData._id)) return res.status(401).json({message: 'User is not a member of this server', status: 401});
        if (!serverData.channels.includes(channelData._id)) return res.status(401).json({message: 'Channel is not a member of this server', status: 401});

        // Create message
        const newMessage = new Message({
            content: content,
            author: userData._id,
            channel: channelData._id
        });

        // Save message
        const savedMessage= await newMessage.save();
        if (!savedMessage) return res.status(500).json({status: 500, message: 'Failed to save message'});
        return res.status(200).json({status: 200, message: 'Message created', messageData: savedMessage});

    } catch (err) {
        console.error(err.stack);
        return res.status(500).json({message: err.message});
    }
}

const getMessages = async (req, res) => {
    return notImplemented(req, res);
}

const getMessageById = async (req, res) => {

    const {id} = req.params;
    if (!id) return res.status(400).json({message: 'Missing message ID', status: 400});

    try {

        const messageData = await Message.findById(id);
        if (!messageData) return res.status(404).json({message: 'Message does not exist`', status: 404});
        return res.status(200).json({status: 200, messageData});

    } catch (err) {
        console.error(err.stack);
        return res.status(500).json({message: "Internal server error", status: 500});
    }
}

const removeMessage = async (req, res) => {

    // Authenticate the user, then check if they
    // - [ ] Have permission to delete the message (soon)
    // - [ ] Are the author of the message
    // Then delete the message and return a 200 OK

    const {id} = req.params;
    if (!id) return res.status(400).json({message: 'Missing message ID', status: 400});

    try {

        // Get token from header and authenticate the user
        const token = req.header('x-auth-token');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!token) return res.status(401).json({message: 'Token is not valid', status: 401});
        if (!decoded) return res.status(401).json({message: 'Token is not valid', status: 401});

        // Get user from token
        const userData = await User.findById(decoded.id);

        // Get the message from ID
        const message = Messages.findById(id);
        if (!message) return res.status(404).json({message: 'Message does not exist', status: 404});
        if (!message.author === userData._id) return res.status(401).json({message: 'User is not the author of this message', status: 401});

        const deletedMessage = await message.deleteOne();
        if (!deletedMessage) return res.status(500).json({message: 'Error deleting message', status: 500});
        return res.status(200).json({message: 'Message deleted', status: 200});

    } catch (err) {
        console.error(err.stack);
        return res.status(500).json({message: "Internal server error", status: 500});
    }
}

const updateMessage = async (req, res) => {
    return notImplemented(req, res);
}

module.exports = {createMessage, getMessageById, removeMessage, updateMessage, getMessages};