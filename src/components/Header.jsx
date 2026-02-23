import { RefreshCw, Flame, Wifi, WifiOff, Radio } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Header({ lastUpdated, refreshing, onRefresh, incidentCount, activeCount, error, apparatusStatus, apparatusLastFetched, floating }) {
  return (
    <header
      className="flex items-center justify-between shrink-0"
      style={floating ? {
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1200,
        padding: '10px 16px',
        background: 'rgba(10,13,22,0.72)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      } : {
        padding: '10px 16px',
        background: '#0c0f18',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div
          className="relative flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
          style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}
        >
          <Flame size={14} className="text-red-400" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500 live-dot" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white tracking-wide leading-tight">Seattle Fire Watch</h1>
          {!floating && (
            <p className="text-[10px] text-slate-600 leading-tight">Real-Time 911 Dispatch</p>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">

        {/* Live / error status — always visible */}
        {error ? (
          <div className="flex items-center gap-1.5 text-[11px] text-red-400">
            <WifiOff size={11} />
            {!floating && <span className="hidden sm:block">Connection error</span>}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-500 font-medium">
            <Wifi size={11} />
            <span>Live</span>
            {activeCount > 0 && (
              <>
                <span className="text-emerald-900/60">·</span>
                <span className="text-[11px] font-semibold text-emerald-400">
                  {activeCount} active
                </span>
              </>
            )}
          </div>
        )}

        {/* Dispatch + incident count — desktop only */}
        {!floating && (
          <>
            <div
              className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md"
              title={
                apparatusStatus === 'ok'
                  ? `SFD dispatch data live${apparatusLastFetched ? ` · ${formatDistanceToNow(apparatusLastFetched, { addSuffix: true })}` : ''}`
                  : apparatusStatus === 'loading' ? 'Fetching SFD dispatch data…'
                  : apparatusStatus === 'error' ? 'SFD dispatch data unavailable'
                  : 'SFD dispatch data pending'
              }
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Radio
                size={10}
                className={
                  apparatusStatus === 'ok' ? 'text-emerald-500' :
                  apparatusStatus === 'error' ? 'text-red-400' :
                  'text-slate-600'
                }
              />
              <span
                className="text-[10px]"
                style={{
                  color: apparatusStatus === 'ok' ? '#10b981' :
                         apparatusStatus === 'error' ? '#f87171' :
                         '#475569',
                }}
              >
                {apparatusStatus === 'ok' ? 'Dispatch' :
                 apparatusStatus === 'error' ? 'No Dispatch' :
                 'Dispatch…'}
              </span>
            </div>

            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <span className="text-xs font-semibold text-white">{incidentCount}</span>
              <span className="text-[10px] text-slate-500">incidents (24h)</span>
            </div>

            {lastUpdated && (
              <span className="hidden md:block text-[10px] text-slate-600">
                Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
              </span>
            )}
          </>
        )}

        {/* Refresh */}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center justify-center rounded-lg text-slate-400 hover:text-white transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            width: floating ? 32 : 'auto',
            height: floating ? 32 : 'auto',
            padding: floating ? 0 : '6px 10px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <RefreshCw size={11} className={refreshing ? 'animate-spin' : ''} />
          {!floating && <span className="hidden sm:block text-[11px] font-medium ml-1.5">Refresh</span>}
        </button>
      </div>
    </header>
  );
}
