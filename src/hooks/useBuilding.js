import { useState, useCallback, useRef } from 'react';

// Overpass API — free, no key required
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

const cache = new Map();

// Human-readable labels for OSM amenity/shop/office/building tags
const AMENITY_LABELS = {
  hospital: 'Hospital',
  clinic: 'Medical Clinic',
  doctors: "Doctor's Office",
  pharmacy: 'Pharmacy',
  dentist: 'Dental Office',
  nursing_home: 'Nursing Home',
  social_facility: 'Social Services Facility',
  school: 'School',
  university: 'University',
  college: 'College',
  kindergarten: 'Kindergarten',
  childcare: 'Childcare Facility',
  library: 'Public Library',
  fire_station: 'Fire Station',
  police: 'Police Station',
  post_office: 'Post Office',
  courthouse: 'Courthouse',
  embassy: 'Embassy',
  townhall: 'City/Town Hall',
  community_centre: 'Community Center',
  place_of_worship: 'Place of Worship',
  restaurant: 'Restaurant',
  fast_food: 'Fast Food',
  cafe: 'Café',
  bar: 'Bar',
  pub: 'Pub',
  nightclub: 'Nightclub',
  food_court: 'Food Court',
  fuel: 'Gas Station',
  car_wash: 'Car Wash',
  parking: 'Parking Facility',
  bank: 'Bank',
  atm: 'ATM',
  theatre: 'Theatre',
  cinema: 'Cinema',
  arts_centre: 'Arts Center',
  museum: 'Museum',
  studio: 'Studio',
  events_venue: 'Events Venue',
  conference_centre: 'Conference Center',
  marketplace: 'Marketplace',
  ferry_terminal: 'Ferry Terminal',
  bus_station: 'Bus Station',
  taxi: 'Taxi Stand',
  car_rental: 'Car Rental',
  shelter: 'Emergency Shelter',
  prison: 'Correctional Facility',
};

const SHOP_LABELS = {
  supermarket: 'Supermarket',
  convenience: 'Convenience Store',
  mall: 'Shopping Mall',
  department_store: 'Department Store',
  hardware: 'Hardware Store',
  car_parts: 'Auto Parts Store',
  car_repair: 'Auto Repair Shop',
  electronics: 'Electronics Store',
  furniture: 'Furniture Store',
  clothes: 'Clothing Store',
  hairdresser: 'Hair Salon',
  laundry: 'Laundry',
  dry_cleaning: 'Dry Cleaning',
  florist: 'Florist',
  bakery: 'Bakery',
  butcher: 'Butcher',
  alcohol: 'Liquor Store',
};

const OFFICE_LABELS = {
  company: 'Office Building',
  government: 'Government Office',
  financial: 'Financial Office',
  insurance: 'Insurance Office',
  lawyer: "Law Office",
  real_estate: 'Real Estate Office',
  it: 'Tech Office',
  ngo: 'Non-Profit Office',
  association: 'Association Office',
  newspaper: 'News Office',
  telecommunication: 'Telecom Office',
};

const BUILDING_TYPE_LABELS = {
  residential: 'Residential Building',
  apartments: 'Apartment Building',
  house: 'Single-Family House',
  detached: 'Single-Family House',
  semidetached_house: 'Semi-Detached House',
  terrace: 'Townhouse',
  dormitory: 'Dormitory',
  commercial: 'Commercial Building',
  office: 'Office Building',
  industrial: 'Industrial Building',
  warehouse: 'Warehouse',
  retail: 'Retail Building',
  supermarket: 'Supermarket',
  hotel: 'Hotel',
  hospital: 'Hospital',
  school: 'School',
  university: 'University',
  church: 'Church',
  cathedral: 'Cathedral',
  mosque: 'Mosque',
  synagogue: 'Synagogue',
  temple: 'Temple',
  civic: 'Civic Building',
  government: 'Government Building',
  public: 'Public Building',
  fire_station: 'Fire Station',
  transportation: 'Transportation Hub',
  train_station: 'Train Station',
  garage: 'Parking Garage',
  carport: 'Carport',
  shed: 'Shed',
  barn: 'Barn',
  greenhouse: 'Greenhouse',
  houseboat: 'Houseboat',
  static_caravan: 'Mobile Home',
  yes: null, // generic, don't show
};

