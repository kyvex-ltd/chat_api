// Community model
// This model is used to store the community information

// Import dependencies
const mongoose = require('mongoose');

// Define the schema
const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    description: {
        type: String,
        maxlength: 200,
        default: ''
    },
    owner: {
        type: String,
        ref: 'User',
        required: true
    },
    icon: {
        type: Buffer,
        default: null
    },
    banner: {
        type: Buffer,
        default: null
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    created: {
        type: Date,
        default: Date.now
    },
});

// Export the model
module.exports = mongoose.model('Community', communitySchema);

