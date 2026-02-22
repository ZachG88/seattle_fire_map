import { INCIDENT_CATEGORIES } from '../utils/incidentUtils';
import CategoryIcon from './CategoryIcon';

function FilterButton({ label, count, isActive, onClick, category, color, bgColor, borderColor }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] transition-all duration-150 border"
      style={isActive
        ? { backgroundColor: bgColor, borderColor, color }
        : { backgroundColor: 'transparent', borderColor: 'transparent', color: '#64748b' }
      }
    >
      <div className="flex items-center gap-2">
        {category
          ? <CategoryIcon category={category} size={11} />
          : <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#64748b' }} />
        }
        <span className={`font-medium ${isActive ? 'text-white' : 'text-slate-400'}`}>{label}</span>
      </div>
      <span
        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md tabular-nums"
        style={isActive
          ? { backgroundColor: 'rgba(255,255,255,0.14)', color }
          : { backgroundColor: 'rgba(255,255,255,0.04)', color: '#475569' }
        }
      >
        {count}
      </span>
    </button>
  );
}

export default function StatsBar({ stats, activeFilter, onFilterChange }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[9px] uppercase tracking-widest text-slate-600 font-medium px-0.5 pb-1">
        Filter by Type
      </p>

      <FilterButton
        label="All Incidents"
        count={stats.total || 0}
        isActive={activeFilter === null}
        onClick={() => onFilterChange(null)}
        color="#94a3b8"
        bgColor="rgba(148,163,184,0.1)"
        borderColor="rgba(148,163,184,0.2)"
      />

      {Object.entries(INCIDENT_CATEGORIES).map(([key, cat]) => (
        <FilterButton
          key={key}
          label={cat.label}
          count={stats[key] || 0}
          isActive={activeFilter === key}
          onClick={() => onFilterChange(activeFilter === key ? null : key)}
          category={key}
          color={cat.color}
          bgColor={cat.bgColor}
          borderColor={cat.borderColor}
        />
      ))}
    </div>
  );
}
