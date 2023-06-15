const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    "name": {
        type: String,
        required: true
    },
    "server": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Server',
        required: true
    },
    "parentCategory": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        default: null
    },
    "parentServer": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Server',
        required: true
    },
    "messages": [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: []
    }],
    "topic": {
        type: String,
        default: ""
    },
    "nsfw": {
        type: Boolean,
        default: false
    },
    "archived": {
        type: Boolean,
        default: false
    },
    "private": {
        type: Boolean,
        default: false
    },
    "invites": [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invite',
        default: []
    }],
    "permissions": [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
        default: []
    }],
    "pins": [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: []
    }],
    "last_message": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    },
    "created": {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Channel', channelSchema);