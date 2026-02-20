const ICAO_TO_IATA = {
  // Common examples (expand as needed)
  AAL: 'AA', // American Airlines
  DAL: 'DL', // Delta
  UAL: 'UA', // United
  SWA: 'WN', // Southwest
  BAW: 'BA', // British Airways
  AFR: 'AF', // Air France
  KLM: 'KL', // KLM
  DLH: 'LH', // Lufthansa
  UAE: 'EK', // Emirates
  QTR: 'QR', // Qatar
  THY: 'TK', // Turkish
  SIA: 'SQ', // Singapore
  ANA: 'NH', // ANA
  JAL: 'JL', // JAL
  EIN: 'EI', // Aer Lingus
  RYR: 'FR', // Ryanair
  EZY: 'U2', // easyJet
  WZZ: 'W6', // Wizz Air
  IBE: 'IB', // Iberia
  TAP: 'TP', // TAP
  LOT: 'LO', // LOT
  SAS: 'SK', // SAS
  FIN: 'AY', // Finnair
  AIC: 'AI', // Air India
  IGO: '6E', // IndiGo
  JAI: '9W', // Jet Airways (legacy)
};

const ICAO_TO_NAME = {
  AAL: 'American Airlines',
  DAL: 'Delta Air Lines',
  UAL: 'United Airlines',
  SWA: 'Southwest Airlines',
  BAW: 'British Airways',
  AFR: 'Air France',
  KLM: 'KLM',
  DLH: 'Lufthansa',
  UAE: 'Emirates',
  QTR: 'Qatar Airways',
  THY: 'Turkish Airlines',
  SIA: 'Singapore Airlines',
  ANA: 'All Nippon Airways',
  JAL: 'Japan Airlines',
  EIN: 'Aer Lingus',
  RYR: 'Ryanair',
  EZY: 'easyJet',
  WZZ: 'Wizz Air',
  IBE: 'Iberia',
  TAP: 'TAP Air Portugal',
  LOT: 'LOT Polish Airlines',
  SAS: 'SAS Scandinavian Airlines',
  FIN: 'Finnair',
  AIC: 'Air India',
  IGO: 'IndiGo',
  JAI: 'Jet Airways',
};

const IATA_TO_NAME = {
  AA: 'American Airlines',
  DL: 'Delta Air Lines',
  UA: 'United Airlines',
  WN: 'Southwest Airlines',
  BA: 'British Airways',
  AF: 'Air France',
  KL: 'KLM',
  LH: 'Lufthansa',
  EK: 'Emirates',
  QR: 'Qatar Airways',
  TK: 'Turkish Airlines',
  SQ: 'Singapore Airlines',
  NH: 'All Nippon Airways',
  JL: 'Japan Airlines',
  EI: 'Aer Lingus',
  FR: 'Ryanair',
  U2: 'easyJet',
  W6: 'Wizz Air',
  IB: 'Iberia',
  TP: 'TAP Air Portugal',
  LO: 'LOT Polish Airlines',
  SK: 'SAS Scandinavian Airlines',
  AY: 'Finnair',
  AI: 'Air India',
  '6E': 'IndiGo',
  '9W': 'Jet Airways',
};

function normalizeCallsign(callsign) {
  if (!callsign) return '';
  return String(callsign).trim().replace(/\s+/g, '');
}

/**
 * Tries to infer airline code from an OpenSky callsign.
 * Typical patterns:
 * - ICAO airline prefix: "AAL1234" (3 letters)
 * - IATA airline prefix: "AA1234" (2 letters)
 */
export function inferAirlineCodesFromCallsign(callsign) {
  const cs = normalizeCallsign(callsign);
  if (!cs) return { callsign: cs, iata: null, icao: null };

  const lettersPrefix = cs.match(/^[A-Za-z]{2,3}/)?.[0]?.toUpperCase() ?? null;
  const digitsAfter = /[0-9]/.test(cs.slice(lettersPrefix?.length ?? 0));

  let icao = null;
  let iata = null;

  if (lettersPrefix && lettersPrefix.length === 3 && digitsAfter) {
    icao = lettersPrefix;
    iata = ICAO_TO_IATA[icao] ?? null;
  } else if (lettersPrefix && lettersPrefix.length === 2 && digitsAfter) {
    iata = lettersPrefix;
  } else if (lettersPrefix && lettersPrefix.length === 3) {
    icao = lettersPrefix;
    iata = ICAO_TO_IATA[icao] ?? null;
  } else if (lettersPrefix && lettersPrefix.length === 2) {
    iata = lettersPrefix;
  }

  return { callsign: cs, iata, icao };
}

/**
 * Uses a public CDN used by Google Flights.
 * If a logo is missing, the <img> will fail and we’ll fallback to text.
 */
export function getAirlineNameFromCallsign(callsign) {
  const { iata, icao } = inferAirlineCodesFromCallsign(callsign);
  if (iata && IATA_TO_NAME[iata]) return IATA_TO_NAME[iata];
  if (icao && ICAO_TO_NAME[icao]) return ICAO_TO_NAME[icao];
  return null;
}

export function getAirlineLogoUrl(iata) {
  if (!iata) return null;
  const code = String(iata).trim().toUpperCase();
  if (!code) return null;
  return `https://www.gstatic.com/flights/airline_logos/70px/${encodeURIComponent(code)}.png`;
}

