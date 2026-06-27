import { useState, useEffect } from 'react';
import { getUser } from '@/lib/auth';

interface JoinRoomModalProps {
  roomCode: string;
  title: string;
  onJoin: (username: string, role: 'interviewer' | 'candidate') => void;
}

import { motion } from 'framer-motion';

export function JoinRoomModal({ roomCode, title, onJoin }: JoinRoomModalProps) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'interviewer' | 'candidate'>('candidate');

  useEffect(() => {
    const user = getUser();
    if (user) {
      setUsername(user.username);
      setRole(user.role === 'INTERVIEWER' ? 'interviewer' : 'candidate');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onJoin(username.trim(), role);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0d0d10]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#161618]/90 backdrop-blur-xl border border-[#2a2a35]/60 rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">{title}</h2>
          <p className="text-gray-400 text-sm">Joining room <span className="font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded ml-1 border border-emerald-500/20">{roomCode}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5 ml-1">Display Name</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0d0d10] border border-[#2a2a35] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-gray-600"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5 ml-1">Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('candidate')}
                className={`py-3 px-4 rounded-xl border transition-all font-medium text-sm ${
                  role === 'candidate' 
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                    : 'border-[#2a2a35] bg-[#0d0d10] text-gray-400 hover:border-gray-500 hover:bg-[#1e1e24]'
                }`}
              >
                Candidate
              </button>
              <button
                type="button"
                onClick={() => setRole('interviewer')}
                className={`py-3 px-4 rounded-xl border transition-all font-medium text-sm ${
                  role === 'interviewer' 
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                    : 'border-[#2a2a35] bg-[#0d0d10] text-gray-400 hover:border-gray-500 hover:bg-[#1e1e24]'
                }`}
              >
                Interviewer
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] mt-2"
          >
            Join Room
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
