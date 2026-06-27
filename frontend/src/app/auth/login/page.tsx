"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';

import { motion } from 'framer-motion';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d10] flex flex-col relative overflow-hidden">
      <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#161618]/70 backdrop-blur-xl p-10 rounded-3xl border border-[#2a2a35]/60 w-full max-w-md shadow-2xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 mb-2">Welcome Back</h2>
            <p className="text-sm text-gray-400">Login to your interviewer account</p>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl mb-6 text-sm text-center font-medium"
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5 ml-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d0d10] border border-[#2a2a35] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-gray-600"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5 ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0d0d10] border border-[#2a2a35] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-gray-600"
                placeholder="••••••••"
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-colors mt-2"
            >
              Sign In
            </motion.button>
          </form>
          
          <p className="mt-8 text-center text-sm text-gray-400 font-medium">
            Don&apos;t have an account? <Link href="/auth/register" className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
