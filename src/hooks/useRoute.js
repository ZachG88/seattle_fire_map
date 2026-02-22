import { useState, useEffect } from 'react';

// OSRM — open-source routing, free, no API key
const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving';

const cache = new Map();

/**
 * Fetch a driving route between two points using OSRM.
 * Returns decoded Leaflet-compatible [lat, lon] positions plus distance/duration.
 */
export function useRoute(originLat, originLon, destLat, destLon) {
  const [state, setState] = useState({ positions: null, distance: null, duration: null });

  useEffect(() => {
    if (originLat == null || originLon == null || destLat == null || destLon == null) {
      setState({ positions: null, distance: null, duration: null });
      return;
    }

    const key = `${originLon.toFixed(4)},${originLat.toFixed(4)};${destLon.toFixed(4)},${destLat.toFixed(4)}`;

    if (cache.has(key)) {
      setState(cache.get(key));
      return;
    }

    const controller = new AbortController();

    async function fetchRoute() {
      try {
        // OSRM expects coordinates as lon,lat
        const url = `${OSRM_BASE}/${originLon},${originLat};${destLon},${destLat}?overview=full&geometries=geojson`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        if (!data.routes || data.routes.length === 0) return;

        const route = data.routes[0];
        // GeoJSON coords are [lon, lat]; Leaflet needs [lat, lon]
        const positions = route.geometry.coordinates.map(([lon, lat]) => [lat, lon]);
        const result = {
          positions,
          distance: route.distance, // metres
          duration: route.duration, // seconds
        };
        cache.set(key, result);
        setState(result);
      } catch {
        // silently fail — non-critical
      }
    }

    fetchRoute();
    return () => controller.abort();
  }, [originLat, originLon, destLat, destLon]);

  return state;
}

export function formatRouteLabel(distance, duration) {
  const mins = Math.round(duration / 60);
  const miles = (distance * 0.000621371).toFixed(1);
  return `~${mins} min · ${miles} mi`;
}
