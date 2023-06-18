const fs = require('fs');
const readline = require('readline');

// Create .env file manually (user edits .env after it is created)
async function createEnvFileManual() {
    const env = fs.createWriteStream('.env');
    env.write(`# This is the .env file for the backend\n`);
    env.write(`# We've added some default values for you\n`);
    env.write(`\n`);
    env.write(`MONGODB_URI=""\n`);
    env.write(`PORT=3000\n`);

    const jwtSecret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    env.write(`JWT_SECRET=${jwtSecret}\n`);
    env.write(`JWT_EXPIRY=7d\n`);
    env.write(`\n`);

    env.write(`# Assuming Let's Encrypt and Certbot are used\n`);
    env.write(`USE_HTTPS="true"\n`);
    env.write(`SSL_KEYS="/etc/letsencrypt/live/yourdomain.com/privkey.pem"\n`);
    env.write(`SSL_CERTS="/etc/letsencrypt/live/yourdomain.com/fullchain.pem"\n`);
    env.write(`\n`);

    env.write(`# This is the email address that will be used to send emails\n`);
    env.write(`# for example, when a user requests a password reset\n`);
    env.write(`# This is not yet implemented\n`);
    env.write(`EMAIL_ADDRESS=""\n`);
    env.write(`EMAIL_PASSWORD=""\n`);

    await new Promise((resolve) => env.end(resolve));

    console.log('Created .env file');
    console.log('Please fill in the missing values');
    process.exit(1);
}

class ValidationHelper {
    static validateMongoDBURI(uri) {
        return uri.startsWith('mongodb://');
    }

    static validatePort(port) {
        const parsedPort = parseInt(port);
        return Number.isInteger(parsedPort) && parsedPort >= 0 && parsedPort <= 65535;
    }

    static validateJWTExpiry(expiry) {
        return /^\d+[smhdw]$/.test(expiry);
    }

    static validateUseHTTPS(useHTTPS) {
        return useHTTPS === 'true' || useHTTPS === 'false';
    }

    static validateFilePath(filePath) {
        return fs.existsSync(filePath);
    }

    static validateEmailAddress(email) {
        return /^\S+@\S+\.\S+$/.test(email);
    }

    static validateEmailPassword(password) {
        return password.length >= 8;
    }

}


// Create .env file interactively (user prompted to fill out fields within the terminal)
async function createEnvFileInteractive() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const env = fs.createWriteStream('.env');
    env.write(`# This is the .env file for the backend\n`);
    env.write(`# We'll guide you to fill in the values\n`);
    env.write(`\n`);

    const questions = [
        {field: 'MONGODB_URI', label: 'MongoDB URI', validate: ValidationHelper.validateMongoDBURI},
        {field: 'PORT', label: 'Port', validate: ValidationHelper.validatePort},
        {field: 'JWT_EXPIRY', label: 'JWT Expiry (e.g., 7d, 1h)', validate: ValidationHelper.validateJWTExpiry},
        {field: 'USE_HTTPS', label: 'Use HTTPS (true/false)', validate: ValidationHelper.validateUseHTTPS},
        {field: 'SSL_KEYS', label: 'SSL Keys File Path', validate: ValidationHelper.validateFilePath},
        {field: 'SSL_CERTS', label: 'SSL Certificates File Path', validate: ValidationHelper.validateFilePath},
        {field: 'EMAIL_ADDRESS', label: 'Email Address', validate: ValidationHelper.validateEmailAddress},
        // { field: 'EMAIL_PASSWORD', label: 'Email Password', validate: ValidationHelper.validateEmailPassword, hide: true }
    ];


    for (const question of questions) {

        if (question.field === 'USE_HTTPS') env.write(`# Assuming Let's Encrypt and Certbot are used\n`);

        if (question.field === 'EMAIL_ADDRESS') {
            env.write(`# This is the email address that will be used to send emails\n`);
            env.write(`# for example, when a user requests a password reset\n`);
            env.write(`# This is not yet implemented\n`);

            console.log('Please note that this (email) feature is not yet implemented');
            console.log('It will be implemented in a future release for password resets');
        }

        if (question.field === 'SSL_KEYS' || question.field === 'SSL_CERTS') {
            console.log('Please note that this (HTTPS) feature is not yet implemented');
            console.log('It will be implemented in a future release');
        }

        let response;
        do {
            response = await askQuestion(rl, `${question.label}: `);
        } while (!question.validate(response));

        env.write(`${question.field}="${response}"\n`);
    }

    env.write(`JWT_SECRET=${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}\n`);

    await new Promise((resolve) => env.end(resolve));

    console.log('Created .env file');
    process.exit(1);
}

// Helper function to ask a question and get the user's response
function askQuestion(rl, question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

module.exports = {
    createEnvFileManual,
    createEnvFileInteractive
}