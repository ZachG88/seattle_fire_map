import { useEffect, useState } from 'react';
import {
  MapPin, Clock, Hash, Navigation, ExternalLink, Radio,
  X, ShieldAlert, Building2, History,
  FileText, ChevronRight, Thermometer, Wind, Accessibility,
} from 'lucide-react';
import { getCategoryStyle, categorizeIncident, formatDateTime, timeAgo } from '../utils/incidentUtils';
import { isIncidentActive } from '../hooks/useApparatus';
import { getStationForUnit, getStationById } from '../data/stations';
import { lookupTypeCode, getUnitTypeLabel } from '../data/typeCodes';
import { useGeocode } from '../hooks/useGeocode';
import { useIncidentHistory } from '../hooks/useIncidentHistory';
import { useWeather } from '../hooks/useWeather';
import { useBuilding } from '../hooks/useBuilding';
import CategoryIcon from './CategoryIcon';

// ─── Sub-components ──────────────────────────────────────────────────────────

function Section({ icon: Icon, title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/[0.05] last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-left"
      >
        <div className="flex items-center gap-1.5">
          <Icon size={10} className="text-slate-600" />
          <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-600">{title}</span>
        </div>
        <ChevronRight
          size={11}
          className="text-slate-700 transition-transform duration-150"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}

function UnitBadge({ unit }) {
  const stationNum = getStationForUnit(unit);
  const typeLabel = getUnitTypeLabel(unit);
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        className="inline-flex items-center px-2 py-1 rounded text-[11px] font-mono font-bold"
        style={{ background: 'rgba(255,255,255,0.07)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        {unit}
      </span>
      <span className="text-[9px] text-slate-600">{typeLabel}</span>
      {stationNum && (
        <span className="text-[9px] text-slate-700">Stn {stationNum}</span>
      )}
    </div>
  );
}

function StatusBadge({ active, style }) {
  return (
    <span
      className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
      style={active
        ? { backgroundColor: `${style.color}18`, color: style.color }
        : { backgroundColor: 'rgba(255,255,255,0.05)', color: '#475569' }
      }
    >
      {active && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: style.color }} />}
      {active ? 'Active' : 'Closed'}
    </span>
  );
}

// ─── Main popup ──────────────────────────────────────────────────────────────

