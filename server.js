// Import http from nodejs
const http = require("http");
// Import app from app.js file
const app = require("./app");

// Create the port using environment port or use 3000
const port = process.env.port || 3000;

// Create the server and pass a listener
const server = http.createServer(app);

// Call listen to start the server and pass port as arguement
server.listen(port);
