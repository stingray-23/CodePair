"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Copy, Users, Trash2 } from 'lucide-react';

import { motion } from 'framer-motion';

export default function Dashboard() {
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await api.get('/rooms');
      setRooms(res.data);
    } catch (err) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomTitle.trim()) return;
    try {
      const res = await api.post('/rooms', { title: newRoomTitle, durationMinutes: 60 });
      setNewRoomTitle('');
      fetchRooms();
    } catch (err) {
      console.error('Failed to create room', err);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Room code copied!');
  };

  const handleDeleteRoom = async (code: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    try {
      await api.delete(`/rooms/${code}`);
      fetchRooms();
    } catch (err) {
      console.error('Failed to delete room', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d10] flex flex-col relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[150px] rounded-full pointer-events-none" />
      
      <Navbar />
      <div className="max-w-5xl mx-auto w-full p-6 z-10 flex-1">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-10 mt-4"
        >
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">Dashboard</h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          <div className="bg-[#161618]/60 backdrop-blur-md border border-[#2a2a35]/50 p-7 rounded-2xl shadow-xl hover:border-emerald-500/30 transition-colors group">
            <h2 className="text-xl font-bold text-gray-200 mb-2">Create New Interview</h2>
            <p className="text-sm text-gray-400 mb-5">Start a fresh session for your next candidate.</p>
            <form onSubmit={handleCreateRoom} className="flex gap-4">
              <input
                type="text"
                placeholder="e.g. Frontend SDE"
                value={newRoomTitle}
                onChange={(e) => setNewRoomTitle(e.target.value)}
                className="flex-1 bg-[#0d0d10] border border-[#2a2a35] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all w-full placeholder-gray-600"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit" 
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-colors whitespace-nowrap"
              >
                Create
              </motion.button>
            </form>
          </div>

          <div className="bg-[#161618]/60 backdrop-blur-md border border-[#2a2a35]/50 p-7 rounded-2xl shadow-xl hover:border-emerald-500/30 transition-colors group">
            <h2 className="text-xl font-bold text-gray-200 mb-2">Join Existing Room</h2>
            <p className="text-sm text-gray-400 mb-5">Enter a 6-digit code to jump into a live room.</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const code = (e.currentTarget.elements.namedItem('roomCode') as HTMLInputElement).value;
              if (code.trim().length === 6) {
                router.push(`/room/${code.trim().toUpperCase()}`);
              }
            }} className="flex gap-4">
              <input
                type="text"
                name="roomCode"
                placeholder="ABC123"
                maxLength={6}
                className="flex-1 bg-[#0d0d10] border border-[#2a2a35] rounded-xl px-4 py-3 text-white font-mono uppercase focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all w-full placeholder-gray-600"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit" 
                className="px-6 py-3 bg-[#1e1e24] hover:bg-[#2a2a35] border border-[#2a2a35] text-white font-semibold rounded-xl transition-colors whitespace-nowrap"
              >
                Join
              </motion.button>
            </form>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-gray-200 mb-6 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Users size={20} />
            </div>
            Your Rooms
          </h2>
          
          {loading ? (
            <div className="text-gray-400 flex justify-center py-12">Loading rooms...</div>
          ) : rooms.length === 0 ? (
            <div className="text-gray-500 bg-[#161618]/40 border border-[#2a2a35]/40 p-12 rounded-2xl text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-[#1e1e24] rounded-full flex items-center justify-center mb-4 border border-[#2a2a35]">
                <Users size={24} className="text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-300">No rooms yet</p>
              <p className="text-sm mt-1">Create your first interview room above.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {rooms.map((room, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={room.id} 
                  className="bg-[#161618]/60 backdrop-blur-sm border border-[#2a2a35]/50 p-5 rounded-2xl flex items-center justify-between hover:border-emerald-500/50 hover:bg-[#161618]/80 transition-all group shadow-sm hover:shadow-md"
                >
                  <div>
                    <h3 className="font-semibold text-lg text-gray-100 mb-1.5">{room.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="font-mono bg-[#0d0d10] px-2.5 py-1 rounded-md border border-[#2a2a35]/70 text-gray-300 shadow-inner">Code: {room.roomCode}</span>
                      <span>{new Date(room.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className={`px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider font-medium ${room.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {room.isActive ? 'Active' : 'Closed'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => copyCode(room.roomCode)}
                      className="p-2.5 border border-[#2a2a35]/70 hover:bg-[#2a2a35] hover:text-white rounded-xl text-gray-400 transition-colors bg-[#0d0d10]"
                      title="Copy Room Code"
                    >
                      <Copy size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteRoom(room.roomCode)}
                      className="p-2.5 border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 rounded-xl text-red-400 hover:text-red-300 transition-colors"
                      title="Delete Room"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button 
                      onClick={() => router.push(`/room/${room.roomCode}`)}
                      className="px-5 py-2.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl transition-all font-semibold shadow-[0_0_10px_rgba(16,185,129,0.05)] hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    >
                      Join Room
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
