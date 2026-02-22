import { Flame } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full" style={{ background: '#0c0f18' }}>
      <div className="relative mb-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}
        >
          <Flame size={24} className="text-red-400" />
        </div>
        <div
          className="absolute inset-0 rounded-2xl animate-ping"
          style={{ background: 'rgba(239,68,68,0.08)' }}
        />
      </div>
      <h2 className="text-sm font-semibold text-white mb-1">Loading Incidents</h2>
      <p className="text-[11px] text-slate-600">Connecting to Seattle Fire 911...</p>
      <div className="mt-5 flex gap-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-1 h-1 rounded-full bg-red-500/50 animate-bounce"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    </div>
  );
}
