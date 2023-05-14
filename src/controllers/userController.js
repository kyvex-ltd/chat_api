const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const regex = {
    tag: /^[a-zA-Z0-9]+$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)\w{8,}$/
}


const createUser = async (req, res) => {

    console.log(`Received request to create user: ${JSON.stringify(req.body)}`);

    try {

        const
            {displayName, tag, password} = req.body;

        // Check that all required fields are present
        if (!tag || !displayName || !password) {
            return res.status(400).json({message: `Some fields are missing`
                    + `(${!tag ? 'tag' : !displayName ? 'display name' : 'password'})`});
        }

        // Check that the tag & password are valid
        if (!regex.tag.test(tag)) return res.status(400).json({message: 'Invalid tag '
                + '- must contain only letters and numbers'});
        if (!regex.password.test(password)) return res.status(400).json({message: 'Invalid password - '
                + 'must be at least 8 characters long and contain at least one letter and one number'});

        // Check that the tag is unique
        const existingUser = await User.findOne({tag});
        if (existingUser) return res.status(400).json({message: 'Tag already exists'});

        // Hash and salt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            tag,
            displayName,
            password: hashedPassword.toString()
        });

        try {
            const
                newUser = await user.save(),
                token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

            return res.status(201).json({ token });

        } catch (err) {
            res.status(400).json({message: err.message});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server Error"});
    }
};
const getUserById = async (req, res) => {

    console.log(`Received request to get user by ID: ${JSON.stringify(req.params)}`);

    try {
        // check if user is authorized to update user information
        const
            authHeader = req.headers['authorization'],
            token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json({message: 'Authentication token required'});


        const
            {id} = req.params,
            user = await User.findById(id);

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server Error"});
    }
};
const updateUserById = async (req, res) => {

    console.log(`Received request to update user by ID: ${JSON.stringify(req.params)}`);

    const
        userId = req.params.id,
        {displayName, tag, avatar, banner, bio, badges} = req.body;

    try {

        // check if user is authorized to update user information
        const
            authHeader = req.headers['authorization'],
            token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json({message: 'Authentication token required'});


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        // Update user fields
        user.displayName = displayName || user.displayName;
        user.tag = tag || user.tag;
        user.avatar = avatar || user.avatar;
        user.banner = banner || user.banner;
        user.bio = bio || user.bio;
        user.badges = badges || user.badges;

        // Save updated user
        await user.save();

        return res.status(200).json({user});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server Error"});
    }
};
const deleteUserById = async (req, res) => {

    console.log(`Received request to delete user by ID: ${JSON.stringify(req.params)}`);

    try {

        // check if user is authorized to update user information
        const
            authHeader = req.headers['authorization'],
            token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json({message: 'Authentication token required'});


        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        return res.json({message: "User deleted successfully"});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Failed to delete user"});
    }
};

module.exports = {
    createUser,
    getUserById,
    updateUserById,
    deleteUserById,
};





