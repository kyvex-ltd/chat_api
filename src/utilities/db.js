const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/local';
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        await mongoose.connect(connectionString, options);
        console.log('Connected to MongoDB');

    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
    }
};

module.exports = connectDB;
