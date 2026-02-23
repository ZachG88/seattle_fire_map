import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { INCIDENT_CATEGORIES } from '../utils/incidentUtils';
import CategoryIcon from './CategoryIcon';

export default function StatsBar({ stats, activeFilter, onFilterChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const activeCat = activeFilter ? INCIDENT_CATEGORIES[activeFilter] : null;
  const activeCount = activeFilter ? (stats[activeFilter] || 0) : (stats.total || 0);
  const activeLabel = activeCat ? activeCat.label : 'All Incidents';

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] transition-all duration-150"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-2">
          {activeCat
            ? <CategoryIcon category={activeFilter} size={11} />
            : <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#64748b' }} />
          }
          <span className="font-medium" style={{ color: activeCat ? activeCat.color : '#94a3b8' }}>
            {activeLabel}
          </span>
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md tabular-nums"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#475569' }}
          >
            {activeCount}
          </span>
        </div>
        <ChevronDown
          size={11}
          className="text-slate-600 shrink-0 transition-transform duration-150"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1 z-[600] rounded-xl overflow-hidden shadow-2xl"
          style={{ background: '#151c2c', border: '1px solid rgba(255,255,255,0.09)' }}
        >
          {/* All */}
          <button
            onClick={() => { onFilterChange(null); setOpen(false); }}
            className="w-full flex items-center justify-between px-3 py-2 text-[11px] transition-colors"
            style={activeFilter === null
              ? { background: 'rgba(148,163,184,0.08)' }
              : { background: 'transparent' }
            }
            onMouseEnter={e => { if (activeFilter !== null) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
            onMouseLeave={e => { if (activeFilter !== null) e.currentTarget.style.background = 'transparent'; }}
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#64748b' }} />
              <span className={activeFilter === null ? 'text-slate-200 font-semibold' : 'text-slate-400'}>
                All Incidents
              </span>
            </div>
            <span className="text-[10px] tabular-nums text-slate-600">{stats.total || 0}</span>
          </button>

          <div className="h-px mx-2" style={{ background: 'rgba(255,255,255,0.05)' }} />

          {Object.entries(INCIDENT_CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => { onFilterChange(activeFilter === key ? null : key); setOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] transition-colors"
              style={activeFilter === key
                ? { background: cat.bgColor }
                : { background: 'transparent' }
              }
              onMouseEnter={e => { if (activeFilter !== key) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              onMouseLeave={e => { if (activeFilter !== key) e.currentTarget.style.background = 'transparent'; }}
            >
              <div className="flex items-center gap-2">
                <CategoryIcon category={key} size={11} />
                <span
                  className={activeFilter === key ? 'font-semibold' : ''}
                  style={{ color: activeFilter === key ? cat.color : '#94a3b8' }}
                >
                  {cat.label}
                </span>
              </div>
              <span className="text-[10px] tabular-nums" style={{ color: '#475569' }}>
                {stats[key] || 0}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
