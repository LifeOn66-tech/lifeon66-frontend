import { getKundli, Observer } from '@ishubhamx/panchangam-js';

const VEDIC_PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'] as const;

const PLANET_ICONS: Record<string, string> = {
  Sun: '☉',
  Moon: '☽',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
  Rahu: '☊',
  Ketu: '☋',
};

const RASHI_NAMES = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

export const RASHI_ABBR: Record<string, string> = {
  Aries: 'Ar',
  Taurus: 'Ta',
  Gemini: 'Ge',
  Cancer: 'Cn',
  Leo: 'Le',
  Virgo: 'Vi',
  Libra: 'Li',
  Scorpio: 'Sc',
  Sagittarius: 'Sg',
  Capricorn: 'Cp',
  Aquarius: 'Aq',
  Pisces: 'Pi',
};

export function getSignNumber(signName: string): number {
  const index = RASHI_NAMES.indexOf(signName);
  return index >= 0 ? index + 1 : 0;
}

export function getHouseSigns(ascendantSign: string): Record<number, string> {
  const ascIndex = RASHI_NAMES.indexOf(ascendantSign);
  if (ascIndex < 0) return {};
  const houses: Record<number, string> = {};
  for (let house = 1; house <= 12; house += 1) {
    houses[house] = RASHI_NAMES[(ascIndex + house - 1) % 12];
  }
  return houses;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function geocodeWithOpenMeteo(place: string) {
  const query = place.split(',')[0].trim();
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`,
    { signal: AbortSignal.timeout(15000) }
  );
  if (!response.ok) return null;
  const data = await response.json();
  if (!data?.results?.[0]) return null;
  return {
    lat: data.results[0].latitude as number,
    lon: data.results[0].longitude as number,
  };
}

async function geocodeWithNominatim(place: string) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`,
    {
      signal: AbortSignal.timeout(15000),
      headers: { Accept: 'application/json', 'User-Agent': 'LifeOn66/1.0 (contact@lifeon66.com)' },
    }
  );
  if (!response.ok) return null;
  const data = await response.json();
  if (!data?.length) return null;
  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
  };
}

export async function geocodeBirthPlace(place: string) {
  const trimmed = place.trim();
  if (!trimmed) {
    throw new Error('Please enter your birth place.');
  }

  const providers = [
    () => geocodeWithOpenMeteo(trimmed),
    () => geocodeWithNominatim(`${trimmed}, India`),
    () => geocodeWithNominatim(trimmed),
  ];

  for (let attempt = 0; attempt < providers.length; attempt += 1) {
    try {
      const coords = await providers[attempt]();
      if (coords) return coords;
    } catch (error) {
      console.warn('Geocoding attempt failed:', error);
    }
    if (attempt < providers.length - 1) {
      await sleep(800);
    }
  }

  throw new Error('Could not locate birth place. Try "City, State, India" format.');
}

const TENTH_HOUSE_CAREERS: Record<string, string> = {
  Aries: 'Leadership, entrepreneurship, engineering, defense, and competitive fields',
  Taurus: 'Finance, banking, luxury brands, agriculture, and stable enterprise roles',
  Gemini: 'Media, communication, sales, teaching, writing, and multi-skilled careers',
  Cancer: 'Hospitality, healthcare, real estate, caregiving, and people-centered leadership',
  Leo: 'Executive roles, politics, creative direction, public leadership, and brand building',
  Virgo: 'Analytics, healthcare, operations, quality control, research, and service excellence',
  Libra: 'Law, diplomacy, design, partnerships, client relations, and balanced management',
  Scorpio: 'Strategy, investigation, surgery, finance, transformation consulting, and deep research',
  Sagittarius: 'Education, law, publishing, travel, coaching, philosophy, and advisory leadership',
  Capricorn: 'Government, administration, corporate leadership, infrastructure, and long-term planning',
  Aquarius: 'Technology, innovation, social enterprise, science, and future-focused systems work',
  Pisces: 'Healing arts, spirituality, film, charity, counseling, and imaginative creative careers',
};

/** Known static placeholder text returned by the current backend mock endpoint. */
const STATIC_BACKEND_TEXT = [
  'Strong 10th house indicating high professional status and leadership.',
  'Politics, Executive Management, or Entrepreneurship',
  'Gaja Kesari Yoga: Wealth and intelligence',
  '2026-2028: Major expansion',
  '2030-2035: Peak recognition',
  'Expansion and wealth',
];

export interface ChartPlanet {
  name: string;
  sign: string;
  house: number;
  degree: number;
  icon: string;
}

export interface ComputedVedicChart {
  planets: ChartPlanet[];
  houses: Record<string, string>;
  sunSign: string;
  moonSign: string;
  risingSign: string;
  tenthHouseSign: string;
  careerHouse: string;
  careerRecommendations: string;
  dashas: Array<{ planet: string; period: string; effect: string }>;
  favorablePeriods: string[];
  yogas: string[];
}

export function parseBirthDateParts(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) {
    throw new Error('Invalid birth date.');
  }
  return { year, month, day };
}

export function estimateTimezone(lon: number, place: string) {
  if (/india|bharat|rajasthan|bihar|delhi|mumbai|kolkata/i.test(place) || (lon >= 68 && lon <= 98)) {
    return 5.5;
  }
  return Math.max(-12, Math.min(14, Math.round((lon / 15) * 2) / 2));
}

