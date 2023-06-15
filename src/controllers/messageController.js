// messageController.js

const
    Message = require('../models/message'),
    User = require('../models/user'),
    Channel = require('../models/channel'),
    Server = require('../models/server'),
    jwt = require('jsonwebtoken');


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
    if (!content || !channel) return res.status(400).json({msg: `Missing fields: ${!content ? 'content' : ''} ${!channel ? 'channel' : ''}`});

    // Get token from header and authenticate the user
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({msg: 'No token, authorization denied'});
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({msg: 'Token is not valid'});

    try {

        // Get user from token
        const userData = await User.findById(decoded.id);
        if (!userData) return res.status(401).json({msg: 'User does not exist'});

        // Get the channel from ID
        const channelData = Channel.findById(channel);
        if (!channelData) return res.status(401).json({msg: 'Channel does not exist'});

        // Get channel's parent server
        const serverData = await Server.findById(channelData.parentServer);
        if (!serverData) return res.status(401).json({msg: 'Server does not exist'});
        if (!serverData.members.includes(userData._id)) return res.status(401).json({msg: 'User is not a member of this server'});
        if (!serverData.channels.includes(channelData._id)) return res.status(401).json({msg: 'Channel is not a member of this server'});

        // Create message
        const newMessage = new Message({
            content: content,
            author: userData._id,
            channel: channelData._id
        });

        // Save message
        const savedMessage = await newMessage.save();
        if (!savedMessage) return res.status(500).json({msg: 'Error saving message'});
        return res.status(200).json(savedMessage);

    } catch (err) {
        console.error(err.stack);
        return res.status(500).json({msg: err.message});
    }


}

const getMessages = async (req, res) => {
}

const getMessageById = async (req, res) => {

    const {id} = req.params;
    if (!id) return res.status(400).json({msg: 'Missing message ID'});

    try {

        const messageData = await Message.findById(id);
        if (!messageData) return res.status(404).json({msg: 'Message does not exist'});
        return res.status(200).json(messageData);

    } catch (err) {
        console.error(err.stack);
        return res.status(500).json({msg: err.message});
    }
}

const removeMessage = async (req, res) => {

    // Authenticate the user, then check if they
    // - [ ] Have permission to delete the message (soon)
    // - [ ] Are the author of the message
    // Then delete the message and return a 200 OK

    const {id} = req.params;
    if (!id) return res.status(400).json({msg: 'Missing message ID'});

    try {

        // Get token from header and authenticate the user
        const token = req.header('x-auth-token');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!token) return res.status(401).json({msg: 'No token, authorization denied'});
        if (!decoded) return res.status(401).json({msg: 'Token is not valid'});

        // Get user from token
        const userData = await User.findById(decoded.id);

        // Get the message from ID
        const message = Messages.findById(id);
        if (!message) return res.status(404).json({msg: 'Message does not exist'});
        if (!message.author === userData._id) return res.status(401).json({msg: 'User is not the author of this message'});

        const deletedMessage = await message.deleteOne();
        if (!deletedMessage) return res.status(500).json({msg: 'Error deleting message'});
        return res.status(200).json(deletedMessage);

    } catch (err) {
        console.error(err.stack);
        return res.status(500).json({msg: "Internal server error"});
    }
}

const updateMessage = async (req, res) => {}

module.exports = {createMessage, getMessageById, removeMessage };