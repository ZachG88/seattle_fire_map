import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useRoute, formatRouteLabel } from '../hooks/useRoute';
import { getStationForUnit, getStationById } from '../data/stations';
import { getCategoryStyle, categorizeIncident } from '../utils/incidentUtils';

/**
 * Derives the primary responding station for an incident.
 * Uses apparatus unit → station mapping; falls back to null if no data.
 */
function getPrimaryStation(incident, apparatusMap) {
  if (!incident) return null;
  const apparatus = apparatusMap?.[incident.incident_number];
  const units = apparatus?.units || [];
  for (const unit of units) {
    const num = getStationForUnit(unit);
    if (num) {
      const station = getStationById(num);
      if (station) return station;
    }
  }
  return null;
}

export default function RouteLayer({ selectedIncident, apparatusMap }) {
  const map = useMap();
  const polylineRef = useRef(null);
  const labelRef = useRef(null);
  const originMarkerRef = useRef(null);

  const station = getPrimaryStation(selectedIncident, apparatusMap);

  const { positions, distance, duration } = useRoute(
    station?.lat ?? null,
    station?.lon ?? null,
    selectedIncident?.latitude ?? null,
    selectedIncident?.longitude ?? null,
  );

  useEffect(() => {
    // Clean up previous route graphics
    polylineRef.current?.remove();
    polylineRef.current = null;
    labelRef.current?.remove();
    labelRef.current = null;
    originMarkerRef.current?.remove();
    originMarkerRef.current = null;

    if (!positions || positions.length < 2 || !selectedIncident || !station) return;

    const category = categorizeIncident(selectedIncident.type);
    const { color } = getCategoryStyle(category);

    // ── Route polyline ────────────────────────────────────────────────────────
    polylineRef.current = L.polyline(positions, {
      color,
      weight: 3,
      opacity: 0.75,
      dashArray: '10, 8',
      lineJoin: 'round',
    }).addTo(map);

    // ── ETA label at midpoint ─────────────────────────────────────────────────
    if (distance != null && duration != null) {
      const mid = positions[Math.floor(positions.length / 2)];
      const label = formatRouteLabel(distance, duration);
      labelRef.current = L.marker(mid, {
        icon: L.divIcon({
          html: `<div style="
            background: rgba(10,13,22,0.88);
            color: ${color};
            border: 1px solid ${color}40;
            border-radius: 20px;
            padding: 3px 9px;
            font-size: 10px;
            font-weight: 600;
            font-family: ui-monospace, monospace;
            white-space: nowrap;
            pointer-events: none;
            backdrop-filter: blur(6px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.5);
          ">${label}</div>`,
          className: '',
          iconAnchor: [0, 0],
        }),
        interactive: false,
        zIndexOffset: 900,
      }).addTo(map);
    }

    // ── Station origin pulse ring ─────────────────────────────────────────────
    originMarkerRef.current = L.marker([station.lat, station.lon], {
      icon: L.divIcon({
        html: `<div style="
          width: 14px; height: 14px;
          border-radius: 50%;
          border: 2px solid ${color};
          background: ${color}30;
          box-shadow: 0 0 0 4px ${color}20;
          animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
        "></div>`,
        className: '',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      }),
      interactive: false,
      zIndexOffset: 950,
    }).addTo(map);

    return () => {
      polylineRef.current?.remove();
      polylineRef.current = null;
      labelRef.current?.remove();
      labelRef.current = null;
      originMarkerRef.current?.remove();
      originMarkerRef.current = null;
    };
  }, [positions, distance, duration, selectedIncident, station, map]);

  return null;
}
