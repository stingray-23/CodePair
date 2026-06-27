const prisma = require('../prisma');

function registerRoomHandlers(io, socket, redisClient) {
  socket.on('join-room', async ({ roomCode, username, role }) => {
    try {
      const room = await prisma.room.findUnique({ where: { roomCode } });
      if (!room) {
        return socket.emit('error', { message: 'Room not found' });
      }

      if (room.expiresAt && room.expiresAt < new Date()) {
        return socket.emit('error', { message: 'Room has expired' });
      }

      socket.join(roomCode);
      socket.roomCode = roomCode;
      socket.username = username;
      socket.role = role;

      const roomStateData = await redisClient.hGetAll(`codepair:room:${roomCode}`);
      const participants = JSON.parse(roomStateData.participants || '[]');
      const colors = ['#6366f1', '#06b6d4', '#f59e0b', '#ec4899', '#22c55e'];
      const color = colors[participants.length % colors.length];

      participants.push({ id: socket.id, username, role, color });
      await redisClient.hSet(`codepair:room:${roomCode}`, 'participants', JSON.stringify(participants));

      const commentsStr = await redisClient.get(`codepair:room:${roomCode}:comments`);
      
      socket.emit('room-state', {
        code: roomStateData.code || '',
        language: roomStateData.language || 'javascript',
        timerSeconds: parseInt(roomStateData.timerSeconds || '3600'),
        timerStatus: roomStateData.timerStatus || 'stopped',
        timerStartedAt: parseInt(roomStateData.timerStartedAt || '0'),
        participants,
        comments: JSON.parse(commentsStr || '[]'),
      });

      socket.to(roomCode).emit('user-joined', {
        socketId: socket.id,
        username,
        role,
        color,
        participants,
      });

      if (socket.user) {
        const session = await prisma.session.create({
          data: { roomId: room.id, userId: socket.user.id }
        });
        socket.sessionId = session.id;
      }
    } catch (err) {
      console.error(err);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  socket.on('leave-room', async ({ roomCode }) => {
    socket.leave(roomCode);
    handleUserLeave(socket, redisClient, io);
  });

  socket.on('disconnect', () => {
    if (socket.roomCode) {
      handleUserLeave(socket, redisClient, io);
    }
  });
}

async function handleUserLeave(socket, redisClient, io) {
  try {
    const roomCode = socket.roomCode;
    const roomStateData = await redisClient.hGetAll(`codepair:room:${roomCode}`);
    if (roomStateData && roomStateData.participants) {
      let participants = JSON.parse(roomStateData.participants || '[]');
      participants = participants.filter(p => p.id !== socket.id);
      await redisClient.hSet(`codepair:room:${roomCode}`, 'participants', JSON.stringify(participants));
      
      io.to(roomCode).emit('user-left', {
        socketId: socket.id,
        username: socket.username,
        participants,
      });
    }

    if (socket.sessionId) {
      await prisma.session.update({
        where: { id: socket.sessionId },
        data: { leftAt: new Date() }
      });
    }
  } catch (err) {
    console.error('Error handling leave', err);
  }
}

module.exports = { registerRoomHandlers };
