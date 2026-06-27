interface OutputPanelProps {
  output: string;
  error: string;
  isExecuting: boolean;
  exitCode: number | null;
}

export function OutputPanel({ output, error, isExecuting, exitCode }: OutputPanelProps) {
  return (
    <div className="flex flex-col h-full bg-transparent font-mono text-[13px]">
      <div className="px-5 py-3 flex items-center justify-between border-b border-[#2a2a35]/60 bg-[#1e1e24]/50">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
          <span className="text-gray-300 font-semibold tracking-wide">Terminal</span>
        </div>
        {exitCode !== null && !isExecuting && (
          <div className={`px-2 py-0.5 rounded border text-[11px] font-bold ${exitCode === 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
            Exit Code: {exitCode}
          </div>
        )}
      </div>
      <div className="flex-1 p-5 overflow-y-auto whitespace-pre-wrap custom-scrollbar bg-[#0d0d10]/50 shadow-inner">
        {isExecuting ? (
          <div className="flex items-center text-emerald-400 font-medium">
            <span className="mr-3 animate-spin">⟳</span>
            <span className="animate-pulse">Compiling and running code...</span>
          </div>
        ) : (
          <div className="leading-relaxed">
            {error ? (
              <span className="text-red-400">{error}</span>
            ) : output ? (
              <span className="text-gray-200">{output}</span>
            ) : (
              <span className="text-gray-500/70 italic flex items-center gap-2">
                <span className="text-emerald-500/50">❯</span> Ready to execute. Run your code to see output here.
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
