const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const ioClient = require('socket.io-client'); // Import socket.io-client to simulate a connection

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.io with the HTTP server

const port = 3000;

// Simulate a client connection from the server itself
const simulatedSocket = ioClient(`http://localhost:${port}`);

simulatedSocket.on('connect', () => {
  console.log('Simulated client connected to the server');

  // Send a test event to the server
  simulatedSocket.emit('ping');
});

simulatedSocket.on('pong', (message) => {
  console.log(message);  // Expected: "Server received ping"
});

// Handle Socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Listen for the "ping" event
  socket.on('ping', () => {
    console.log('Ping received from simulated client');
    socket.emit('pong', 'Server received ping');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
const dataArray = [
    { id: 1, name: "Item 1", description: "This is the first item." },
    { id: 2, name: "Item 2", description: "This is the second item." },
    { id: 3, name: "Item 3", description: "This is the third item." },
  ];
  
  // GET /api/data endpoint to return the array of data
  app.get('/api/data', (req, res) => {
    res.json(dataArray);
  });

// Start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
