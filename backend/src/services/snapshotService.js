const prisma = require('../prisma');
const { createClient } = require('redis');
const { REDIS_URL } = require('../config');

const redisClient = createClient({ url: REDIS_URL });
redisClient.connect().catch(console.error);

async function saveSnapshot(roomCode) {
  try {
    const roomState = await redisClient.hGetAll(`codepair:room:${roomCode}`);
    if (!roomState.code) return;

    const room = await prisma.room.findUnique({ where: { roomCode } });
    if (!room) return;

    const sessions = await prisma.session.findMany({
      where: { roomId: room.id, leftAt: null }
    });

    for (const session of sessions) {
      await prisma.snapshot.create({
        data: {
          sessionId: session.id,
          code: roomState.code,
          language: roomState.language || 'javascript',
        }
      });
    }
  } catch (err) {
    console.error(`Failed to save snapshot for ${roomCode}:`, err);
  }
}

function startSnapshotInterval(io) {
  setInterval(async () => {
    // Get all active rooms from socket.io
    const activeRooms = Array.from(io.sockets.adapter.rooms.keys()).filter(r => !io.sockets.adapter.sids.has(r));
    for (const roomCode of activeRooms) {
      await saveSnapshot(roomCode);
    }
  }, 60000);
}

module.exports = { startSnapshotInterval };
