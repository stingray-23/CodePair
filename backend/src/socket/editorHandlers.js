const { getStarterCode, getParticipantColor } = require('../services/roomService');

function registerEditorHandlers(io, socket, redisClient) {
  socket.on('code-change', async ({ roomCode, code, cursorPosition }) => {
    try {
      await redisClient.hSet(`codepair:room:${roomCode}`, 'code', code);
      socket.to(roomCode).emit('code-updated', {
        code,
        cursorPosition,
        updatedBy: socket.username,
      });
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('language-change', async ({ roomCode, language }) => {
    try {
      const starterCode = getStarterCode(language);
      await redisClient.hSet(`codepair:room:${roomCode}`, { language, code: starterCode });
      io.to(roomCode).emit('language-updated', { language, code: starterCode });
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('cursor-move', async ({ roomCode, lineNumber, column }) => {
    try {
      const roomStateData = await redisClient.hGetAll(`codepair:room:${roomCode}`);
      const participants = JSON.parse(roomStateData.participants || '[]');
      const color = getParticipantColor(socket.id, participants);

      socket.to(roomCode).emit('remote-cursor', {
        socketId: socket.id,
        username: socket.username,
        color,
        lineNumber,
        column,
      });
    } catch (err) {
      console.error(err);
    }
  });
}

module.exports = { registerEditorHandlers };
