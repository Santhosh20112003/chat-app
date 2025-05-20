const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

const allowedOrigins = ['http://localhost:3000', 'https://chat-app-39x6.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      console.log('CORS allowed for origin:', origin);
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

const server = http.createServer(app);

// Replace with your deployed frontend URL (NO trailing slash!)
const io = new Server(server, {
  cors: {
    origin: "https://chat-app-39x6.vercel.app",
    methods: ["GET", "POST"],
  },
});

// Dummy API to test backend
app.get('/', (req, res) => {
  res.send("Chat server is running!");
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

// ✅ Use Render's dynamic port
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
