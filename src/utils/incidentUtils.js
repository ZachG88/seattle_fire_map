// Incident type categorization and styling utilities

export const INCIDENT_CATEGORIES = {
  fire: {
    label: 'Fire',
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.15)',
    borderColor: 'rgba(239,68,68,0.4)',
    iconName: 'Flame',
    keywords: ['fire', 'arson', 'brush', 'dumpster', 'rubbish', 'burn', 'vehicle fire', 'structure fire', 'wildland', 'chimney', 'car fire'],
  },
  aid: {
    label: 'Medical Aid',
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.15)',
    borderColor: 'rgba(59,130,246,0.4)',
    iconName: 'HeartPulse',
    keywords: ['aid response', 'medic', 'cardiac', 'aid'],
  },
  rescue: {
    label: 'Rescue',
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.15)',
    borderColor: 'rgba(245,158,11,0.4)',
    iconName: 'LifeBuoy',
    keywords: ['rescue', 'extrication', 'water rescue', 'cliff', 'confined space', 'trench'],
  },
  alarm: {
    label: 'Alarm',
    color: '#a855f7',
    bgColor: 'rgba(168,85,247,0.15)',
    borderColor: 'rgba(168,85,247,0.4)',
    iconName: 'BellRing',
    keywords: ['alarm', 'detector', 'co alarm', 'activated co', 'smoke', 'false alarm', 'auto fire alarm'],
  },
  hazmat: {
    label: 'Hazmat',
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.15)',
    borderColor: 'rgba(16,185,129,0.4)',
    iconName: 'FlaskConical',
    keywords: ['hazmat', 'spill', 'gas leak', 'natural gas', 'propane', 'chemical', 'biohazard', 'fuel'],
  },
  other: {
    label: 'Other',
    color: '#64748b',
    bgColor: 'rgba(100,116,139,0.15)',
    borderColor: 'rgba(100,116,139,0.4)',
    iconName: 'Truck',
    keywords: [],
  },
};

export function categorizeIncident(type) {
  if (!type) return 'other';
  const lower = type.toLowerCase();
  for (const [key, cat] of Object.entries(INCIDENT_CATEGORIES)) {
    if (key === 'other') continue;
    if (cat.keywords.some(kw => lower.includes(kw))) return key;
  }
  return 'other';
}

export function getCategoryStyle(categoryKey) {
  return INCIDENT_CATEGORIES[categoryKey] || INCIDENT_CATEGORIES.other;
}

export function formatDateTime(datetime) {
  if (!datetime) return 'Unknown time';
  try {
    const d = new Date(datetime);
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  } catch {
    return datetime;
  }
}

export function timeAgo(datetime) {
  if (!datetime) return '';
  const now = new Date();
  const then = new Date(datetime);
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function getIncidentStats(incidents) {
  const stats = { total: incidents.length };
  for (const key of Object.keys(INCIDENT_CATEGORIES)) {
    stats[key] = 0;
  }
  for (const inc of incidents) {
    const cat = categorizeIncident(inc.type);
    stats[cat] = (stats[cat] || 0) + 1;
  }
  return stats;
}
