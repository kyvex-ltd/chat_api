# Chat API

The API serving Kyvex Chat: an open source alternative to Discord.
This API accounts for all the backend functionality of the chat application, like

- **User creation, editing, and deletion** - This feature would allow users to create, edit, and delete their profiles.
  Users would be able to provide their display name, tag, and other profile data such as bio or profile picture. They
  would also be able to specify the servers they are in.
- **Message creation, editing, and deletion** - This feature would enable users to create, edit, and delete messages
  within
  servers and channels. Users would be able to attach files or media to their messages if desired.
- **Server creation, editing, and deletion** - This feature would allow users to create, edit, and delete servers. Users
  could set the server name, description, and other relevant information.
- **Category creation, editing, and deletion** with Channel creation, editing, and deletion - This feature would enable
  users to create, edit, and delete categories and channels within servers. Users would be able to specify the name,
  description, and other relevant information for each category or channel.
- **Friend requests** - This feature would allow users to send and receive friend requests. Users could accept or
  decline
  friend requests and view their list of friends.
- **User authentication** and authorization - This feature would involve implementing a secure login system that
  authenticates users and allows them to access the appropriate features based on their roles and permissions.
- **Direct messaging** - This feature would enable users to communicate privately with each other outside of channels or
  servers.
- **Push notifications** - This feature would send push notifications to users when they receive new messages, friend
  requests, or other updates.
- **User status** - This feature would allow users to set their status (e.g. available, away, offline) to improve
  communication and collaboration within servers.
- **Reactions** - This feature would add support for reactions to make conversations more expressive
  and engaging.
- **Search functionality** - This feature would enable users to search for specific messages, servers, or channels to find
  what they're looking for.

## Table of Contents

## To Do

### User Endpoints

#### User endpoints:
- [ ] POST /users - create a new user
- [ ] GET /users/:id - retrieve a specific user
- [ ] PUT /users/:id - update a specific user
- [ ] DELETE /users/:id - delete a specific user

#### Message endpoints:
- [ ] POST /messages - create a new message
- [ ] GET /messages/:id - retrieve a specific message
- [ ] PUT /messages/:id - update a specific message
- [ ] DELETE /messages/:id - delete a specific message

#### Server endpoints:
- [ ] POST /servers - create a new server
- [ ] GET /servers/:id - retrieve a specific server
- [ ] PUT /servers/:id - update a specific server
- [ ] DELETE /servers/:id - delete a specific server

#### Category and Channel endpoints:
- [ ] POST /categories - create a new category
- [ ] GET /categories/:id - retrieve a specific category
- [ ] PUT /categories/:id - update a specific category
- [ ] DELETE /categories/:id - delete a specific category
- [ ] POST /channels - create a new channel
- [ ] GET /channels/:id - retrieve a specific channel
- [ ] PUT /channels/:id - update a specific channel
- [ ] DELETE /channels/:id - delete a specific channel

#### Friend request endpoints:
- [ ] POST /friend-requests - send a friend request
- [ ] GET /friend-requests/:id - retrieve a specific friend request
- [ ] PUT /friend-requests/:id - accept or decline a friend request
- [ ] DELETE /friend-requests/:id - delete a specific friend request

#### Authentication endpoints:
- [ ] POST /auth/login - authenticate a user and generate a token
- [ ] POST /auth/logout - invalidate a token and log the user out

#### Direct messaging endpoints:
- [ ] POST /direct-messages - send a direct message
- [ ] GET /direct-messages/:id - retrieve a specific direct message
- [ ] PUT /direct-messages/:id - update a specific direct message
- [ ] DELETE /direct-messages/:id - delete a specific direct message

#### User status endpoints:
- [ ] POST /users/:id/status - set a user's status
- [ ] GET /users/:id/status - retrieve a user's status

#### Reaction endpoints:
- [ ] POST /messages/:id/reactions - add a reaction to a message
- [ ] GET /messages/:id/reactions - retrieve reactions for a message

#### Search endpoints:
- [ ] GET /search/messages?q=searchTerm - search for messages
- [ ] GET /search/servers?q=searchTerm - search for servers
- [ ] GET /search/channels?q=searchTerm - search for channels