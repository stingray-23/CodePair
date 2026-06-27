const { pistonExecute } = require('../services/piston');

function registerExecutionHandlers(io, socket) {
  socket.on('run-code', async ({ roomCode, code, language, stdin }) => {
    io.to(roomCode).emit('execution-started', { triggeredBy: socket.username });

    try {
      const result = await pistonExecute({ code, language, stdin });
      io.to(roomCode).emit('execution-result', {
        stdout: result.run.stdout,
        stderr: result.run.stderr,
        exitCode: result.run.code,
        runtime: result.run.signal ? null : 1, // Piston v2 doesn't always return runtime accurately, fallback
        triggeredBy: socket.username,
      });
    } catch (err) {
      console.error(err);
      io.to(roomCode).emit('execution-result', {
        stdout: '',
        stderr: 'Execution service unavailable. Please try again.',
        exitCode: 1,
        triggeredBy: socket.username,
      });
    }
  });
}

module.exports = { registerExecutionHandlers };
