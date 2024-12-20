const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const ioClient = require('socket.io-client'); // Import socket.io-client to simulate a connection
const { PrismaClient } = require('@prisma/client'); // Import PrismaClient

const prisma = new PrismaClient(); // Create an instance of PrismaClient

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

// Database connection
prisma.$connect()
  .then(() => {
    console.log('Database connected successfully!');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

// GET /api/data endpoint to return the array of data from the database
app.get('/api/data', async (req, res) => {
  try {
    const items = await prisma.item.findMany(); // Fetch items from the database
    res.json(items); // Return the data as JSON
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
