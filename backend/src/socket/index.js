const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, REDIS_URL, FRONTEND_URL } = require('../config');

const { registerRoomHandlers } = require('./roomHandlers');
const { registerEditorHandlers } = require('./editorHandlers');
const { registerCommentHandlers } = require('./commentHandlers');
const { registerExecutionHandlers } = require('./executionHandlers');
const { registerTimerHandlers } = require('./timerHandlers');
const { registerChatHandlers } = require('./chatHandlers');
const { startSnapshotInterval } = require('../services/snapshotService');

async function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  const pubClient = createClient({ url: REDIS_URL });
  const subClient = pubClient.duplicate();
  await Promise.all([pubClient.connect(), subClient.connect()]);
  io.adapter(createAdapter(pubClient, subClient, { key: 'codepair-socket.io' }));

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        socket.user = decoded;
      } catch (e) {
        socket.user = null;
      }
    }
    next();
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    registerRoomHandlers(io, socket, pubClient);
    registerEditorHandlers(io, socket, pubClient);
    registerCommentHandlers(io, socket, pubClient);
    registerExecutionHandlers(io, socket);
    registerTimerHandlers(io, socket, pubClient);
    registerChatHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  startSnapshotInterval(io);

  return io;
}

module.exports = { initSocket };
