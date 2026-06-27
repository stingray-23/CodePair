"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';
import { useRoom } from '@/hooks/useRoom';
import { useEditor } from '@/hooks/useEditor';
import { CodeEditor } from '@/components/Editor/CodeEditor';
import { LanguageSelector } from '@/components/Editor/LanguageSelector';
import { OutputPanel } from '@/components/Editor/OutputPanel';
import { InterviewTimer } from '@/components/Timer/InterviewTimer';
import { ChatSidebar } from '@/components/Chat/ChatSidebar';
import { RoomHeader } from '@/components/Room/RoomHeader';
import { JoinRoomModal } from '@/components/Room/JoinRoomModal';
import { Play } from 'lucide-react';
import api from '@/lib/api';

export default function RoomPage() {
  const { roomCode } = useParams() as { roomCode: string };
  const router = useRouter();
  const [roomInfo, setRoomInfo] = useState<any>(null);
  
  // User local state before joining
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<'interviewer' | 'candidate' | null>(null);

  // Execution state
  const [output, setOutput] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [exitCode, setExitCode] = useState<number | null>(null);

  // UI State
  const [activeTab, setActiveTab] = useState<'output' | 'chat'>('output');

  useEffect(() => {
    api.get(`/rooms/${roomCode}`).then(res => setRoomInfo(res.data)).catch(console.error);
  }, [roomCode]);

  const { socket, connected, error: socketError } = useSocket(roomCode, username, role);
  const { roomState, messages } = useRoom(socket, roomCode);
  const { code, remoteCursors, handleCodeChange, handleCursorChange } = useEditor(
    socket, 
    roomCode, 
    roomState?.code || ''
  );

  useEffect(() => {
    if (!socket) return;
    
    socket.on('execution-started', () => {
      setIsExecuting(true);
      setOutput('');
      setErrorText('');
      setExitCode(null);
      setActiveTab('output');
    });

    socket.on('execution-result', (result: any) => {
      setIsExecuting(false);
      setOutput(result.stdout || '');
      setErrorText(result.stderr || '');
      setExitCode(result.exitCode);
    });

    socket.on('room-deleted', () => {
      alert('This room has been deleted by the interviewer.');
      window.location.href = '/';
    });

    return () => {
      socket.off('execution-started');
      socket.off('execution-result');
      socket.off('room-deleted');
    };
  }, [socket]);

  if (!username || !role) {
    if (!roomInfo) return <div className="flex h-screen items-center justify-center bg-[#0d0d10] text-white">Loading room...</div>;
    return <JoinRoomModal roomCode={roomCode} title={roomInfo.title} onJoin={(u, r) => { setUsername(u); setRole(r); }} />;
  }

  if (socketError) {
    return <div className="flex h-screen items-center justify-center bg-[#0d0d10] text-red-400">Error: {socketError}</div>;
  }

  if (!roomState) {
    return <div className="flex h-screen items-center justify-center bg-[#0d0d10] text-white">Connecting to real-time engine...</div>;
  }

  const isInterviewer = role === 'interviewer';

  const handleRunCode = () => {
    socket?.emit('run-code', { 
      roomCode, 
      code, 
      language: roomState.language, 
      stdin: '' 
    });
  };

  const handleLanguageChange = (lang: string) => {
    socket?.emit('language-change', { roomCode, language: lang });
  };

  const handleLeave = () => {
    setUsername(null);
    setRole(null);
    router.push(role === 'interviewer' ? '/dashboard' : '/');
  };

  return (
    <div className="flex flex-col h-screen bg-[#0d0d10] text-white overflow-hidden relative">
      {/* Background ambient light */}
      <div className="absolute top-0 left-[20%] w-[500px] h-[500px] bg-emerald-600/5 blur-[150px] rounded-full pointer-events-none" />
      
      <RoomHeader 
        title={roomInfo?.title || 'CodePair Room'} 
        roomCode={roomCode} 
        participants={roomState.participants} 
        onLeave={handleLeave}
      />

      <div className="flex flex-1 overflow-hidden z-10 p-2 gap-2">
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#161618]/80 backdrop-blur-md rounded-2xl border border-[#2a2a35]/60 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-[#1e1e24]/80 border-b border-[#2a2a35]/60">
            <LanguageSelector 
              language={roomState.language} 
              onChange={handleLanguageChange} 
              disabled={isExecuting}
            />
            
            <InterviewTimer 
              initialSeconds={roomState.timerSeconds}
              status={roomState.timerStatus}
              startedAt={roomState.timerStartedAt}
              isInterviewer={isInterviewer}
              onStart={() => socket?.emit('timer-start', { roomCode })}
              onPause={(sec) => socket?.emit('timer-pause', { roomCode, remainingSeconds: sec })}
              onReset={(sec) => socket?.emit('timer-reset', { roomCode, seconds: sec })}
            />
          </div>
          
          <div className="flex-1 relative">
            <CodeEditor 
              code={code}
              language={roomState.language}
              onChange={handleCodeChange}
              onCursorChange={handleCursorChange}
              remoteCursors={remoteCursors}
              comments={roomState.comments}
            />
          </div>
        </div>

        {/* Right Sidebar Area */}
        <div className="w-80 lg:w-96 flex flex-col bg-[#161618]/80 backdrop-blur-md rounded-2xl border border-[#2a2a35]/60 shadow-2xl overflow-hidden">
          <div className="flex border-b border-[#2a2a35]/60 bg-[#1e1e24]/50">
            <button 
              onClick={() => setActiveTab('output')}
              className={`flex-1 py-3.5 text-sm font-semibold transition-all ${activeTab === 'output' ? 'bg-[#161618] text-emerald-400 border-b-2 border-emerald-500' : 'text-gray-400 hover:text-white hover:bg-[#1e1e24]'}`}
            >
              Output
            </button>
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3.5 text-sm font-semibold transition-all ${activeTab === 'chat' ? 'bg-[#161618] text-emerald-400 border-b-2 border-emerald-500' : 'text-gray-400 hover:text-white hover:bg-[#1e1e24]'}`}
            >
              Chat
            </button>
          </div>

          <div className="flex-1 overflow-hidden relative">
            {activeTab === 'output' ? (
              <div className="absolute inset-0 flex flex-col">
                <div className="flex-1 overflow-hidden">
                  <OutputPanel 
                    output={output}
                    error={errorText}
                    isExecuting={isExecuting}
                    exitCode={exitCode}
                  />
                </div>
                <div className="p-4 border-t border-[#2a2a35]/60 bg-[#1e1e24]/50">
                  <button 
                    onClick={handleRunCode}
                    disabled={isExecuting}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:bg-[#2a2a35] text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-[0.98]"
                  >
                    <Play size={18} fill={isExecuting ? "transparent" : "currentColor"} />
                    {isExecuting ? 'Running...' : 'Run Code'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0">
                <ChatSidebar 
                  messages={messages}
                  onSend={(text) => socket?.emit('chat-message', { roomCode, text })}
                  currentUsername={username}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
