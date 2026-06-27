import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser, logout, User } from '@/lib/auth';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-[#0d0d10]/80 backdrop-blur-xl border-b border-[#2a2a35]/50 sticky top-0 z-50">
      <Link href="/" className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2 group">
        <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md group-hover:bg-emerald-500 group-hover:text-[#0d0d10] transition-colors">{"</>"}</span> CodePair
      </Link>
      
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-300">
              {user.username} <span className="text-[10px] uppercase tracking-wider bg-emerald-900/40 border border-emerald-500/20 text-emerald-400 px-2 py-1 rounded ml-2 shadow-[0_0_10px_rgba(16,185,129,0.1)]">{user.role}</span>
            </span>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/auth/register" className="px-5 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all hover:scale-105 active:scale-95">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
