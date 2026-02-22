import { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { STATIONS } from '../data/stations';

function buildStationIcon(station, isHovered) {
  const num = station.number;
  const size = isHovered ? 30 : 24;
  const fontSize = num >= 10 ? (isHovered ? 9 : 7) : (isHovered ? 10 : 8);

  return L.divIcon({
    html: `
      <div style="
        width:${size}px; height:${size}px;
        background:#1e293b;
        border:1.5px solid rgba(148,163,184,0.5);
        border-radius:4px;
        display:flex; align-items:center; justify-content:center;
        box-shadow:0 2px 8px rgba(0,0,0,0.6);
        transition: transform 0.15s;
        ${isHovered ? 'transform:scale(1.15);' : ''}
      ">
        <svg width="${size * 0.72}" height="${size * 0.72}" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <!-- Building silhouette (fire station shape) -->
          <rect x="2" y="8" width="20" height="14" rx="1"
            fill="rgba(148,163,184,0.12)" stroke="rgba(148,163,184,0.7)" stroke-width="1.5"/>
          <path d="M2 8L12 2L22 8" fill="none" stroke="rgba(148,163,184,0.7)" stroke-width="1.5" stroke-linejoin="round"/>
          <rect x="9" y="14" width="6" height="8" rx="0.5"
            fill="rgba(148,163,184,0.15)" stroke="rgba(148,163,184,0.5)" stroke-width="1"/>
        </svg>
        <span style="
          position:absolute;
          bottom:1px; right:2px;
          font-size:${fontSize}px;
          font-weight:700;
          color:rgba(148,163,184,0.9);
          font-family:system-ui,sans-serif;
          line-height:1;
          letter-spacing:-0.3px;
        ">${num}</span>
      </div>
    `,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function StationTooltip({ station }) {
  return `
    <div style="
      background:#151c2c;
      border:1px solid rgba(255,255,255,0.1);
      border-radius:10px;
      padding:10px 12px;
      min-width:180px;
      font-family:system-ui,sans-serif;
      color:#e2e8f0;
    ">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.07);padding-bottom:6px;">
        <span style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">
          Station ${station.number}
        </span>
      </div>
      <div style="font-size:10px;color:#64748b;margin-bottom:6px;">${station.address}</div>
      ${station.apparatus.length ? `
        <div style="font-size:9px;color:#475569;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Apparatus</div>
        <div style="display:flex;flex-wrap:wrap;gap:3px;">
          ${station.apparatus.map(u => `
            <span style="
              display:inline-block;
              padding:2px 5px;
              background:rgba(255,255,255,0.06);
              border:1px solid rgba(255,255,255,0.1);
              border-radius:3px;
              font-size:9px;
              font-weight:600;
              color:#94a3b8;
              font-family:monospace;
            ">${u}</span>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

export default function StationMarkers({ visible }) {
  const map = useMap();
  const markersRef = useRef({});

  useEffect(() => {
    if (!visible) {
      for (const m of Object.values(markersRef.current)) m.remove();
      markersRef.current = {};
      return;
    }

    for (const station of STATIONS) {
      if (markersRef.current[station.id]) continue;

      const marker = L.marker([station.lat, station.lon], {
        icon: buildStationIcon(station, false),
        zIndexOffset: -100,
      });

      marker.bindTooltip(StationTooltip({ station }), {
        direction: 'top',
        offset: [0, -14],
        opacity: 1,
        className: 'sfd-station-tooltip',
      });

      marker.on('mouseover', () => marker.setIcon(buildStationIcon(station, true)));
      marker.on('mouseout',  () => { marker.setIcon(buildStationIcon(station, false)); marker.closeTooltip(); });

      marker.addTo(map);
      markersRef.current[station.id] = marker;
    }

    return () => {
      for (const m of Object.values(markersRef.current)) m.remove();
      markersRef.current = {};
    };
  }, [visible, map]);

  return null;
}
