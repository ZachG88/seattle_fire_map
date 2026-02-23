import { useState, useEffect, useCallback } from 'react';

// In dev, Vite proxies /sfd-realtime to avoid CORS. In production, the Vercel
// serverless function at /api/sfd-proxy handles the server-side proxy.
const SFD_PROXY_URL = import.meta.env.DEV
  ? '/sfd-realtime/getRecsForDatePub.asp?action=Today&incDate=&rad1=des'
  : '/api/sfd-proxy';

/**
 * Parse the SFD Real-Time 911 page HTML.
 *
 * Actual page structure (confirmed from live source):
 *   <tr id="row_N" ...>
 *     <td class="active|closed" ...>Date/Time</td>   [0]
 *     <td class="active|closed" ...>Incident #</td>  [1]  e.g. F260025137
 *     <td class="active|closed" ...>Level</td>       [2]  e.g. 1, H1, or empty
 *     <td class="active|closed" ...>Units</td>       [3]  e.g. "E30 L12"
 *     <td class="active|closed" ...>Location</td>    [4]
 *     <td class="active|closed" ...>Type</td>        [5]
 *   </tr>
 *
 * Active = class="active", Closed = class="closed"
 * No images in data rows — only in the legend above the table.
 */
function parseSFDHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const map = {}; // incidentNumber → { datetime, level, units[], location, type, active }

  // Find all data rows — they have id starting with "row_"
  const rows = doc.querySelectorAll('tr[id^="row_"]');

  for (const row of rows) {
    const cells = row.querySelectorAll('td');
    if (cells.length < 6) continue;

    // Active/closed determined by CSS class on the first cell
    const active = cells[0].className.trim() === 'active';

    const datetime = cells[0].textContent.trim();
    const incidentNum = cells[1].textContent.trim();
    const level = cells[2].textContent.trim();
    const unitsRaw = cells[3].textContent.trim();
    const location = cells[4].textContent.trim();
    const type = cells[5].textContent.trim();

    if (!incidentNum || !incidentNum.startsWith('F')) continue;

    // Units are space-separated in one cell
    const units = unitsRaw ? unitsRaw.split(/\s+/).filter(Boolean) : [];

    map[incidentNum] = { datetime, level, units, location, type, active };
  }

  return map;
}

export function useApparatus() {
  const [apparatusMap, setApparatusMap] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | ok | error
  const [lastFetched, setLastFetched] = useState(null);

  const fetchApparatus = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await fetch(SFD_PROXY_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      const parsed = parseSFDHtml(html);
      if (Object.keys(parsed).length > 0) {
        setApparatusMap(parsed);
        setLastFetched(new Date());
        setStatus('ok');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchApparatus();
    const id = setInterval(fetchApparatus, 60 * 1000); // SFD page refreshes every 60s
    return () => clearInterval(id);
  }, [fetchApparatus]);

  return { apparatusMap, status, lastFetched, refresh: fetchApparatus };
}

/**
 * Determine if an incident is still active.
 * Priority: SFD realtime data → 90-minute recency fallback.
 */
export function isIncidentActive(incident, apparatusMap) {
  const entry = apparatusMap?.[incident.incident_number];
  if (entry !== undefined) return entry.active;
  // Fallback: treat incidents within 90 min as likely still active
  if (!incident.datetime) return false;
  return (Date.now() - new Date(incident.datetime).getTime()) < 90 * 60 * 1000;
}
