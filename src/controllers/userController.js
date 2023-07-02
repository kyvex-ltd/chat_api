require('dotenv').config();

const
    UserModel = require('../models/user'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    secret = process.env.JWT_SECRET,
    createImage = require('../utilities/createImage'),
    auth = require('../middleware/auth');


/*
    - Create a new user
    - Get user by ID
    - Update user by ID
    - Delete user by ID
*/

const regex = {
    tag: /^[a-zA-Z0-9]+$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
}


const createUser = async (req, res) => {

    const {tag, displayName, password, email} = req.body;
    if (!tag || !displayName || !password) return res.status(400).json({
        status: 400,
        message: `Missing fields: ${!tag ? 'tag' : ''} ${!displayName ? 'displayName' : ''} ${!password ? 'password' : ''}`
    });

    if (!regex.tag.test(tag)) return res.status(400).json({
        status: 400,
        message: 'Tag must be alphanumeric'
    });
    if (!regex.password.test(password)) return res.status(400).json({
        status: 400,
        message: 'Password must be at least 8 characters long, contain at least one letter and one number'
    });


    try {

        const
            salt = await bcrypt.genSalt(10),
            hash = await bcrypt.hash(password, salt);

        // Check if there is already a user with the same Tag
        // find user in db

        const user = await UserModel.findOne({tag});
        if (user) return res.status(409).json({
            status: 409,
            message: `User with username "${tag}" already exists`
        });


        const avatar = await createImage.createProfilePicture(tag[0].toUpperCase());
        const newUser = new UserModel({
            tag,
            displayName,
            email,
            avatar,
            password: hash
        });

        const token = await jwt.sign({id: newUser._id}, secret, {expiresIn: '168h'})
        await newUser.save();

        // return user (no passwd), and token
        return res.status(201).json({
            status: 201,
            message: 'User created',
            user: {id: newUser._id, tag: newUser.tag, displayName: newUser.displayName, email: newUser.email},
            token: token
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });
    }

};
const getUserByTag = async (req, res) => {

    // use the AUTH middleware to get and verify the token
    // Note: The token isn't a requirement for this route, so if it's not present, we just return the user without
    // sensitive information (email, password, preferences etc.)

    const {tag} = req.params;
    let token;

    try {
        token = req.headers.authorization.split(' ')[1];
    } catch (e) {
        console.error(e);
    }

    if (!tag) return res.status(400).json({
        status: 400,
        message: 'Missing tag'
    });

    if (!regex.tag.test(tag)) return res.status(400).json({
        status: 400,
        message: 'Tag must be alphanumeric'
    });


    try {

        let {status, message, user} = await auth(req.headers.authorization.split(' ')[1]);
        const userData = user;
        userData.password = undefined;

        if (status === 401) {
            userData.email = undefined;
            userData.preferences = undefined;
            userData.servers = undefined;

            return res.status(200).json({
                status: 200,
                message: 'User found, but with reduced data due to missing or invalid token',
                user: userData
            });
        } else if (status === 404) {
            return res.status(404).json({
                status: 404,
                message: 'User not found'
            });
        } else if (status === 200) {
            return res.status(200).json({
                status: 200,
                message: 'User found with elevated data',
                user: userData
            });
        } else {
            return res.status(500).json({
                status: 500,
                message: 'Internal server error'
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });
    }
};


const updateUserById = async (req, res) => {
};
const deleteUserById = async (req, res) => {
};

module.exports = {createUser, getUserByTag, updateUserById, deleteUserById};
