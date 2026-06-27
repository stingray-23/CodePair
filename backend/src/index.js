const express = require('express');
const http = require('http');
const cors = require('cors');
const { initSocket } = require('./socket');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const { PORT, FRONTEND_URL } = require('./config');

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/rooms', roomRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

initSocket(server).then((io) => {
  app.set('io', io);
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize socket server', err);
});