function classifyElement(tags) {
  if (!tags) return null;
  if (tags.amenity && AMENITY_LABELS[tags.amenity]) {
    return { category: 'amenity', key: tags.amenity, label: AMENITY_LABELS[tags.amenity] };
  }
  if (tags.shop && SHOP_LABELS[tags.shop]) {
    return { category: 'shop', key: tags.shop, label: SHOP_LABELS[tags.shop] };
  }
  if (tags.office && OFFICE_LABELS[tags.office]) {
    return { category: 'office', key: tags.office, label: OFFICE_LABELS[tags.office] };
  }
  if (tags.amenity) {
    return { category: 'amenity', key: tags.amenity, label: tags.amenity.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) };
  }
  if (tags.shop) {
    return { category: 'shop', key: tags.shop, label: (SHOP_LABELS[tags.shop] || tags.shop.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())) };
  }
  if (tags.office) {
    return { category: 'office', key: tags.office, label: (OFFICE_LABELS[tags.office] || 'Office') };
  }
  if (tags.building && tags.building !== 'yes') {
    const label = BUILDING_TYPE_LABELS[tags.building];
    if (label) return { category: 'building', key: tags.building, label };
  }
  return null;
}

function parseBuilding(elements) {
  if (!elements || elements.length === 0) return null;

  let name = null;
  let classification = null;
  let levels = null;
  let height = null;
  let startDate = null;
  let operator = null;
  let wheelchair = null;
  let phone = null;
  let website = null;
  let openingHours = null;

  // Priority: amenity/shop/office nodes > building ways
  const nodes = elements.filter(e => e.type === 'node');
  const ways = elements.filter(e => e.type === 'way' || e.type === 'relation');

  // Process building ways first for physical attributes
  for (const el of ways) {
    const t = el.tags || {};
    if (!levels && t['building:levels']) levels = parseInt(t['building:levels'], 10);
    if (!height && t.height) height = parseFloat(t.height);
    if (!startDate && t.start_date) startDate = t.start_date;
    if (!operator && t.operator) operator = t.operator;
    if (!wheelchair && t.wheelchair) wheelchair = t.wheelchair;
    if (!phone && t.phone) phone = t.phone;
    if (!website && t.website) website = t.website;
    if (!openingHours && t.opening_hours) openingHours = t.opening_hours;
    if (!name && t.name) name = t.name;
    if (!classification) classification = classifyElement(t);
  }

  // Process nodes — can override classification and name with more specific info
  for (const el of nodes) {
    const t = el.tags || {};
    if (!name && t.name) name = t.name;
    if (!phone && t.phone) phone = t.phone;
    if (!website && t.website) website = t.website;
    if (!openingHours && t.opening_hours) openingHours = t.opening_hours;
    // Nodes with specific amenity/shop/office override generic building type
    const cls = classifyElement(t);
    if (cls && cls.category !== 'building') classification = cls;
    else if (!classification) classification = cls;
  }

  if (!name && !classification && !levels) return null;

  return {
    name,
    classification,
    levels,
    height: height ? Math.round(height) : null,
    startDate,
    operator,
    wheelchair,
    phone,
    website,
    openingHours,
  };
}

export function useBuilding() {
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(false);
  const lastKeyRef = useRef(null);

  const lookup = useCallback(async (lat, lon) => {
    const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
    if (key === lastKeyRef.current) return;
    lastKeyRef.current = key;

    if (cache.has(key)) {
      setBuilding(cache.get(key));
      return;
    }

    setLoading(true);
    setBuilding(null);

    try {
      const query = `[out:json][timeout:10];(way[building](around:60,${lat},${lon});relation[building](around:60,${lat},${lon});node[amenity](around:50,${lat},${lon});node[shop](around:50,${lat},${lon});node[office](around:50,${lat},${lon}););out tags center 8;`;
      const res = await fetch(OVERPASS_URL, {
        method: 'POST',
        body: query,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      if (!res.ok) return;
      const data = await res.json();
      const result = parseBuilding(data.elements);
      cache.set(key, result);
      setBuilding(result);
    } catch {
      // silently fail — non-critical data
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setBuilding(null);
    lastKeyRef.current = null;
  }, []);

  return { building, loading, lookup, clear };
}
