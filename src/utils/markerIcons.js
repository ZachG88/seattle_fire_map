// SVG path strings for Leaflet map markers (Lucide-derived, rendered as inline SVG)

export const MARKER_SVG_PATHS = {
  fire: `
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
      fill="white" stroke="none"/>
  `,
  aid: `
    <line x1="12" y1="5" x2="12" y2="19" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="5"  y1="12" x2="19" y2="12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
  `,
  rescue: `
    <circle cx="12" cy="12" r="10" fill="none" stroke="white" stroke-width="2"/>
    <circle cx="12" cy="12" r="4"  fill="none" stroke="white" stroke-width="2"/>
    <line x1="4.93"  y1="4.93"  x2="7.76"  y2="7.76"  stroke="white" stroke-width="2"/>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" stroke="white" stroke-width="2"/>
    <line x1="19.07" y1="4.93"  x2="16.24" y2="7.76"  stroke="white" stroke-width="2"/>
    <line x1="7.76"  y1="16.24" x2="4.93"  y2="19.07" stroke="white" stroke-width="2"/>
  `,
  alarm: `
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
      fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"
      fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
  `,
  hazmat: `
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
      fill="none" stroke="white" stroke-width="2" stroke-linejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="12" cy="17" r="0.5" fill="white" stroke="white" stroke-width="1.5"/>
  `,
  other: `
    <rect x="1" y="3" width="15" height="13" rx="1" fill="none" stroke="white" stroke-width="2"/>
    <path d="M16 8h4l3 5v3h-7V8z" fill="none" stroke="white" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="5.5"  cy="18.5" r="2.5" fill="none" stroke="white" stroke-width="2"/>
    <circle cx="18.5" cy="18.5" r="2.5" fill="none" stroke="white" stroke-width="2"/>
  `,
};

export function buildMarkerHTML(category, color, size) {
  const paths = MARKER_SVG_PATHS[category] || MARKER_SVG_PATHS.other;
  const iconSize = Math.round(size * 0.52);
  return `
    <div style="
      width:${size}px;
      height:${size}px;
      background:${color};
      border-radius:50%;
      border:2px solid rgba(255,255,255,0.8);
      box-shadow:0 2px 10px rgba(0,0,0,0.6);
      display:flex;
      align-items:center;
      justify-content:center;
    ">
      <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg" style="display:block">
        ${paths}
      </svg>
    </div>
  `;
}
