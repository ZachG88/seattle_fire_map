import { useState, useMemo } from 'react';
import { Search, X, SortDesc, SortAsc } from 'lucide-react';
import IncidentCard from './IncidentCard';
import StatsBar from './StatsBar';
import WeatherWidget from './WeatherWidget';
import { categorizeIncident, getIncidentStats } from '../utils/incidentUtils';
import { isIncidentActive } from '../hooks/useApparatus';

export default function IncidentSidebar({ incidents, selectedId, onSelect, activeFilter, onFilterChange, apparatusMap }) {
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const stats = useMemo(() => getIncidentStats(incidents), [incidents]);

  const activeCount = useMemo(
    () => incidents.filter(inc => isIncidentActive(inc, apparatusMap)).length,
    [incidents, apparatusMap]
  );

  const filtered = useMemo(() => {
    let list = [...incidents];
    if (activeFilter) {
      list = list.filter(inc => categorizeIncident(inc.type) === activeFilter);
    }
    if (showActiveOnly) {
      list = list.filter(inc => isIncidentActive(inc, apparatusMap));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(inc =>
        (inc.type || '').toLowerCase().includes(q) ||
        (inc.address || '').toLowerCase().includes(q) ||
        (inc.incident_number || '').toLowerCase().includes(q)
      );
    }
    if (sortAsc) list.reverse();
    return list;
  }, [incidents, activeFilter, showActiveOnly, search, sortAsc, apparatusMap]);

  return (
    <div className="flex flex-col h-full border-r border-white/[0.06]" style={{ background: '#0c0f18' }}>
      {/* Header section */}
      <div className="p-3 border-b border-white/[0.06] space-y-2.5 shrink-0">
        <WeatherWidget />

        {/* Search */}
        <div className="relative">
          <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            type="text"
            placeholder="Search incidents..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-7 pr-7 py-1.5 text-[11px] rounded-lg text-slate-300 placeholder-slate-700
              focus:outline-none transition-all duration-150"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.18)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
            >
              <X size={10} />
            </button>
          )}
        </div>

        {/* Filters */}
        <StatsBar stats={stats} activeFilter={activeFilter} onFilterChange={onFilterChange} />
      </div>

      {/* List controls */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b border-white/[0.05] shrink-0"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-600 font-medium tabular-nums">
            {filtered.length} shown
          </span>
          {/* Active-only toggle */}
          <button
            onClick={() => setShowActiveOnly(a => !a)}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold transition-all"
            style={showActiveOnly
              ? { background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }
              : { background: 'rgba(255,255,255,0.04)', color: '#475569', border: '1px solid rgba(255,255,255,0.06)' }
            }
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: showActiveOnly ? '#4ade80' : '#475569' }}
            />
            Active ({activeCount})
          </button>
        </div>
        <button
          onClick={() => setSortAsc(s => !s)}
          className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-slate-400 transition-colors"
        >
          {sortAsc ? <SortAsc size={10} /> : <SortDesc size={10} />}
          <span>{sortAsc ? 'Oldest' : 'Newest'}</span>
        </button>
      </div>

      {/* Incident list */}
      <div className="flex-1 overflow-y-scroll" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <Search size={20} className="text-slate-700" />
            <span className="text-[11px] text-slate-600">No incidents found</span>
          </div>
        ) : (
          <div className="p-2 space-y-1.5">
            {filtered.map(inc => (
              <IncidentCard
                key={inc.id}
                incident={inc}
                selected={selectedId === inc.id}
                onClick={() => onSelect(inc)}
                apparatusMap={apparatusMap}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
