const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    /*
        REQUIRED:
        | Name               | Description                                                                 |
        |--------------------|-----------------------------------------------------------------------------|
        | displayName        | The user's display name, this is shown to other users                       |
        | tag                | The user's tag, used to identify the user                                   |
        |                    | Their ID can also be used                                                   |
        | password           | The user's password, hashed using bcrypt                                    |
        | email              | The user's email, used for account recovery and verification                |

        I refuse to elaborate on optional fields
     */

    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false,
        unique: true,
        lowercase: true,
        trim: true
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
        enum: ["contributor", "admin", "moderator", "early adopter", "bug hunter", "subscriber", "email verified", "partner"]
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
            required: true
        },
        roles: {
            type: Array,
            default: []
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
            enum: ['en']
        },
        font: {
            type: String,
            enum: ['serif', 'sans-serif']
        },
        privacy: {
            type: String,
            enum: ['public', 'private', 'friends-only']
        },
        telemetry: {
            type: Boolean,
            default: false
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
