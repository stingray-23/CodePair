import { useEffect, useState, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { RemoteCursor } from '@/types';

export function useEditor(socket: Socket | null, roomCode: string, initialCode: string) {
  const [code, setCode] = useState(initialCode);
  const [remoteCursors, setRemoteCursors] = useState<RemoteCursor[]>([]);
  const codeRef = useRef(initialCode);

  useEffect(() => {
    setCode(initialCode);
    codeRef.current = initialCode;
  }, [initialCode]);

  useEffect(() => {
    if (!socket) return;

    const handleCodeUpdated = (data: { code: string; cursorPosition: any; updatedBy: string }) => {
      setCode(data.code);
      codeRef.current = data.code;
    };

    const handleRemoteCursor = (data: RemoteCursor) => {
      setRemoteCursors(prev => {
        const filtered = prev.filter(c => c.socketId !== data.socketId);
        return [...filtered, data];
      });
      
      // Auto-remove cursor after 5 seconds of inactivity (optional feature)
      // We can keep it simple and just show it as is.
    };

    const handleUserLeft = (data: { socketId: string }) => {
      setRemoteCursors(prev => prev.filter(c => c.socketId !== data.socketId));
    };

    socket.on('code-updated', handleCodeUpdated);
    socket.on('remote-cursor', handleRemoteCursor);
    socket.on('user-left', handleUserLeft);

    return () => {
      socket.off('code-updated', handleCodeUpdated);
      socket.off('remote-cursor', handleRemoteCursor);
      socket.off('user-left', handleUserLeft);
    };
  }, [socket]);

  // Debounced code change sender
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const handleCodeChange = useCallback((newCode: string, cursorPosition?: any) => {
    setCode(newCode);
    codeRef.current = newCode;
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      socket?.emit('code-change', { roomCode, code: newCode, cursorPosition });
    }, 50);
  }, [socket, roomCode]);

  const handleCursorChange = useCallback((position: any) => {
    socket?.emit('cursor-move', { 
      roomCode, 
      lineNumber: position.lineNumber, 
      column: position.column 
    });
  }, [socket, roomCode]);

  return { code, remoteCursors, handleCodeChange, handleCursorChange };
}
