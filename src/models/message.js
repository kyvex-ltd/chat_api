const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    "content": {
        type: String,
        required: true
    },
    "author": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    "channel": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: true
    },
    "timestamp": {
        type: Date,
        default: Date.now
    },
    "edited": {
        type: Boolean,
        default: false
    },
    "edits": [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: []
    }],
    "reactions": [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reaction',
        default: []
        // EXAMPLE: [ { "emoji": "👍", "users": [ "tag" ] } ]
    }],
    "attachments": [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attachment',
        default: []
    }],
    "mentions": [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    "pinned": {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Message', messageSchema);