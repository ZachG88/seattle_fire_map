import { MapPin, Clock } from 'lucide-react';
import { categorizeIncident, getCategoryStyle, timeAgo } from '../utils/incidentUtils';
import { isIncidentActive } from '../hooks/useApparatus';
import CategoryIcon from './CategoryIcon';

export default function IncidentCard({ incident, selected, onClick, apparatusMap }) {
  const category = categorizeIncident(incident.type);
  const style = getCategoryStyle(category);
  const active = isIncidentActive(incident, apparatusMap);

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-xl border transition-all duration-150 fade-in-up"
      style={selected
        ? { backgroundColor: style.bgColor, borderColor: style.borderColor }
        : { backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }
      }
    >
      <div className="flex items-start gap-2.5">
        {/* Category icon */}
        <div
          className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 relative"
          style={{ backgroundColor: `${style.color}18`, border: `1px solid ${style.color}35`, color: style.color }}
        >
          <CategoryIcon category={category} size={13} />
          {/* Active pulse dot */}
          {active && (
            <span
              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#0c0f18]"
              style={{ backgroundColor: style.color }}
            >
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{ backgroundColor: style.color, opacity: 0.6 }}
              />
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p
              className="text-[11px] font-semibold truncate leading-tight"
              style={{ color: active ? '#e2e8f0' : '#64748b' }}
            >
              {incident.type || 'Unknown Type'}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <MapPin size={9} className="text-slate-700 shrink-0" />
            <p className="text-[10px] text-slate-500 truncate">{incident.address || 'Unknown location'}</p>
          </div>

          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-1">
              <Clock size={9} className="text-slate-700" />
              <span className="text-[10px] text-slate-600">{timeAgo(incident.datetime)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Active / Inactive badge */}
              <span
                className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md"
                style={active
                  ? { backgroundColor: `${style.color}18`, color: style.color }
                  : { backgroundColor: 'rgba(255,255,255,0.04)', color: '#475569' }
                }
              >
                {active ? 'Active' : 'Closed'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