export function buildUtcBirthDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  min: number,
  tzone: number
) {
  const tzHours = Math.trunc(tzone);
  const tzMinutes = Math.round((tzone - tzHours) * 60);
  let utcHour = hour - tzHours;
  let utcMin = min - tzMinutes;
  let utcDay = day;
  let utcMonth = month;
  let utcYear = year;

  if (utcMin < 0) {
    utcMin += 60;
    utcHour -= 1;
  }
  if (utcHour < 0) {
    utcHour += 24;
    utcDay -= 1;
    if (utcDay < 1) {
      utcMonth -= 1;
      if (utcMonth < 1) {
        utcMonth = 12;
        utcYear -= 1;
      }
      utcDay = new Date(utcYear, utcMonth, 0).getDate();
    }
  }

  return new Date(Date.UTC(utcYear, utcMonth - 1, utcDay, utcHour, utcMin));
}

function getWholeSignHouse(planetRashi: number, ascendantRashi: number) {
  return ((planetRashi - ascendantRashi + 12) % 12) + 1;
}

function getHouseSign(ascendantRashi: number, houseNumber: number) {
  return RASHI_NAMES[(ascendantRashi + houseNumber - 1) % 12];
}

function formatYear(date: Date) {
  return date.getUTCFullYear();
}

export function computeVedicChart(input: {
  date: string;
  time: string;
  lat: number;
  lon: number;
  place: string;
}): ComputedVedicChart {
  const { year, month, day } = parseBirthDateParts(input.date);
  const [hour, min] = input.time.split(':').map((part) => parseInt(part, 10));
  const tzone = estimateTimezone(input.lon, input.place);
  const birthUtc = buildUtcBirthDate(year, month, day, hour, min, tzone);
  const kundli = getKundli(birthUtc, new Observer(input.lat, input.lon, 0), {
    houseSystem: 'whole_sign',
    ayanamsa: 'lahiri',
    lang: 'en',
  });

  const ascRashi = kundli.ascendant.rashi;
  const risingSign = kundli.ascendant.rashiName;
  const tenthHouseSign = getHouseSign(ascRashi, 10);

  const planets: ChartPlanet[] = VEDIC_PLANETS.map((name) => {
    const position = kundli.planets[name];
    if (!position) {
      throw new Error(`Missing planetary position for ${name}.`);
    }
    return {
      name,
      sign: position.rashiName,
      house: getWholeSignHouse(position.rashi, ascRashi),
      degree: Math.round(position.degree * 100) / 100,
      icon: PLANET_ICONS[name] || '⭐',
    };
  });

  const sunSign = planets.find((planet) => planet.name === 'Sun')?.sign || '';
  const moonSign = planets.find((planet) => planet.name === 'Moon')?.sign || '';

  const houses: Record<string, string> = {};
  for (let house = 1; house <= 12; house += 1) {
    houses[`house_${house}`] = getHouseSign(ascRashi, house);
  }

  const currentDasha = kundli.dasha.fullCycle.find(
    (entry) => entry.startTime <= birthUtc && entry.endTime > birthUtc
  ) || kundli.dasha.fullCycle[0];

  const dashas = currentDasha
    ? [
        {
          planet: currentDasha.planet,
          period: `${formatYear(currentDasha.startTime)}-${formatYear(currentDasha.endTime)}`,
          effect: `Active ${currentDasha.planet} Mahadasha based on your birth nakshatra (${kundli.dasha.birthNakshatra}).`,
        },
      ]
    : [];

  const careerHouse = `Your 10th house of career is in ${tenthHouseSign}. With ${risingSign} rising and Sun in ${sunSign}, your professional path is shaped by discipline, visibility, and the qualities of ${tenthHouseSign}.`;

  const careerRecommendations =
    TENTH_HOUSE_CAREERS[tenthHouseSign] ||
    `Careers aligned with ${tenthHouseSign} themes and your unique planetary placements.`;

  const favorablePeriods = kundli.dasha.currentMahadasha
    ? [`${kundli.dasha.currentMahadasha.planet} Mahadasha active until ${kundli.dasha.currentMahadasha.endTime.getUTCFullYear()}`]
    : [];

  return {
    planets,
    houses,
    sunSign,
    moonSign,
    risingSign,
    tenthHouseSign,
    careerHouse,
    careerRecommendations,
    dashas,
    favorablePeriods,
    yogas: [],
  };
}

export function isStaticBackendText(value: unknown) {
  if (value == null) return false;
  const text = String(value).trim();
  return STATIC_BACKEND_TEXT.some((snippet) => text.includes(snippet));
}

export function pickBackendNarrative(field: unknown, fallback: string) {
  if (field == null || field === '') return fallback;
  if (isStaticBackendText(field)) return fallback;
  return String(field);
}

export function pickBackendList(field: unknown, fallback: string[]) {
  if (!Array.isArray(field) || field.length === 0) return fallback;
  if (field.some((item) => isStaticBackendText(item))) return fallback;
  return field.map(String);
}

export function pickBackendDashas(
  field: unknown,
  fallback: ComputedVedicChart['dashas']
) {
  if (!Array.isArray(field) || field.length === 0) return fallback;
  const serialized = JSON.stringify(field);
  if (isStaticBackendText(serialized)) return fallback;
  return field.map((item) => {
    const dasha = item as Record<string, unknown>;
    return {
      planet: String(dasha.planet || ''),
      period: String(dasha.period || ''),
      effect: String(dasha.effect || ''),
    };
  });
}
