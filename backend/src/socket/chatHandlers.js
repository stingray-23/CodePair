const { v4: uuidv4 } = require('uuid');

function registerChatHandlers(io, socket) {
  socket.on('chat-message', ({ roomCode, text }) => {
    const message = {
      id: uuidv4(),
      text: text.slice(0, 500),
      username: socket.username,
      role: socket.role,
      timestamp: new Date().toISOString(),
    };
    io.to(roomCode).emit('new-message', message);
  });
}

module.exports = { registerChatHandlers };
