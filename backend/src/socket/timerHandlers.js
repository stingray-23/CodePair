function registerTimerHandlers(io, socket, redisClient) {
  socket.on('timer-start', async ({ roomCode }) => {
    if (socket.role !== 'INTERVIEWER' && socket.role !== 'interviewer') return;
    
    try {
      const startedAt = Date.now();
      await redisClient.hSet(`codepair:room:${roomCode}`, {
        timerStatus: 'running',
        timerStartedAt: String(startedAt)
      });

      const roomStateData = await redisClient.hGetAll(`codepair:room:${roomCode}`);
      io.to(roomCode).emit('timer-update', {
        timerSeconds: parseInt(roomStateData.timerSeconds || '3600'),
        timerStatus: 'running',
        startedAt,
      });
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('timer-pause', async ({ roomCode, remainingSeconds }) => {
    if (socket.role !== 'INTERVIEWER' && socket.role !== 'interviewer') return;
    
    try {
      await redisClient.hSet(`codepair:room:${roomCode}`, {
        timerStatus: 'paused',
        timerSeconds: String(remainingSeconds)
      });

      io.to(roomCode).emit('timer-update', {
        timerSeconds: remainingSeconds,
        timerStatus: 'paused',
        startedAt: null,
      });
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('timer-reset', async ({ roomCode, seconds }) => {
    if (socket.role !== 'INTERVIEWER' && socket.role !== 'interviewer') return;
    
    try {
      await redisClient.hSet(`codepair:room:${roomCode}`, {
        timerStatus: 'stopped',
        timerSeconds: String(seconds),
        timerStartedAt: '0'
      });

      io.to(roomCode).emit('timer-update', {
        timerSeconds: seconds,
        timerStatus: 'stopped',
        startedAt: null,
      });
    } catch (err) {
      console.error(err);
    }
  });
}

module.exports = { registerTimerHandlers };
