import { Participant } from '@/types';

interface RoomHeaderProps {
  title: string;
  roomCode: string;
  participants: Participant[];
  onLeave?: () => void;
}

export function RoomHeader({ title, roomCode, participants, onLeave }: RoomHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-[#0d0d10]/50 backdrop-blur-md border-b border-[#2a2a35]/40 z-50">
      <div className="flex items-center gap-5">
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        <div className="px-3.5 py-1.5 bg-[#161618] border border-[#2a2a35] rounded-lg font-mono text-sm tracking-wider text-emerald-400 shadow-inner">
          {roomCode}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          {participants.map(p => (
            <div 
              key={p.id} 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm"
              style={{ backgroundColor: `${p.color}15`, color: p.color, border: `1px solid ${p.color}30` }}
              title={`${p.username} (${p.role})`}
            >
              <span className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: p.color }}></span>
              {p.username}
            </div>
          ))}
        </div>
        
        {onLeave && (
          <button 
            onClick={onLeave}
            className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 text-white border border-red-500/30 rounded-lg text-sm font-semibold transition-all shadow-[0_0_10px_rgba(239,68,68,0.1)] hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
          >
            Leave Room
          </button>
        )}
      </div>
    </div>
  );
}
