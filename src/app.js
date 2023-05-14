const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./utilities/db');

// Use body parser middleware to parse incoming requests
app.use(express.json());

// Allow CORS (Cross-Origin Resource Sharing) for all origins
app.use(cors());

// Connect to MongoDB
connectDB().then(r => console.log("Connected to MongoDB" + r)
).catch(err => {
    console.error(err.message);
    process.exit(1);
});

// Define your routes
const
    routes = {
        auth: require('./routes/auth'),
        users: require('./routes/users'),
    };

app.use('/api/v1/users', routes.users);
app.use('/api/v1/auth', routes.auth);

// Set up a 404 error handler
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
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
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
});

// Export the app
module.exports = app;
