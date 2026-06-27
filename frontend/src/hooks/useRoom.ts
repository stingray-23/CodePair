import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { RoomState, Participant, Comment, ChatMessage } from '@/types';

export function useRoom(socket: Socket | null, roomCode: string) {
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleRoomState = (state: RoomState) => {
      setRoomState(state);
    };

    const handleUserJoined = (data: { socketId: string; username: string; role: any; color: string; participants: Participant[] }) => {
      setRoomState(prev => prev ? { ...prev, participants: data.participants } : prev);
    };

    const handleUserLeft = (data: { socketId: string; username: string; participants: Participant[] }) => {
      setRoomState(prev => prev ? { ...prev, participants: data.participants } : prev);
    };

    const handleCommentAdded = (comment: Comment) => {
      setRoomState(prev => prev ? { ...prev, comments: [...prev.comments, comment] } : prev);
    };

    const handleCommentDeleted = ({ commentId }: { commentId: string }) => {
      setRoomState(prev => prev ? { ...prev, comments: prev.comments.filter(c => c.id !== commentId) } : prev);
    };

    const handleTimerUpdate = (data: { timerSeconds: number; timerStatus: 'running'|'paused'|'stopped'; startedAt: number | null }) => {
      setRoomState(prev => prev ? { 
        ...prev, 
        timerSeconds: data.timerSeconds, 
        timerStatus: data.timerStatus,
        timerStartedAt: data.startedAt || undefined
      } : prev);
    };

    const handleNewMessage = (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
    };

    const handleLanguageUpdated = (data: { language: string, code: string }) => {
      setRoomState(prev => prev ? { ...prev, language: data.language, code: data.code } : prev);
    };

    socket.on('room-state', handleRoomState);
    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);
    socket.on('comment-added', handleCommentAdded);
    socket.on('comment-deleted', handleCommentDeleted);
    socket.on('timer-update', handleTimerUpdate);
    socket.on('new-message', handleNewMessage);
    socket.on('language-updated', handleLanguageUpdated);

    return () => {
      socket.off('room-state', handleRoomState);
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
      socket.off('comment-added', handleCommentAdded);
      socket.off('comment-deleted', handleCommentDeleted);
      socket.off('timer-update', handleTimerUpdate);
      socket.off('new-message', handleNewMessage);
      socket.off('language-updated', handleLanguageUpdated);
    };
  }, [socket]);

  return { roomState, setRoomState, messages };
}
