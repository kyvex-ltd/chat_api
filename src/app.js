const express = require('express');
const cors = require('cors');
const app = express();
const https = require('https');
const fs = require('fs');
const connectDB = require('./utilities/db');

// Use body parser middleware to parse incoming requests and allow CORS
app.use(express.json());
app.use(cors())

// Use HTTPS
// Go back 1 directory, then go into the certs folder
const key = fs.readFileSync('../certs/selfsigned.key');
const cert = fs.readFileSync('../certs/selfsigned.crt');


const allowCrossDomain = (req, res, next) => {
    res.header(`Access-Control-Allow-Origin`, `*`);
    res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    next();
};

app.use(allowCrossDomain);


// Connect to MongoDB
connectDB().then(() => console.log("Connected to MongoDB")
).catch(err => {
    console.error(err.message);
    process.exit(1);
});

// Define your routes
const
    routes = {
        auth: require('./routes/auth'),
        users: require('./routes/users'),
        community: require('./routes/community'),
        other: require('./routes/other'),
    };

app.use('/api/v1/users', routes.users);
app.use('/api/v1/auth', routes.auth);
app.use('/api/v1/community', routes.community);
app.use('/api/v1/other', routes.other);


// Set up a 404 error handler
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// log when a request is made
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Set up a global error handler
app.use((error, req, res) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

// Start the server
const port = process.env.PORT || 5000;
https.createServer({key: key, cert: cert}, app).listen(port, () => {
    console.log(`HTTPS server running on port ${port}`);
});

// Export the app
module.exports = app;
