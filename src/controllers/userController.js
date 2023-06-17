require('dotenv').config();

const
    UserModel = require('../models/user'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    secret = process.env.JWT_SECRET,
    createImage = require('../utilities/createImage');


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

    const {tag, displayName, email, password} = req.body;
    if (!tag || !displayName || !password) return res.status(400).json({msg: `Missing fields: ${!tag ? 'tag' : ''} ${!displayName ? 'displayName' : ''} ${!password ? 'password' : ''}`});

    console.log(`RECEIVED: Create user with username "${tag}", displayName "${displayName}" and email "${email}""`);

    if (!regex.tag.test(tag)) return res.status(400).json({msg: 'Tag must be alphanumeric'});
    if (!regex.password.test(password)) return res.status(400).json({msg: 'Password must be at least 8 characters long, contain at least one letter and one number'});


    try {

        const
            salt = await bcrypt.genSalt(10),
            hash = await bcrypt.hash(password, salt);

        // Check if there is already a user with the same Tag
        // find user in db

        const user = await UserModel.findOne({tag});
        if (user) {
            res.status(400).json({msg: `User with username "${tag}" already exists`});
            return console.log(`ERROR: Request to create user with username "${tag}", displayName "${displayName}" and email "${email}"" failed: User already exists`);
        }


        const avatar = await createImage.createProfilePicture(tag[0].toUpperCase());

        const newUser = new UserModel({
            tag,
            displayName,
            email,
            avatar,
            password: hash
        });

        await newUser.save();

        console.log(`SUCCESS: Request to create user with username "${tag}", displayName "${displayName}" and email "${email}""`);


        // return user (no passwd), and token
        return res.status(201).json({
            msg: 'User created',
            user: {id: newUser._id, tag: newUser.tag, displayName: newUser.displayName, email: newUser.email},
            token: jwt.sign({id: newUser._id}, secret, {expiresIn: '168h'})
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({msg: 'Internal server error'});
    }

};
const getUserByTag = async (req, res) => {

    const {tag} = req.params;

    try {

        let user = await UserModel.findOne({tag});
        if (!user) return res.status(404).json({msg: `User "${tag}" not found`});

        delete user.password;
        return res.status(200).json({msg: 'User found', user});

    } catch (e) {
        console.error(e);
        res.status(500).json({msg: 'Internal server error, please try again later'});
    }
};

const updateUserById = async (req, res) => {
};
const deleteUserById = async (req, res) => {
};

module.exports = {createUser, getUserByTag, updateUserById, deleteUserById};





