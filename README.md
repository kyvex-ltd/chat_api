# Chat API

The API serving Kyvex Chat: an open source alternative to Discord.

## Table of Contents

- [Chat API](#chat-api)
    - [Table of Contents](#table-of-contents)
    - [Getting Started](#getting-started)
        - [Prerequisites](#prerequisites)
        - [Installation](#installation)
    - [Tech Stack](#tech-stack)
        - [node.js](#nodejs)
        - [Express](#express)
        - [MongoDB](#mongodb)

## Tech Stack

### [node.js](https://nodejs.org/en/)

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.
This allows us to run JavaScript outside a browser environment.

### [Express](https://expressjs.com/)

Express allows us to easily create the API endpoints and handle requests.

### [MongoDB](https://www.mongodb.com/)

MongoDB is a NoSQL database that allows us to store data in a JSON-like format.

## Getting Started

### Prerequisites

- [node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)
- [npm](https://www.npmjs.com/)
- [git](https://git-scm.com/)

### Installation

1. Clone the repo
   `git clone https://github.com/kyvex-ltd/chat_api.git`

2. Install NPM packages `npm install`
3. Create a `.env` file in the root directory and add the following:
   `MONGO_URI=<your_mongo_uri>`
4. Start the server `npm start`

