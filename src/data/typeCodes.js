// Official Seattle Fire Department incident type codes and descriptions
// Source: https://web.seattle.gov/sfd/IncidentSearch/TypeCode.htm

export const SFD_TYPE_CODES = {
  AID:     { label: 'Aid Response',                        category: 'medical',  response: '1 Aid Unit' },
  AIDF:    { label: 'Aid Response (Freeway)',              category: 'medical',  response: '1 Aid Unit, 1 Engine' },
  AIDSRV:  { label: 'Aid Response — Service Call',        category: 'medical',  response: '1 Aid Unit' },
  AIDYEL:  { label: 'Aid Response',                        category: 'medical',  response: '1 Aid Unit' },
  AMA:     { label: 'Auto Medical Alarm',                  category: 'alarm',    response: '1 Aid Unit, 1 Engine' },
  AFA:     { label: 'Auto Fire Alarm',                     category: 'alarm',    response: '2 Engines, 1 Ladder, 1 Chief' },
  AFA4:    { label: 'Auto Fire Alarm — Major',             category: 'alarm',    response: '2 Engines, 1 Ladder, 1 Chief' },
  AFAF:    { label: 'Auto Fire Alarm — False',             category: 'alarm',    response: '1 Engine' },
  AFAH:    { label: 'Auto Fire Alarm — Hazmat',            category: 'hazmat',   response: '2 Engines, 1 Ladder, 1 Hazmat' },
  AFAR:    { label: 'Auto Fire Alarm — Residential',       category: 'alarm',    response: '1 Engine, 1 Ladder' },
  AFARF:   { label: 'Auto Fire Alarm — Residential False', category: 'alarm',    response: '1 Engine' },
  ALBELL:  { label: 'Alarm Bell Ringing',                  category: 'alarm',    response: '1 Engine' },
  CO:      { label: 'Activated CO Detector',               category: 'alarm',    response: '1 Engine, 1 Medic' },
  FALSE:   { label: 'False Alarm',                         category: 'alarm',    response: '1 Engine' },
  MED:     { label: 'Medic Response',                      category: 'medical',  response: '1 Medic Unit' },
  MED1:    { label: 'Single Medic Response',               category: 'medical',  response: '1 Medic Unit' },
  MED6:    { label: 'Medic Response — 6-Person Rule',      category: 'medical',  response: '1 Medic, 1 Engine' },
  MED7:    { label: 'Medic Response — 7-Person Rule',      category: 'medical',  response: '1 Medic, 1 Engine' },
  MED14:   { label: 'Medic Response — 14-Member Rule',     category: 'medical',  response: '1 Medic, 2 Engines' },
  MEDF:    { label: 'Medic Response (Freeway)',             category: 'medical',  response: '1 Medic, 1 Engine' },
  MVA:     { label: 'Motor Vehicle Accident',              category: 'rescue',   response: '1 Engine, 1 Aid Unit' },
  MVAF:    { label: 'Motor Vehicle Accident (Freeway)',    category: 'rescue',   response: '1 Engine, 1 Aid, 1 Medic' },
  FIB:     { label: 'Fire In Building',                    category: 'fire',     response: '4 Engines, 2 Ladders, 2 Chiefs' },
  FIBHB:   { label: 'Fire In Houseboat',                   category: 'fire',     response: '3 Engines, 1 Ladder, 1 Chief' },
  FIBRES:  { label: 'Fire In Single Family Residence',     category: 'fire',     response: '3 Engines, 1 Ladder, 1 Medic, 1 Chief' },
  CAR:     { label: 'Car Fire',                            category: 'fire',     response: '1 Engine' },
  CARX:    { label: 'Car Fire With Exposure',              category: 'fire',     response: '2 Engines, 1 Ladder' },
  BRSH:    { label: 'Brush Fire',                          category: 'fire',     response: '2 Engines' },
  BRSHX:   { label: 'Brush Fire With Exposure',            category: 'fire',     response: '3 Engines, 1 Ladder' },
  CHIM:    { label: 'Chimney Fire',                        category: 'fire',     response: '1 Engine, 1 Ladder' },
  DUMP:    { label: 'Dumpster Fire',                       category: 'fire',     response: '1 Engine' },
  DUMPX:   { label: 'Dumpster Fire With Exposure',         category: 'fire',     response: '2 Engines' },
  GARAG:   { label: 'Garage/Shed Fire (Detached)',         category: 'fire',     response: '2 Engines, 1 Ladder' },
  FOS:     { label: 'Food On Stove',                       category: 'fire',     response: '1 Engine' },
  FOSO:    { label: 'Food On Stove — Occupied',            category: 'fire',     response: '1 Engine, 1 Aid' },
  RUBISH:  { label: 'Rubbish Fire',                        category: 'fire',     response: '1 Engine' },
  BARK:    { label: 'Beauty Bark Fire',                    category: 'fire',     response: '1 Engine' },
  ILBURN:  { label: 'Illegal Burn',                        category: 'fire',     response: '1 Engine' },
  TANKER:  { label: 'Tanker Fire',                         category: 'fire',     response: '3 Engines, 1 Ladder, 1 Hazmat' },
  SHED:    { label: 'Shed Fire (Detached)',                 category: 'fire',     response: '1 Engine, 1 Ladder' },
  VAULT:   { label: 'Vault Fire',                          category: 'fire',     response: '1 Engine' },
  PIERF:   { label: 'Pier Fire',                           category: 'fire',     response: '2 Engines, 1 Marine' },
  MARIN:   { label: 'Boat Fire In Marina',                 category: 'fire',     response: '2 Engines, 1 Marine' },
  HAZ:     { label: 'Hazardous Material Spill/Leak',       category: 'hazmat',   response: '1 Engine, 1 Hazmat Team' },
  HAZ80:   { label: 'Hazardous Material — Unknown',        category: 'hazmat',   response: '1 Engine, 1 Hazmat' },
  HAZADV:  { label: 'Hazmat — Advised',                    category: 'hazmat',   response: '1 Engine' },
  HAZD:    { label: 'Hazmat — Decontamination',            category: 'hazmat',   response: '1 Engine, 1 Hazmat, 1 Medic' },
  HAZF:    { label: 'Hazmat With Fire',                    category: 'hazmat',   response: '2 Engines, 1 Ladder, 1 Hazmat, 1 Chief' },
  HAZMCI:  { label: 'Hazmat — Multi-Casualty',             category: 'hazmat',   response: '2 Engines, 1 Hazmat, 2 Medics' },
  HAZRAD:  { label: 'Hazmat — Radiation',                  category: 'hazmat',   response: '1 Engine, 1 Hazmat' },
  HAZWHT:  { label: 'Hazmat — Reduced Response',           category: 'hazmat',   response: '1 Engine' },
  FUELSP:  { label: 'Fuel Spill',                          category: 'hazmat',   response: '1 Engine, 1 Hazmat' },
  NGL:     { label: 'Natural Gas Leak',                    category: 'hazmat',   response: '1 Engine, 1 Ladder' },
  ELEC:    { label: 'Electrical Problem',                  category: 'hazmat',   response: '1 Engine' },
  SPILL:   { label: 'Spill/Leak — Non-Hazmat',             category: 'hazmat',   response: '1 Engine' },
  TRANSF:  { label: 'Transformer Fire/Problem',            category: 'hazmat',   response: '1 Engine' },
  WIRES:   { label: 'Wires Down',                          category: 'other',    response: '1 Engine' },
  ODOR:    { label: 'Odor Investigation',                  category: 'other',    response: '1 Engine' },
  FURN:    { label: 'Furnace Overheat',                    category: 'other',    response: '1 Engine' },
  RESCAR:  { label: 'Rescue — Vehicle Extrication',        category: 'rescue',   response: '1 Engine, 1 Ladder, 1 Medic' },
  RESCS:   { label: 'Rescue — Confined Space',             category: 'rescue',   response: '2 Engines, 1 Ladder, 1 Technical Rescue' },
  RESELV:  { label: 'Rescue — Elevator',                   category: 'rescue',   response: '1 Engine, 1 Ladder' },
  RESFW:   { label: 'Rescue — Fresh Water',                category: 'rescue',   response: '1 Engine, 1 Marine' },
  RESFWM:  { label: 'Rescue — Fresh Water Major',          category: 'rescue',   response: '2 Engines, 2 Marine' },
  RESHVY:  { label: 'Rescue — Heavy',                      category: 'rescue',   response: '2 Engines, 1 Ladder, 1 Technical Rescue' },
  RESICE:  { label: 'Rescue — Ice',                        category: 'rescue',   response: '1 Engine, 1 Marine' },
  RESLOC:  { label: 'Rescue — Lock-In/Out',                category: 'rescue',   response: '1 Engine' },
  RESMAJ:  { label: 'Rescue — Heavy Major',                category: 'rescue',   response: '3 Engines, 1 Ladder, 1 Technical Rescue, 1 Chief' },
  RESROP:  { label: 'Rescue — Rope',                       category: 'rescue',   response: '1 Engine, 1 Ladder, 1 Technical Rescue' },
  RESSW:   { label: 'Rescue — Salt Water',                 category: 'rescue',   response: '1 Engine, 1 Marine' },
  RESSWM:  { label: 'Rescue — Salt Water Major',           category: 'rescue',   response: '2 Engines, 2 Marine' },
  RESTR:   { label: 'Rescue — Trench',                     category: 'rescue',   response: '2 Engines, 1 Technical Rescue' },
  MCI:     { label: 'Multiple Casualty Incident',          category: 'medical',  response: '4 Engines, 2 Ladders, 4 Medics, 2 Chiefs' },
  AIRCR:   { label: 'Aircraft Crash',                      category: 'rescue',   response: '4 Engines, 2 Ladders, 2 Medics, 1 Chief' },
  EXPMAJ:  { label: 'Explosion — Major',                   category: 'fire',     response: '4 Engines, 2 Ladders, 2 Medics, 1 Chief' },
  EXPMIN:  { label: 'Explosion — Minor',                   category: 'fire',     response: '2 Engines, 1 Ladder' },
  AWWA:    { label: 'Assault With Weapons',                category: 'medical',  response: '1 Aid Unit' },
  AWW7:    { label: 'Assault With Weapons (7-Person)',     category: 'medical',  response: '1 Aid, 1 Engine' },
  AWW14:   { label: 'Assault With Weapons (14-Person)',    category: 'medical',  response: '1 Aid, 2 Engines' },
  ASPD:    { label: 'Assist Police Department',            category: 'other',    response: '1 Engine or Aid' },
  TRAINF:  { label: 'Train Derailment With Fire/Hazmat',   category: 'fire',     response: '4 Engines, 2 Ladders, 1 Hazmat, 1 Chief' },
  TUNF:    { label: 'Tunnel Fire',                         category: 'fire',     response: '4 Engines, 2 Ladders, 1 Chief' },
  TUNAID:  { label: 'Tunnel Aid',                          category: 'medical',  response: '1 Aid, 1 Engine' },
  TUNMED:  { label: 'Tunnel Medic',                        category: 'medical',  response: '1 Medic, 1 Engine' },
  TUNRES:  { label: 'Tunnel Rescue',                       category: 'rescue',   response: '2 Engines, 1 Technical Rescue' },
  WATMI:   { label: 'Water Job — Minor',                   category: 'other',    response: '1 Engine' },
  WATMJ:   { label: 'Water Job — Major',                   category: 'other',    response: '2 Engines' },
  INVEIS:  { label: 'Investigate — In Service',            category: 'other',    response: '1 Engine' },
  INVEOS:  { label: 'Investigate — Out of Service',        category: 'other',    response: '1 Engine' },
  '1RED':  { label: 'Red Response — 1 Unit',               category: 'fire',     response: '1 Unit' },
  '3RED':  { label: 'Red Response — 1 Engine, 1 Ladder, 1 Chief', category: 'fire', response: '1 Engine, 1 Ladder, 1 Chief' },
  '4RED':  { label: 'Red Response — 2 Engines, 1 Ladder, 1 Chief', category: 'fire', response: '2 Engines, 1 Ladder, 1 Chief' },
  COMED:   { label: 'Possible Patient',                    category: 'medical',  response: '1 Aid Unit' },
  HELPFF:  { label: 'Help The Firefighter — Mayday',       category: 'fire',     response: 'Full Alarm Response' },
};

