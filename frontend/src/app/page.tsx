"use client";

import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getUser, User } from "@/lib/auth";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleCreateRoom = () => {
    if (getUser()) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim().length === 6) {
      router.push(`/room/${roomCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0d0d10] overflow-hidden flex flex-col">
      {/* Background glowing orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight max-w-4xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200"
        >
          Run better technical interviews.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl font-light"
        >
          CodePair is a premium real-time collaborative coding environment with instant code execution, 
          synced cursors, and interviewer controls.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-8 items-center bg-[#161618]/60 backdrop-blur-xl p-8 rounded-3xl border border-[#2a2a35]/50 shadow-2xl"
        >
          <div className="flex flex-col gap-5 items-center sm:items-start w-full sm:w-64">
            <h2 className="text-xl font-semibold text-gray-200">For Interviewers</h2>
            <p className="text-sm text-gray-400 text-center sm:text-left mb-2">Create a secure room and evaluate candidates in real-time.</p>
            {user ? (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateRoom}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] font-semibold rounded-xl transition-colors"
              >
                Create a Room
              </motion.button>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/auth/login')}
                className="w-full py-3 bg-[#1e1e24] hover:bg-[#2a2a35] text-white border border-[#2a2a35] font-semibold rounded-xl transition-colors"
              >
                Login to Create
              </motion.button>
            )}
          </div>
          
          <div className="hidden sm:block w-px h-32 bg-gradient-to-b from-transparent via-[#2a2a35] to-transparent"></div>
          
          <div className="flex flex-col gap-5 items-center sm:items-start w-full sm:w-72">
            <h2 className="text-xl font-semibold text-gray-200">For Candidates</h2>
            <p className="text-sm text-gray-400 text-center sm:text-left mb-2">Have a room code? Enter it below to join the interview.</p>
            <form onSubmit={handleJoinRoom} className="flex gap-3 w-full">
              <input 
                type="text" 
                placeholder="Code (ABC123)"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="flex-1 px-4 py-3 bg-[#0d0d10] border border-[#2a2a35] rounded-xl text-white font-mono uppercase placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <motion.button 
                whileHover={roomCode.length === 6 ? { scale: 1.05 } : {}}
                whileTap={roomCode.length === 6 ? { scale: 0.95 } : {}}
                type="submit"
                disabled={roomCode.length !== 6}
                className="px-6 py-3 bg-emerald-600/10 hover:bg-emerald-600/20 disabled:bg-[#1e1e24] disabled:text-gray-500 disabled:border-[#2a2a35] border border-emerald-500/50 text-emerald-400 font-semibold rounded-xl transition-colors"
              >
                Join
              </motion.button>
            </form>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-28 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl w-full text-left"
        >
          <div className="p-6 bg-[#161618]/40 backdrop-blur-md rounded-2xl border border-[#2a2a35]/40 hover:border-emerald-500/30 hover:bg-[#161618]/80 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-5 text-2xl group-hover:scale-110 transition-transform">⚡</div>
            <h3 className="font-semibold text-white mb-2 text-lg">Real-time Sync</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Every keystroke and cursor movement is synced instantly using WebSockets.</p>
          </div>
          <div className="p-6 bg-[#161618]/40 backdrop-blur-md rounded-2xl border border-[#2a2a35]/40 hover:border-emerald-500/30 hover:bg-[#161618]/80 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-5 text-2xl group-hover:scale-110 transition-transform">🚀</div>
            <h3 className="font-semibold text-white mb-2 text-lg">Instant Execution</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Run code in 8+ languages directly in the browser with full stdout/stderr.</p>
          </div>
          <div className="p-6 bg-[#161618]/40 backdrop-blur-md rounded-2xl border border-[#2a2a35]/40 hover:border-emerald-500/30 hover:bg-[#161618]/80 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-5 text-2xl group-hover:scale-110 transition-transform">💬</div>
            <h3 className="font-semibold text-white mb-2 text-lg">Inline Feedback</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Interviewers can leave markers and chat messages for the candidate.</p>
          </div>
          <div className="p-6 bg-[#161618]/40 backdrop-blur-md rounded-2xl border border-[#2a2a35]/40 hover:border-emerald-500/30 hover:bg-[#161618]/80 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-5 text-2xl group-hover:scale-110 transition-transform">⏱️</div>
            <h3 className="font-semibold text-white mb-2 text-lg">Session Replay</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Code snapshots are saved periodically for review after the interview ends.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
