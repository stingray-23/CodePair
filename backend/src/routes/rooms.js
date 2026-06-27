const express = require('express');
const { createClient } = require('redis');
const prisma = require('../prisma');
const { authenticate } = require('../middleware/auth');
const { generateRoomCode, getStarterCode } = require('../services/roomService');
const { REDIS_URL, FRONTEND_URL } = require('../config');

const router = express.Router();
const redisClient = createClient({ url: REDIS_URL });
redisClient.connect().catch(console.error);

router.post('/', authenticate, async (req, res) => {
  try {
    const { title, language, durationMinutes } = req.body;

    let roomCode;
    let exists = true;
    while (exists) {
      roomCode = generateRoomCode();
      const found = await prisma.room.findUnique({ where: { roomCode } });
      exists = !!found;
    }

    const expiresAt = durationMinutes
      ? new Date(Date.now() + durationMinutes * 60 * 1000)
      : null;

    const room = await prisma.room.create({
      data: {
        roomCode,
        title,
        language: language || 'javascript',
        createdById: req.user.id,
        expiresAt,
      },
    });

    // Initialize room state in Redis
    await redisClient.hSet(`codepair:room:${roomCode}`, {
      code: getStarterCode(language || 'javascript'),
      language: language || 'javascript',
      timerSeconds: String((durationMinutes || 60) * 60),
      timerStatus: 'stopped',
      participants: JSON.stringify([]),
    });
    await redisClient.expire(`codepair:room:${roomCode}`, 86400); // 24h TTL

    res.status(201).json({ roomCode, ...room, joinUrl: `${FRONTEND_URL}/room/${roomCode}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      where: { createdById: req.user.id, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:roomCode', async (req, res) => {
  try {
    const { roomCode } = req.params;
    const room = await prisma.room.findUnique({
      where: { roomCode },
      include: { createdBy: { select: { username: true } } },
    });
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:roomCode/sessions', authenticate, async (req, res) => {
  try {
    const { roomCode } = req.params;
    const room = await prisma.room.findUnique({ where: { roomCode } });
    if (!room) return res.status(404).json({ error: 'Room not found' });

    const sessions = await prisma.session.findMany({
      where: { roomId: room.id },
      include: {
        user: { select: { username: true, role: true } },
        snapshots: { orderBy: { savedAt: 'asc' } },
      },
    });
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:roomCode', authenticate, async (req, res) => {
  try {
    const { roomCode } = req.params;
    const room = await prisma.room.findUnique({ where: { roomCode } });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (room.createdById !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    await prisma.room.update({
      where: { roomCode },
      data: { isActive: false },
    });
    
    const io = req.app.get('io');
    if (io) {
      io.to(roomCode).emit('room-deleted');
    }

    res.json({ message: 'Room deactivated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
