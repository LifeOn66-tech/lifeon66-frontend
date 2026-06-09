import type { ChartPlanet } from '../utils/vedicChart';
import { RASHI_ABBR, getHouseSigns } from '../utils/vedicChart';

const PLANET_ABBR: Record<string, string> = {
  Sun: 'Su',
  Moon: 'Mo',
  Mars: 'Ma',
  Mercury: 'Me',
  Jupiter: 'Ju',
  Venus: 'Ve',
  Saturn: 'Sa',
  Rahu: 'Ra',
  Ketu: 'Ke',
};

/** Fixed house cell centers for the classic North Indian (diamond) layout. */
const HOUSE_LAYOUT: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 55 },
  2: { x: 290, y: 95 },
  3: { x: 330, y: 170 },
  4: { x: 330, y: 250 },
  5: { x: 290, y: 325 },
  6: { x: 200, y: 365 },
  7: { x: 110, y: 325 },
  8: { x: 70, y: 250 },
  9: { x: 70, y: 170 },
  10: { x: 110, y: 95 },
  11: { x: 145, y: 200 },
  12: { x: 255, y: 200 },
};

interface NorthIndianChartProps {
  planets: ChartPlanet[];
  ascendantSign: string;
  className?: string;
}

export function NorthIndianChart({ planets, ascendantSign, className = '' }: NorthIndianChartProps) {
  const houseSigns = getHouseSigns(ascendantSign);
  const planetsByHouse = planets.reduce<Record<number, ChartPlanet[]>>((acc, planet) => {
    if (!acc[planet.house]) acc[planet.house] = [];
    acc[planet.house].push(planet);
    return acc;
  }, {});

  return (
    <svg
      viewBox="0 0 400 420"
      className={`w-full max-w-md mx-auto ${className}`}
      role="img"
      aria-label="North Indian Vedic birth chart"
    >
      <rect x="8" y="8" width="384" height="384" fill="rgba(6, 15, 30, 0.85)" stroke="#f0b800" strokeWidth="2" rx="4" />
      <line x1="8" y1="8" x2="392" y2="392" stroke="rgba(240, 184, 0, 0.35)" strokeWidth="1" />
      <line x1="392" y1="8" x2="8" y2="392" stroke="rgba(240, 184, 0, 0.35)" strokeWidth="1" />
      <line x1="200" y1="8" x2="200" y2="392" stroke="rgba(240, 184, 0, 0.35)" strokeWidth="1" />
      <line x1="8" y1="200" x2="392" y2="200" stroke="rgba(240, 184, 0, 0.35)" strokeWidth="1" />
      <line x1="8" y1="8" x2="392" y2="200" stroke="rgba(240, 184, 0, 0.2)" strokeWidth="1" />
      <line x1="392" y1="8" x2="8" y2="200" stroke="rgba(240, 184, 0, 0.2)" strokeWidth="1" />
      <line x1="8" y1="392" x2="392" y2="200" stroke="rgba(240, 184, 0, 0.2)" strokeWidth="1" />
      <line x1="392" y1="392" x2="8" y2="200" stroke="rgba(240, 184, 0, 0.2)" strokeWidth="1" />

      {Object.entries(HOUSE_LAYOUT).map(([houseKey, pos]) => {
        const house = Number(houseKey);
        const sign = houseSigns[house];
        const housePlanets = planetsByHouse[house] || [];
        return (
          <g key={house}>
            <text x={pos.x} y={pos.y - 14} textAnchor="middle" fill="#f0b800" fontSize="11" fontWeight="700">
              {RASHI_ABBR[sign] || sign.slice(0, 2)}
            </text>
            <text x={pos.x} y={pos.y} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9">
              H{house}
            </text>
            <text x={pos.x} y={pos.y + 14} textAnchor="middle" fill="#7dceff" fontSize="10" fontWeight="600">
              {housePlanets.map((p) => PLANET_ABBR[p.name] || p.name.slice(0, 2)).join(' ')}
            </text>
          </g>
        );
      })}

      <text x="200" y="408" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="11">
        North Indian Chart · Lagna: {ascendantSign}
      </text>
    </svg>
  );
}

export function northIndianChartToDataUrl(planets: ChartPlanet[], ascendantSign: string) {
  const houseSigns = getHouseSigns(ascendantSign);
  const planetsByHouse = planets.reduce<Record<number, ChartPlanet[]>>((acc, planet) => {
    if (!acc[planet.house]) acc[planet.house] = [];
    acc[planet.house].push(planet);
    return acc;
  }, {});

  const houseTexts = Object.entries(HOUSE_LAYOUT)
    .map(([houseKey, pos]) => {
      const house = Number(houseKey);
      const sign = houseSigns[house];
      const housePlanets = planetsByHouse[house] || [];
      const planetLine = housePlanets.map((p) => PLANET_ABBR[p.name] || p.name.slice(0, 2)).join(' ');
      return `
        <text x="${pos.x}" y="${pos.y - 14}" text-anchor="middle" fill="#f0b800" font-size="11" font-weight="700">${RASHI_ABBR[sign] || sign.slice(0, 2)}</text>
        <text x="${pos.x}" y="${pos.y}" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="9">H${house}</text>
        <text x="${pos.x}" y="${pos.y + 14}" text-anchor="middle" fill="#7dceff" font-size="10" font-weight="600">${planetLine}</text>
      `;
    })
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 420">
    <rect width="400" height="420" fill="#060f1e"/>
    <rect x="8" y="8" width="384" height="384" fill="rgba(6, 15, 30, 0.85)" stroke="#f0b800" stroke-width="2" rx="4"/>
    <line x1="8" y1="8" x2="392" y2="392" stroke="rgba(240, 184, 0, 0.35)" stroke-width="1"/>
    <line x1="392" y1="8" x2="8" y2="392" stroke="rgba(240, 184, 0, 0.35)" stroke-width="1"/>
    <line x1="200" y1="8" x2="200" y2="392" stroke="rgba(240, 184, 0, 0.35)" stroke-width="1"/>
    <line x1="8" y1="200" x2="392" y2="200" stroke="rgba(240, 184, 0, 0.35)" stroke-width="1"/>
    ${houseTexts}
    <text x="200" y="408" text-anchor="middle" fill="rgba(255,255,255,0.55)" font-size="11">North Indian Chart · Lagna: ${ascendantSign}</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
