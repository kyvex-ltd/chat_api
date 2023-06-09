require('dotenv').config();

const responseTime = require('response-time');
const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const connectDB = require('./utilities/db');
const path = require('path');
const {createEnvFileInteractive, createEnvFileManual} = require('./utilities/envSetup');
const logStream = fs.createWriteStream(path.join(__dirname, '../logs/requests.log'), { flags: 'a' });

const useHttps = process.env.USE_HTTPS === 'true';
const app = express();
const args = process.argv.slice(2);

function main() {
    // Use body parser middleware to parse incoming requests and allow CORS
    app.use(express.json());
    app.use(cors())
    app.use(responseTime((req, res, time) => {
        logStream.write(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${time}ms\n`);
    }));


    let cert, key;

    // Use HTTPS
    if (useHttps) {
        key = fs.readFileSync(process.env.SSL_KEYS);
        cert = fs.readFileSync(process.env.SSL_CERTS);
    }
    else {
        console.log(args.includes('-nhw'))
        console.log(args.includes('--no-http-warning'))
        if (!args.includes('--no-http-warning') || !args.includes('-nhw')) {
            // Warn the user that HTTPS is disabled and try to persuade them to use HTTPS (it is cool)
            console.warn('=============================================================================================');
            console.warn('HTTPS is disabled!');
            console.warn('Please use HTTPS in production');
            console.warn()

            // Why use HTTPS?
            console.warn('Why use HTTPS?');
            console.warn('> Using HTTPS is important because it encrypts the data sent between');
            console.warn('> the client and the server. This means that if someone is listening');
            console.warn('> in on the connection, they won\'t be able to (easily) see the data being');
            console.warn('> sent. This is especially important when sending sensitive data');
            console.warn('> like passwords and credit card numbers.');
            console.warn()

            // How do I configure HTTPS?
            console.warn("How do I configure HTTPS?");
            console.warn('> If you\'re using Let\'s Encrypt and Certbot, you can set the');
            console.warn('> USE_HTTPS environment variable to true in your .env file.');
            console.warn('> You will also need to set the SSL_KEYS and SSL_CERTS environment');
            console.warn('> variables to the paths of your SSL keys and certificates.');
            console.warn('> Example paths for Let\'s Encrypt and Certbot with Apache are`');
            console.warn('> already set in the .env file, you just need to change "yourdomain.com"');
            console.warn('> to your domain.');
            console.warn('> For help on getting SSL certificates, see');
            console.warn('> https://letsencrypt.org/getting-started/');
            console.warn('=============================================================================================');
        }
    }

    const allowCrossDomain = (req, res, next) => {
        res.header(`Access-Control-Allow-Origin`, `*`);
        res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
        res.header(`Access-Control-Allow-Headers`, `Content-Type`);
        next();
    };

    app.use(allowCrossDomain);

    // Connect to MongoDB
    connectDB().catch(err => {
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
            // channel: require('./routes/channels'),
            // category: require('./routes/categories'),
            };

    app.use('/api/v1/users', routes.users);
    app.use('/api/v1/auth', routes.auth);
    app.use('/api/v1/community', routes.community);
    app.use('/api/v1/other', routes.other);



    // Start the server
    const port = process.env.PORT || 3000;
    if (useHttps) {
        https.createServer({key: key, cert: cert}, app).listen(port, () => {
            console.log(`HTTPS server running on port ${port}`);
        });
    } else {
        app.listen(port, () => {
            console.log(`HTTP server running on port ${port}`);
        });
    }

    // Set up a 404 error handler
    app.use((req, res, next) => {
        const error = new Error('Endpoint not found');
        error.status = 404;
        logStream.write(`404 ${req.method} ${req.path}\n`);
        logStream.write(error.message + '\n\n\n')
        next(error);
    });

// Set up a global error handler
    app.use((error, req, res, next) => {
        logStream.write(`Error: ${error.message}\n`);
        res.status(error.status || 500).send({ status: error.status || 500, message: `C: ${error.status}: ${error.message}` });
    });

    // Export the app
    module.exports = app;
}

// Check if .env exists (async)
async function checkEnvExists() {
    try {
        await fs.promises.access('.env');
    } catch (err) {
        // Ask the user if they want to create the .env file interactively or manually
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        await new Promise((resolve) => {
            rl.question('Do you want to create the .env file interactively? (y/n) ', async (answer) => {
                if (answer.toLowerCase() === 'y' || answer.toLowerCase() === '') {
                    console.log()
                    console.log('Creating .env file interactively...');
                    await createEnvFileInteractive();
                } else {
                    console.log()
                    console.log('Creating .env file manually...');
                    await createEnvFileManual();
                }

                resolve();
            });
        });

        rl.close();
    }
}

(async () => {
    await checkEnvExists();
    await main();
})();