export default function IncidentPopup({ incident, apparatus, onClose }) {
  if (!incident) return null;

  const category = categorizeIncident(incident.type);
  const style = getCategoryStyle(category);
  const active = isIncidentActive(incident, apparatus ? { [incident.incident_number]: apparatus } : {});
  const typeInfo = lookupTypeCode(incident.type);

  const { geo, geocode } = useGeocode();
  const { history, loading: historyLoading } = useIncidentHistory(incident.address, incident.id);
  const { weather } = useWeather();
  const { building, lookup: lookupBuilding } = useBuilding();

  useEffect(() => {
    geocode(incident.latitude, incident.longitude);
    lookupBuilding(incident.latitude, incident.longitude);
  }, [incident.latitude, incident.longitude, geocode, lookupBuilding]);

  const units = apparatus?.units || [];
  const unitsWithInfo = units.map(unit => ({
    unit,
    stationNum: getStationForUnit(unit),
    typeLabel: getUnitTypeLabel(unit),
  }));

  const respondingStations = [...new Set(
    unitsWithInfo.map(u => u.stationNum).filter(Boolean)
  )].map(num => getStationById(num)).filter(Boolean);

  const mapsUrl = `https://www.google.com/maps?q=${incident.latitude},${incident.longitude}`;

  // Weather context for fire incidents
  const showFireWeather = (category === 'fire') && weather;

  return (
    <div className="flex flex-col overflow-hidden" style={{ minHeight: 0, flex: '1 1 auto' }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div
        className="px-4 pt-4 pb-3.5 shrink-0"
        style={{ borderBottom: `1px solid ${style.color}20` }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            {/* Category icon */}
            <div
              className="mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 relative"
              style={{ backgroundColor: `${style.color}18`, border: `1px solid ${style.color}30`, color: style.color }}
            >
              <CategoryIcon category={category} size={16} />
              {active && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                  style={{ backgroundColor: style.color, borderColor: '#151c2c' }}
                >
                  <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: style.color, opacity: 0.5 }} />
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              {/* Badges row */}
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                <span
                  className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${style.color}20`, color: style.color }}
                >
                  {style.label}
                </span>
                {apparatus?.level && (
                  <span className="flex items-center gap-0.5 text-[9px] font-semibold text-amber-400/80">
                    <ShieldAlert size={9} />
                    Level {apparatus.level}
                  </span>
                )}
                <StatusBadge active={active} style={style} />
                {typeInfo?.code && (
                  <span className="text-[9px] font-mono text-slate-700 px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {typeInfo.code}
                  </span>
                )}
              </div>

              {/* Incident type title */}
              <h2 className="text-[14px] font-semibold text-white leading-snug">
                {incident.type || 'Unknown Incident'}
              </h2>
              {typeInfo && typeInfo.label !== incident.type && (
                <p className="text-[10px] text-slate-500 mt-0.5">{typeInfo.label}</p>
              )}
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-600 hover:text-slate-300 transition-colors shrink-0 mt-0.5 p-1 rounded hover:bg-white/[0.06]"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Scrollable body ──────────────────────────────────────────────────── */}
      <div className="overflow-y-scroll flex-1" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>

        {/* Location & Time */}
        <Section icon={MapPin} title="Location & Time">
          <div className="space-y-2.5">
            {/* Address */}
            <div className="flex items-start gap-2.5">
              <MapPin size={12} className="text-slate-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[12px] text-slate-200 font-medium leading-snug">
                  {incident.address || 'Unknown location'}
                </p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2.5">
              <Clock size={12} className="text-slate-600 shrink-0" />
              <div>
                <p className="text-[12px] text-slate-200">{formatDateTime(incident.datetime)}</p>
                <p className="text-[10px] text-slate-600">{timeAgo(incident.datetime)}</p>
              </div>
            </div>

            {/* Coords */}
            <div className="flex items-center gap-2.5">
              <Navigation size={12} className="text-slate-600 shrink-0" />
              <span className="text-[10px] text-slate-600 font-mono">
                {incident.latitude.toFixed(5)}, {incident.longitude.toFixed(5)}
              </span>
            </div>

            {/* Incident # */}
            {incident.incident_number && (
              <div className="flex items-center gap-2.5">
                <Hash size={12} className="text-slate-600 shrink-0" />
                <span className="text-[11px] text-slate-500 font-mono">{incident.incident_number}</span>
              </div>
            )}
          </div>
        </Section>

        {/* Incident Type Info */}
        {typeInfo && (
          <Section icon={FileText} title="Incident Classification">
            <div className="rounded-lg p-3 space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-600 uppercase tracking-widest">Type Code</span>
                <span className="text-[11px] font-mono font-bold text-slate-300">{typeInfo.code}</span>
              </div>
              <div>
                <p className="text-[11px] text-slate-300 font-medium">{typeInfo.label}</p>
              </div>
            </div>
          </Section>
        )}

        {/* Structure / Building Info */}
        {building && (
          <Section icon={Building2} title="Structure Information">
            <div className="space-y-2">
              {/* Name */}
              {building.name && (
                <div
                  className="rounded-lg px-3 py-2.5"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <p className="text-[9px] text-slate-600 uppercase tracking-widest mb-0.5">Name / Occupant</p>
                  <p className="text-[12px] font-semibold text-slate-200 leading-snug">{building.name}</p>
                  {building.operator && building.operator !== building.name && (
                    <p className="text-[10px] text-slate-500 mt-0.5">Operated by {building.operator}</p>
                  )}
                </div>
              )}

              {/* Physical attributes */}
              <div className="grid grid-cols-2 gap-2">
                {building.levels && (
                  <div
                    className="rounded-lg px-2.5 py-2"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <p className="text-[9px] text-slate-600 uppercase tracking-widest mb-0.5">Floors</p>
                    <p className="text-[13px] font-bold text-slate-200">{building.levels}</p>
                  </div>
                )}
                {building.height && (
                  <div
                    className="rounded-lg px-2.5 py-2"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <p className="text-[9px] text-slate-600 uppercase tracking-widest mb-0.5">Height</p>
                    <p className="text-[13px] font-bold text-slate-200">{building.height} m</p>
                  </div>
                )}
                {building.startDate && (
                  <div
                    className="rounded-lg px-2.5 py-2"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <p className="text-[9px] text-slate-600 uppercase tracking-widest mb-0.5">Built</p>
                    <p className="text-[11px] font-semibold text-slate-200">{building.startDate.slice(0, 4)}</p>
                  </div>
                )}
                {building.wheelchair && building.wheelchair !== 'no' && (
                  <div
                    className="rounded-lg px-2.5 py-2 flex items-center gap-1.5"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <Accessibility size={10} className="text-emerald-500" />
                    <p className="text-[10px] text-emerald-500">Accessible</p>
                  </div>
                )}
              </div>

            </div>
          </Section>
        )}

        {/* Responding Resources */}
        {(unitsWithInfo.length > 0 || respondingStations.length > 0) && (
          <Section icon={Radio} title="Responding Resources">
            {unitsWithInfo.length > 0 && (
              <>
                <p className="text-[9px] text-slate-600 uppercase tracking-widest mb-2">Units Dispatched</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {unitsWithInfo.map(({ unit }) => (
                    <UnitBadge key={unit} unit={unit} />
                  ))}
                </div>
              </>
            )}
            {respondingStations.length > 0 && (
              <>
                <p className="text-[9px] text-slate-600 uppercase tracking-widest mb-2">Responding Stations</p>
                <div className="space-y-1.5">
                  {respondingStations.map(station => (
                    <div
                      key={station.id}
                      className="flex items-center justify-between rounded-lg px-2.5 py-2"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 size={11} className="text-slate-600" />
                        <span className="text-[11px] font-semibold text-slate-300">Station {station.number}</span>
                      </div>
                      <span className="text-[10px] text-slate-600">{station.address}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {unitsWithInfo.length === 0 && respondingStations.length === 0 && (
              <p className="text-[11px] text-slate-600 italic">Unit data unavailable — SFD realtime page may be restricted</p>
            )}
          </Section>
        )}

        {/* Fire Weather (shown for fire incidents) */}
        {showFireWeather && (
          <Section icon={Thermometer} title="Fire Weather Conditions" defaultOpen={false}>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Thermometer, label: 'Temperature', value: `${weather.temp}°F (feels ${weather.feelsLike}°F)` },
                { icon: Wind, label: 'Wind', value: `${weather.windSpeed} mph` },
                { icon: () => null, label: 'Humidity', value: `${weather.humidity}%` },
                { icon: () => null, label: 'Conditions', value: weather.description },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-lg px-2.5 py-2"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <p className="text-[9px] text-slate-600 uppercase tracking-widest mb-0.5">{label}</p>
                  <p className="text-[11px] text-slate-300 font-medium">{value}</p>
                </div>
              ))}
            </div>
            {weather.windSpeed > 15 && (
              <div
                className="mt-2 flex items-center gap-2 rounded-lg px-2.5 py-2 text-[10px] text-amber-400"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
              >
                <Wind size={11} />
                Elevated wind may affect fire spread
              </div>
            )}
          </Section>
        )}

        {/* Address History */}
        <Section icon={History} title="Recent at This Address (30 days)" defaultOpen={false}>
          {historyLoading ? (
            <div className="space-y-1.5">
              {[1, 2, 3].map(i => (
                <div key={i} className="shimmer h-8 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />
              ))}
            </div>
          ) : history.length === 0 ? (
            <p className="text-[11px] text-slate-600 italic">No other incidents at this address in the last 30 days</p>
          ) : (
            <div className="space-y-1">
              {history.slice(0, 8).map(inc => (
                <div
                  key={inc.id}
                  className="flex items-center justify-between rounded-lg px-2.5 py-2"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <span className="text-[11px] text-slate-400 truncate max-w-[160px]">{inc.type || 'Unknown'}</span>
                  <span className="text-[10px] text-slate-600 shrink-0 ml-2">{timeAgo(inc.datetime)}</span>
                </div>
              ))}
              {history.length > 8 && (
                <p className="text-[10px] text-slate-700 text-center pt-1">+{history.length - 8} more</p>
              )}
            </div>
          )}
        </Section>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <div
        className="px-4 py-3 shrink-0 border-t border-white/[0.06]"
        style={{ background: '#111827' }}
      >
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-[11px] font-medium
            text-slate-400 hover:text-white transition-all duration-150"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <ExternalLink size={11} />
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}
