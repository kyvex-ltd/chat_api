const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: Buffer
    },
    banner: {
        type: Buffer
    },
    bio: {
        type: String,
        maxlength: 200,
        default: ''
    },
    badges: [{
        type: String,
        default: [],
        enum: ["contributor", "admin", "moderator", "early adopter", "bug hunter", "subscriber"],
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    servers: [{
        serverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Server',
            default: []
        },
        role: {
            type: String,
            enum: ['owner', 'admin', 'member'],
            default: 'member'
        }
    }],
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark']
        },
        notifications: {
            type: Boolean,
            default: true
        },
        language: {
            type: String,
            enum: ['en', 'es', 'fr', 'de']
        },
        font: {
            type: String,
            enum: ['serif', 'sans-serif']
        },
        privacy: { // who can friend request me
            type: String,
            enum: ['public', 'private', 'friends-only']
        },
        timezone: {
            type: String
        }
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