// Build reverse lookup: description (lowercase) → code
const _descToCode = {};
for (const [code, info] of Object.entries(SFD_TYPE_CODES)) {
  _descToCode[info.label.toLowerCase()] = code;
}

/**
 * Look up type code info by the incident type string from Socrata.
 * Tries exact match first, then partial match.
 */
export function lookupTypeCode(typeString) {
  if (!typeString) return null;
  const lower = typeString.toLowerCase().trim();

  // Direct description match
  if (_descToCode[lower]) return { code: _descToCode[lower], ...SFD_TYPE_CODES[_descToCode[lower]] };

  // Partial: find best match
  for (const [code, info] of Object.entries(SFD_TYPE_CODES)) {
    if (lower === info.label.toLowerCase()) return { code, ...info };
  }
  for (const [code, info] of Object.entries(SFD_TYPE_CODES)) {
    if (lower.includes(info.label.toLowerCase()) || info.label.toLowerCase().includes(lower)) {
      return { code, ...info };
    }
  }

  return null;
}

// Apparatus type descriptions for unit badge tooltips
export const UNIT_TYPE_LABELS = {
  E:   'Engine',
  L:   'Ladder',
  M:   'Medic',
  A:   'Aid',
  B:   'Battalion Chief',
  R:   'Rescue',
  HM:  'Hazmat',
  FB:  'Fireboat',
  RB:  'Rescue Boat',
  MAR: 'Marine',
  HO:  'Health One',
  MCI: 'Mass Casualty',
  AIR: 'Air Unit',
};

export function getUnitTypeLabel(unitCode) {
  const prefix = unitCode.replace(/\d+$/, '').toUpperCase();
  return UNIT_TYPE_LABELS[prefix] || prefix;
}
