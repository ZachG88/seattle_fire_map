// Seattle Fire Department station data
// Coordinates sourced from Seattle City GIS ArcGIS FeatureServer (WKID 4326)
// Apparatus assignments sourced from seattle.gov/fire and SFD documentation

export const STATIONS = [
  { id: 2,  number: 2,  address: '2320 4th Ave',                  lat: 47.616074, lon: -122.344493, apparatus: ['E2', 'L4', 'A2', 'A4', 'HO1'] },
  { id: 3,  number: 3,  address: '1735 W Thurman St',              lat: 47.658139, lon: -122.377915, apparatus: ['FB1', 'FB3', 'RB3'] },
  { id: 5,  number: 5,  address: '925 Alaskan Way',                lat: 47.603643, lon: -122.338829, apparatus: ['E5', 'FB2', 'FB5', 'RB5'] },
  { id: 6,  number: 6,  address: '405 MLK Jr Way S',               lat: 47.599053, lon: -122.297872, apparatus: ['E6', 'M6'] },
  { id: 8,  number: 8,  address: '110 Lee St',                     lat: 47.631175, lon: -122.354985, apparatus: ['E8'] },
  { id: 9,  number: 9,  address: '3829 Linden Ave N',              lat: 47.653625, lon: -122.348885, apparatus: ['E9'] },
  { id: 10, number: 10, address: '400 S Washington St',            lat: 47.601016, lon: -122.328731, apparatus: ['E10', 'L1', 'A5', 'A10', 'HM1'] },
  { id: 11, number: 11, address: '1514 SW Holden St',              lat: 47.533934, lon: -122.354695, apparatus: ['E11'] },
  { id: 13, number: 13, address: '3601 Beacon Ave S',              lat: 47.571742, lon: -122.308646, apparatus: ['E13', 'B5'] },
  { id: 14, number: 14, address: '3224 4th Ave S',                 lat: 47.574617, lon: -122.328559, apparatus: ['E14', 'R1', 'A14'] },
  { id: 16, number: 16, address: '6846 Oswego Pl NE',              lat: 47.679077, lon: -122.323249, apparatus: ['E16'] },
  { id: 17, number: 17, address: '1050 NE 50th St',                lat: 47.665167, lon: -122.316659, apparatus: ['E17', 'L9', 'M17', 'B6'] },
  { id: 18, number: 18, address: '1521 NW Market St',              lat: 47.668390, lon: -122.377331, apparatus: ['E18', 'L8', 'M18', 'B4'] },
  { id: 20, number: 20, address: '2800 15th Ave W',                lat: 47.644931, lon: -122.375789, apparatus: ['E20'] },
  { id: 21, number: 21, address: '7304 Greenwood Ave N',           lat: 47.682028, lon: -122.354944, apparatus: ['E21', 'MCI1'] },
  { id: 22, number: 22, address: '901 E Roanoke St',               lat: 47.642981, lon: -122.320850, apparatus: ['E22'] },
  { id: 24, number: 24, address: '401 N 130th St',                 lat: 47.723053, lon: -122.353826, apparatus: ['E24'] },
  { id: 25, number: 25, address: '1300 E Pine St',                 lat: 47.615568, lon: -122.315096, apparatus: ['E25', 'L10', 'A25', 'B2'] },
  { id: 26, number: 26, address: '800 S Cloverdale St',            lat: 47.526718, lon: -122.322376, apparatus: ['E26', 'M26', 'AIR1'] },
  { id: 27, number: 27, address: '1000 S Myrtle St',               lat: 47.539660, lon: -122.319907, apparatus: ['E27'] },
  { id: 28, number: 28, address: '5968 Rainier Ave S',             lat: 47.548476, lon: -122.276503, apparatus: ['E28', 'L12', 'M28'] },
  { id: 29, number: 29, address: '2139 Ferry Ave SW',              lat: 47.584393, lon: -122.388750, apparatus: ['E29'] },
  { id: 30, number: 30, address: '2931 S Mt Baker Blvd',           lat: 47.575640, lon: -122.294691, apparatus: ['E30', 'M30'] },
  { id: 31, number: 31, address: '10503 Interlake Ave N (interim)', lat: 47.705234, lon: -122.340887, apparatus: ['E31'] },
  { id: 32, number: 32, address: '4700 38th Ave SW',               lat: 47.560820, lon: -122.379644, apparatus: ['E32', 'L11', 'M32', 'B7'] },
  { id: 33, number: 33, address: '9645 Renton Ave S',              lat: 47.515927, lon: -122.268662, apparatus: ['E33'] },
  { id: 34, number: 34, address: '633 32nd Ave E',                 lat: 47.626000, lon: -122.291334, apparatus: ['E34'] },
  { id: 35, number: 35, address: '8729 15th Ave NW',               lat: 47.693288, lon: -122.377173, apparatus: ['E35'] },
  { id: 36, number: 36, address: '3600 23rd Ave SW',               lat: 47.571034, lon: -122.361734, apparatus: ['E36'] },
  { id: 37, number: 37, address: '7700 35th Ave SW',               lat: 47.533552, lon: -122.376324, apparatus: ['E37'] },
  { id: 38, number: 38, address: '4004 NE 55th St',                lat: 47.668750, lon: -122.284399, apparatus: ['E38'] },
  { id: 39, number: 39, address: '2806 NE 127th St',               lat: 47.721257, lon: -122.297347, apparatus: ['E39'] },
  { id: 40, number: 40, address: '9401 35th Ave NE',               lat: 47.696768, lon: -122.290937, apparatus: ['E40'] },
  { id: 41, number: 41, address: '2416 34th Ave W',                lat: 47.640152, lon: -122.400618, apparatus: ['E41'] },
];

// Build reverse lookup: unit prefix → station number
// e.g. "E17" → 17, "M17" → 17, "L9" → 17, "A25" → 25
const _unitToStation = {};
for (const station of STATIONS) {
  for (const unit of station.apparatus) {
    _unitToStation[unit.toUpperCase()] = station.number;
  }
}

// Numeric suffix fallback: E17 → check station 17, M18 → station 18
export function getStationForUnit(unitCode) {
  if (!unitCode) return null;
  const upper = unitCode.toUpperCase().trim();

  // Direct lookup first
  if (_unitToStation[upper]) return _unitToStation[upper];

  // Numeric suffix pattern: letters + number → check if station exists
  const match = upper.match(/^[A-Z]+(\d+)$/);
  if (match) {
    const num = parseInt(match[1], 10);
    const station = STATIONS.find(s => s.number === num);
    if (station) return num;
  }

  return null;
}

export function getStationById(number) {
  return STATIONS.find(s => s.number === number) || null;
}
