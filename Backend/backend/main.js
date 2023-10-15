const express = require('express');
const port = 3001;
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const envPath = path.join(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath });
console.log('env', process.env.NODE_ENV);
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: ['https://let-us-draw.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'],
});
app.use(cors());

// DEPLOYMENT PRODUCTION
console.log('path', path.resolve());
const frontendBuildPath = path.join(
  __dirname,
  '..',
  '..',
  'Frontend',
  'drawing',
  'build'
);
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(frontendBuildPath)));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendBuildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    console.log('in home');
    res.send('Board/Container route');
  });
  app.get('*', (req, res) => {
    res.send('404 Page Not Found');
  });
}

io.on('connection', (socket) => {
  console.log('User conneected');
  socket.on('join-room', (room) => {
    console.log('User joined room:', room);
    socket.join(room);
  });

  socket.on('canvas-draw', (draw) => {
    // Emit 'canvas-draw' only to users in the same room
    io.to(draw.room).emit('canvas-draw', draw);
  });

  socket.on('canvas-erase', (eraseData) => {
    // Emit 'canvas-erase' only to users in the same room
    io.to(eraseData.room).emit('canvas-erase', eraseData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected ');
  });
});
http.listen(port, () => {
  console.log('Server started on port:', port);
});
