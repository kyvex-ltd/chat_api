// Community model
// This model is used to store the community information

// Import dependencies
const mongoose = require('mongoose');

// Define the schema
const CommunitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    servers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Server'
    }],
    created: {
        type: Date,
        default: Date.now
    }
});

// Export the model
module.exports = mongoose.model('Community', CommunitySchema);