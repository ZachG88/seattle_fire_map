import { useState, useEffect } from 'react';

const API_URL = 'https://data.seattle.gov/resource/kzjm-xkqj.json';

// Cache results per address to avoid redundant fetches
const cache = new Map();

export function useIncidentHistory(address, currentIncidentId) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;

    // Normalize address for cache key
    const key = address.trim().toLowerCase();

    if (cache.has(key)) {
      const cached = cache.get(key).filter(inc => inc.id !== currentIncidentId);
      setHistory(cached);
      return;
    }

    setLoading(true);
    const controller = new AbortController();

    async function fetch30Days() {
      try {
        const thirtyDays = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString().replace('Z', '').split('.')[0];

        const encodedAddr = encodeURIComponent(address.trim());
        const query = [
          `$limit=20`,
          `$order=datetime DESC`,
          `$where=upper(address)=upper('${address.trim().replace(/'/g, "''")}') AND datetime >= '${thirtyDays}'`,
        ].join('&');

        const res = await globalThis.fetch(`${API_URL}?${query}`, { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();

        const incidents = data.map(inc => ({
          id: inc.incident_number || `${inc.datetime}`,
          incident_number: inc.incident_number,
          type: inc.type,
          datetime: inc.datetime,
        })).filter(inc => inc.id !== currentIncidentId);

        cache.set(key, incidents);
        setHistory(incidents);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetch30Days();
    return () => controller.abort();
  }, [address, currentIncidentId]);

  return { history, loading };
}
