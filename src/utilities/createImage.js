const {createCanvas} = require("canvas");

function createProfilePicture(username) {
    // Dimensions for the image
    const width = 1024;
    const height = 1024;

    // Instantiate the canvas object
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    // Fill the rectangle with a random color
    context.fillStyle = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    context.fillRect(0, 0, width, height);

    // Draw the first letter of the username
    context.fillStyle = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    context.font = "700 768px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";

    context.fillText(username[0].toUpperCase(), width / 2, height / 2);

    // Return the image buffer
    return canvas.toBuffer("image/png");

}

module.exports = { createProfilePicture };
