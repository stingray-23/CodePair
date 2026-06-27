import { useState, useEffect } from 'react';

interface TimerProps {
  initialSeconds: number;
  status: 'running' | 'paused' | 'stopped';
  startedAt: number | undefined;
  isInterviewer: boolean;
  onStart: () => void;
  onPause: (remainingSeconds: number) => void;
  onReset: (seconds: number) => void;
}

export function InterviewTimer({ initialSeconds, status, startedAt, isInterviewer, onStart, onPause, onReset }: TimerProps) {
  const [display, setDisplay] = useState(initialSeconds);

  useEffect(() => {
    if (status !== 'running') {
      setDisplay(initialSeconds);
      return;
    }

    const elapsed = startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0;
    const remaining = Math.max(0, initialSeconds - elapsed);
    setDisplay(remaining);

    const interval = setInterval(() => {
      setDisplay((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, initialSeconds, startedAt]);

  const formatted = `${Math.floor(display / 60).toString().padStart(2, '0')}:${(display % 60).toString().padStart(2, '0')}`;
  const isLow = display < 300 && display > 0;

  const [isEditing, setIsEditing] = useState(false);
  const [editMinutes, setEditMinutes] = useState(60);

  const handleSetTime = () => {
    onReset(editMinutes * 60);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-4 bg-[#0d0d10] border border-[#2a2a35]/60 px-4 py-2 rounded-xl shadow-inner">
      <div className={`font-mono text-xl font-bold tracking-wider ${isLow ? 'text-red-400 animate-pulse' : 'text-gray-200'}`}>
        <span className="opacity-70 mr-1.5">⏱</span>{formatted}
      </div>
      
      {isInterviewer && (
        <div className="flex gap-2 border-l border-[#2a2a35]/60 pl-4 items-center">
          {status === 'running' ? (
            <button 
              onClick={() => onPause(display)}
              className="text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition-colors"
            >
              Pause
            </button>
          ) : (
            <button 
              onClick={onStart}
              className="text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 transition-colors"
            >
              Start
            </button>
          )}

          {isEditing ? (
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="1"
                max="180"
                value={editMinutes}
                onChange={(e) => setEditMinutes(Number(e.target.value))}
                className="w-16 bg-[#161618] border border-[#2a2a35] text-white font-mono text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mr-1">min</span>
              <button 
                onClick={handleSetTime}
                className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg hover:bg-emerald-500/20 transition-colors"
              >
                Set
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-xs font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/20 px-2.5 py-1.5 rounded-lg hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-xs font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/20 px-3 py-1.5 rounded-lg hover:text-white hover:bg-gray-500/20 transition-colors"
            >
              Set Time
            </button>
          )}
        </div>
      )}
    </div>
  );
}
