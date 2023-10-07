const express = require('express');
const port = 5000;
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5000'],
    methods: ['GET', 'POST'],
  },
});
app.use(cors());
app.get('/', (req, res) => {
  console.log('in home');
  res.send('Board/Container route');
});
app.get('*', (req, res) => {
  res.send('404 Page Not Found');
});
io.of('/container/board').on('connection', (socket) => {
  console.log('User connected to /container/board');

  socket.on('canvas-draw', (draw) => {
    socket.broadcast.emit('canvas-draw', draw);
  });
  socket.on('canvas-erase', (eraseData) => {
    socket.broadcast.emit('canvas-erase', eraseData);
  });

  socket.on('canvas-erase-all', () => {
    socket.broadcast.emit('canvas-erase-all'); // Broadcast 'canvas-erase-all' to all clients except the sender
  });
  socket.on('disconnect', () => {
    console.log('User disconnected from /container/board');
  });
});
http.listen(port, () => {
  console.log('Server started on port:', port);
});
