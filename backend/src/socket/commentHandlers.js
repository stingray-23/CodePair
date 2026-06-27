const { v4: uuidv4 } = require('uuid');
const prisma = require('../prisma');

function registerCommentHandlers(io, socket, redisClient) {
  socket.on('add-comment', async ({ roomCode, lineNumber, text, color }) => {
    if (socket.role !== 'INTERVIEWER' && socket.role !== 'interviewer') return;

    try {
      const comment = {
        id: uuidv4(),
        authorName: socket.username,
        lineNumber,
        text,
        color,
        createdAt: new Date().toISOString(),
      };

      const existingComments = JSON.parse(
        await redisClient.get(`codepair:room:${roomCode}:comments`) || '[]'
      );
      existingComments.push(comment);
      await redisClient.set(`codepair:room:${roomCode}:comments`, JSON.stringify(existingComments));

      const room = await prisma.room.findUnique({ where: { roomCode } });
      if (room) {
        await prisma.comment.create({
          data: {
            roomId: room.id,
            authorName: socket.username,
            lineNumber,
            text,
            color,
          }
        });
      }

      io.to(roomCode).emit('comment-added', comment);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('delete-comment', async ({ roomCode, commentId }) => {
    if (socket.role !== 'INTERVIEWER' && socket.role !== 'interviewer') return;
    
    try {
      const existingComments = JSON.parse(
        await redisClient.get(`codepair:room:${roomCode}:comments`) || '[]'
      );
      const updatedComments = existingComments.filter(c => c.id !== commentId);
      await redisClient.set(`codepair:room:${roomCode}:comments`, JSON.stringify(updatedComments));

      await prisma.comment.delete({ where: { id: commentId } }).catch(() => {});

      io.to(roomCode).emit('comment-deleted', { commentId });
    } catch (err) {
      console.error(err);
    }
  });
}

module.exports = { registerCommentHandlers };
