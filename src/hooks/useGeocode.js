import { useState, useCallback, useRef } from 'react';

// Nominatim reverse geocoding — free, no API key required
// Cache results by "lat,lon" key to avoid redundant requests
const cache = new Map();

export function useGeocode() {
  const [geo, setGeo] = useState(null);
  const [loading, setLoading] = useState(false);
  const lastKeyRef = useRef(null);

  const geocode = useCallback(async (lat, lon) => {
    const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
    if (key === lastKeyRef.current) return; // same location, skip
    lastKeyRef.current = key;

    if (cache.has(key)) {
      setGeo(cache.get(key));
      return;
    }

    setLoading(true);
    setGeo(null);

    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=18&addressdetails=1`;
      const res = await fetch(url, {
        headers: { 'Accept-Language': 'en-US', 'User-Agent': 'SeattleFireWatch/1.0' },
      });
      if (!res.ok) return;
      const data = await res.json();
      const addr = data.address || {};
      const result = {
        neighbourhood: addr.neighbourhood || addr.suburb || addr.city_district || null,
        road: addr.road || null,
        postcode: addr.postcode || null,
        displayName: data.display_name || null,
        // OSM class/type (e.g. class='building', type='residential' or class='amenity', type='hospital')
        osmClass: data.class || null,
        osmType: data.type || null,
        // Named place (e.g. a specific building or business Nominatim resolved to)
        placeName: data.name || null,
        // City district / quarter for more precise area context
        cityDistrict: addr.city_district || addr.quarter || null,
      };
      cache.set(key, result);
      setGeo(result);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setGeo(null);
    lastKeyRef.current = null;
  }, []);

  return { geo, loading, geocode, clear };
}
