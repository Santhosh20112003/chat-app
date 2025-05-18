const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// Allow CORS from your frontend deployed URL or localhost during dev
app.use(cors({
  origin: [
    "http://localhost:3000",            // local dev frontend
    "https://your-frontend.vercel.app" // replace with your Vercel frontend URL
  ],
  methods: ["GET", "POST"],
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://your-frontend.vercel.app"
    ],
    methods: ["GET", "POST"],
  },
});

let onlineUsers = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (username) => {
    onlineUsers.push({ id: socket.id, username });
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('message', (data) => {
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((user) => user.id !== socket.id);
    io.emit('onlineUsers', onlineUsers);
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
