import { useEffect, useState } from 'react';
import { getSocket, disconnectSocket } from '@/lib/socket';

export function useSocket(roomCode: string, username: string | null, role: string | null) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username || !role) return;

    const socket = getSocket();
    
    socket.on('connect', () => {
      setConnected(true);
      setError(null);
      socket.emit('join-room', { roomCode, username, role });
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('error', (err: any) => {
      setError(err.message || 'An error occurred');
    });

    socket.connect();

    return () => {
      socket.emit('leave-room', { roomCode });
      socket.off('connect');
      socket.off('disconnect');
      socket.off('error');
      disconnectSocket();
    };
  }, [roomCode, username, role]);

  return { socket: getSocket(), connected, error };
}
