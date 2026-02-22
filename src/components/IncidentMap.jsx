import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { categorizeIncident, getCategoryStyle } from '../utils/incidentUtils';
import { buildMarkerHTML } from '../utils/markerIcons';
import { isIncidentActive } from '../hooks/useApparatus';
import IncidentPopup from './IncidentPopup';
import StationMarkers from './StationMarkers';
import RouteLayer from './RouteLayer';

const SEATTLE_CENTER = [47.6062, -122.3321];
const DEFAULT_ZOOM = 12;

const LEGEND_ITEMS = [
  { category: 'fire',   label: 'Fire',       color: '#ef4444' },
  { category: 'aid',    label: 'Medical Aid', color: '#3b82f6' },
  { category: 'rescue', label: 'Rescue',      color: '#f59e0b' },
  { category: 'alarm',  label: 'Alarm',       color: '#a855f7' },
  { category: 'hazmat', label: 'Hazmat',      color: '#10b981' },
  { category: 'other',  label: 'Other',       color: '#64748b' },
];

function createIcon(category, color, isSelected, isActive) {
  const size = isSelected ? 34 : 26;
  // Dim inactive incidents slightly
  const opacity = isActive ? 1 : 0.45;
  return L.divIcon({
    html: `<div style="opacity:${opacity}">${buildMarkerHTML(category, color, size)}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function MapController({ selectedIncident }) {
  const map = useMap();
  useEffect(() => {
    if (selectedIncident) {
      map.flyTo(
        [selectedIncident.latitude, selectedIncident.longitude],
        Math.max(map.getZoom(), 15),
        { duration: 0.7, easeLinearity: 0.25 }
      );
    }
  }, [selectedIncident, map]);
  return null;
}

function IncidentMarkers({ incidents, selectedId, onSelect, activeFilter, apparatusMap }) {
  const map = useMap();
  const markersRef = useRef({});

  const visible = activeFilter
    ? incidents.filter(inc => categorizeIncident(inc.type) === activeFilter)
    : incidents;

  useEffect(() => {
    const visibleIds = new Set(visible.map(i => i.id));

    for (const [id, marker] of Object.entries(markersRef.current)) {
      if (!visibleIds.has(id)) { marker.remove(); delete markersRef.current[id]; }
    }

    for (const inc of visible) {
      const category = categorizeIncident(inc.type);
      const style = getCategoryStyle(category);
      const isSelected = inc.id === selectedId;
      const active = isIncidentActive(inc, apparatusMap);

      if (markersRef.current[inc.id]) {
        markersRef.current[inc.id].setIcon(createIcon(category, style.color, isSelected, active));
        markersRef.current[inc.id].setZIndexOffset(isSelected ? 1000 : active ? 0 : -50);
      } else {
        const marker = L.marker([inc.latitude, inc.longitude], {
          icon: createIcon(category, style.color, isSelected, active),
          zIndexOffset: active ? 0 : -50,
        });
        marker.on('click', () => onSelect(inc));
        marker.addTo(map);
        markersRef.current[inc.id] = marker;
      }
    }
  }, [visible, selectedId, map, onSelect, apparatusMap]);

  useEffect(() => {
    return () => {
      for (const m of Object.values(markersRef.current)) m.remove();
      markersRef.current = {};
    };
  }, []);

  return null;
}

export default function IncidentMap({ incidents, selectedIncident, onSelect, activeFilter, apparatusMap }) {
  const [showStations, setShowStations] = useState(true);
  const [legendOpen, setLegendOpen] = useState(() => window.innerWidth >= 768);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={SEATTLE_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />
        <ZoomControl position="bottomright" />
        <MapController selectedIncident={selectedIncident} />
        <StationMarkers visible={showStations} />
        <RouteLayer selectedIncident={selectedIncident} apparatusMap={apparatusMap} />
        <IncidentMarkers
          incidents={incidents}
          selectedId={selectedIncident?.id}
          onSelect={onSelect}
          activeFilter={activeFilter}
          apparatusMap={apparatusMap}
        />
      </MapContainer>

      {/* Selected incident detail panel */}
      {selectedIncident && (
        <div className="incident-popup-wrap fade-in-up">
          <div
            className="incident-popup-inner overflow-hidden shadow-2xl border border-white/[0.09] flex flex-col"
            style={{ background: '#111827' }}
          >
            <IncidentPopup
              incident={selectedIncident}
              apparatus={apparatusMap?.[selectedIncident.incident_number]}
              onClose={() => onSelect(selectedIncident)}
            />
          </div>
        </div>
      )}

      {/* Map controls panel (top-right) */}
      <div
        className="absolute top-3 right-3 z-[500] rounded-xl border border-white/[0.08] overflow-hidden"
        style={{ background: 'rgba(12,15,24,0.9)', backdropFilter: 'blur(8px)' }}
      >
        {/* Legend toggle header */}
        <button
          onClick={() => setLegendOpen(o => !o)}
          className="flex items-center justify-between w-full px-3 py-2.5 text-left"
        >
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Legend</span>
          <svg
            width="10" height="10" viewBox="0 0 10 10" fill="none"
            className="text-slate-600 transition-transform duration-150"
            style={{ transform: legendOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {legendOpen && (
          <>
            {/* Incident types */}
            <div className="px-3 pb-3">
              <div className="space-y-1.5">
                {LEGEND_ITEMS.map(item => (
                  <div key={item.category} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] text-slate-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-white/[0.06]" />

            {/* Activity */}
            <div className="px-3 py-2.5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/80 shrink-0" />
                  <span className="text-[10px] text-slate-400">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/25 shrink-0" />
                  <span className="text-[10px] text-slate-400">Inactive</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/[0.06]" />

            {/* Station toggle */}
            <div className="px-3 py-2.5">
              <button
                onClick={() => setShowStations(s => !s)}
                className="flex items-center gap-2 w-full text-left"
              >
                <div
                  className="w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 transition-colors"
                  style={showStations
                    ? { background: '#3b82f6', borderColor: '#3b82f6' }
                    : { background: 'transparent', borderColor: 'rgba(255,255,255,0.2)' }
                  }
                >
                  {showStations && (
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <polyline points="1.5,5 4,7.5 8.5,2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-[10px] text-slate-400">Fire Stations</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
