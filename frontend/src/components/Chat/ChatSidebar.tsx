import { useRef, useEffect, useState } from 'react';
import { ChatMessage } from '@/types';
import { Send } from 'lucide-react';

interface ChatSidebarProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  currentUsername: string;
}

export function ChatSidebar({ messages, onSend, currentUsername }: ChatSidebarProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSend(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex-1 overflow-y-auto p-4 space-y-5 min-h-0 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-50 text-center">
            <div className="w-12 h-12 rounded-full bg-[#2a2a35] flex items-center justify-center mb-3">
              <Send size={20} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-300">No messages yet</p>
            <p className="text-xs text-gray-500 mt-1">Start the conversation</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.username === currentUsername;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`text-[10px] text-gray-400 mb-1.5 flex items-center gap-1.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="font-semibold text-gray-300">{isMe ? 'You' : msg.username}</span>
                  <span className={`px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold tracking-widest uppercase ${msg.role === 'interviewer' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700/50 text-gray-400'}`}>
                    {msg.role === 'interviewer' ? 'INT' : 'CAN'}
                  </span>
                </div>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-md ${
                  isMe
                    ? 'bg-emerald-600 text-white rounded-tr-sm'
                    : 'bg-[#2a2a35] text-gray-200 rounded-tl-sm border border-[#3a3a45]'
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-[#2a2a35]/60 bg-[#1e1e24]/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[#0d0d10] border border-[#2a2a35]/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-gray-500"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:bg-[#2a2a35] text-white rounded-xl transition-all shadow-[0_0_10px_rgba(16,185,129,0.15)] disabled:shadow-none active:scale-95 flex items-center justify-center"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
