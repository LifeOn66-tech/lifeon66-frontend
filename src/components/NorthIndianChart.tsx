import type { ChartPlanet } from '../utils/vedicChart';
import { getHouseSigns, getSignNumber } from '../utils/vedicChart';

/** Classic North Indian chart — fixed houses, counter-clockwise from top (H1). */
const HOUSE_LAYOUT: Record<number, { x: number; y: number; signY: number }> = {
  1: { x: 200, y: 72, signY: 48 },
  2: { x: 292, y: 58, signY: 44 },
  3: { x: 342, y: 108, signY: 94 },
  4: { x: 342, y: 200, signY: 186 },
  5: { x: 342, y: 292, signY: 278 },
  6: { x: 292, y: 342, signY: 328 },
  7: { x: 200, y: 328, signY: 352 },
  8: { x: 108, y: 342, signY: 328 },
  9: { x: 58, y: 292, signY: 278 },
  10: { x: 58, y: 200, signY: 186 },
  11: { x: 58, y: 108, signY: 94 },
  12: { x: 108, y: 58, signY: 44 },
};

const PLANET_HINDI: Record<string, string> = {
  Sun: 'सू',
  Moon: 'चं',
  Mars: 'मं',
  Mercury: 'बु',
  Jupiter: 'गु',
  Venus: 'शु',
  Saturn: 'श',
  Rahu: 'रा',
  Ketu: 'के',
};

const CHART_SIZE = 400;
const PAD = 12;
const INNER = CHART_SIZE - PAD * 2;
const MID = CHART_SIZE / 2;

function formatPlanetLabel(planet: ChartPlanet) {
  const abbr = PLANET_HINDI[planet.name] || planet.name.slice(0, 2);
  return `${abbr}${Math.round(planet.degree)}`;
}

function buildHouseContent(planets: ChartPlanet[], ascendantSign: string) {
  const houseSigns = getHouseSigns(ascendantSign);
  const planetsByHouse = planets.reduce<Record<number, ChartPlanet[]>>((acc, planet) => {
    if (!acc[planet.house]) acc[planet.house] = [];
    acc[planet.house].push(planet);
    return acc;
  }, {});

  return { houseSigns, planetsByHouse };
}

function ChartGrid() {
  const x1 = PAD;
  const y1 = PAD;
  const x2 = PAD + INNER;
  const y2 = PAD + INNER;
  const stroke = 'rgba(232, 145, 45, 0.55)';

  return (
    <>
      <rect
        x={x1}
        y={y1}
        width={INNER}
        height={INNER}
        fill="rgba(6, 15, 30, 0.92)"
        stroke="#e8912d"
        strokeWidth="2"
      />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth="1" />
      <line x1={x2} y1={y1} x2={x1} y2={y2} stroke={stroke} strokeWidth="1" />
      <line x1={MID} y1={y1} x2={MID} y2={y2} stroke={stroke} strokeWidth="1" />
      <line x1={x1} y1={MID} x2={x2} y2={MID} stroke={stroke} strokeWidth="1" />
      <line x1={x1} y1={y1} x2={MID} y2={MID} stroke={stroke} strokeWidth="0.75" />
      <line x1={x2} y1={y1} x2={MID} y2={MID} stroke={stroke} strokeWidth="0.75" />
      <line x1={x1} y1={y2} x2={MID} y2={MID} stroke={stroke} strokeWidth="0.75" />
      <line x1={x2} y1={y2} x2={MID} y2={MID} stroke={stroke} strokeWidth="0.75" />
      <line x1={MID} y1={y1} x2={x2} y2={MID} stroke={stroke} strokeWidth="0.75" />
      <line x1={MID} y1={y1} x2={x1} y2={MID} stroke={stroke} strokeWidth="0.75" />
      <line x1={MID} y1={y2} x2={x2} y2={MID} stroke={stroke} strokeWidth="0.75" />
      <line x1={MID} y1={y2} x2={x1} y2={MID} stroke={stroke} strokeWidth="0.75" />
    </>
  );
}

function HouseLabels({
  houseSigns,
  planetsByHouse,
  ascendantSign,
}: {
  houseSigns: Record<number, string>;
  planetsByHouse: Record<number, ChartPlanet[]>;
  ascendantSign: string;
}) {
  return (
    <>
      {Object.entries(HOUSE_LAYOUT).map(([houseKey, pos]) => {
        const house = Number(houseKey);
        const sign = houseSigns[house];
        const signNum = getSignNumber(sign);
        const housePlanets = planetsByHouse[house] || [];
        const planetLines = housePlanets.map((p) => formatPlanetLabel(p));

        return (
          <g key={house}>
            <text
              x={pos.x}
              y={pos.signY}
              textAnchor="middle"
              fill="#e8912d"
              fontSize="13"
              fontWeight="700"
            >
              {signNum}
            </text>
            {house === 1 && (
              <text x={pos.x} y={pos.y - 6} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">
                ल
              </text>
            )}
            {planetLines.map((line, index) => (
              <text
                key={`${house}-${index}`}
                x={pos.x}
                y={pos.y + index * 14}
                textAnchor="middle"
                fill="#f5f5f5"
                fontSize="11"
                fontWeight="600"
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}
      <text x={MID} y={CHART_SIZE - 4} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">
        लग्न कुंडली · {ascendantSign}
      </text>
    </>
  );
}

interface NorthIndianChartProps {
  planets: ChartPlanet[];
  ascendantSign: string;
  className?: string;
}

export function NorthIndianChart({ planets, ascendantSign, className = '' }: NorthIndianChartProps) {
  const { houseSigns, planetsByHouse } = buildHouseContent(planets, ascendantSign);

  return (
    <svg
      viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
      className={`w-full max-w-sm mx-auto aspect-square ${className}`}
      role="img"
      aria-label="North Indian Vedic birth chart"
    >
      <rect width={CHART_SIZE} height={CHART_SIZE} fill="#060f1e" />
      <ChartGrid />
      <HouseLabels houseSigns={houseSigns} planetsByHouse={planetsByHouse} ascendantSign={ascendantSign} />
    </svg>
  );
}

function chartGridSvg() {
  const x1 = PAD;
  const y1 = PAD;
  const x2 = PAD + INNER;
  const y2 = PAD + INNER;
  const stroke = 'rgba(232, 145, 45, 0.55)';

  return `
    <rect x="${x1}" y="${y1}" width="${INNER}" height="${INNER}" fill="rgba(6, 15, 30, 0.92)" stroke="#e8912d" stroke-width="2"/>
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="1"/>
    <line x1="${x2}" y1="${y1}" x2="${x1}" y2="${y2}" stroke="${stroke}" stroke-width="1"/>
    <line x1="${MID}" y1="${y1}" x2="${MID}" y2="${y2}" stroke="${stroke}" stroke-width="1"/>
    <line x1="${x1}" y1="${MID}" x2="${x2}" y2="${MID}" stroke="${stroke}" stroke-width="1"/>
    <line x1="${x1}" y1="${y1}" x2="${MID}" y2="${MID}" stroke="${stroke}" stroke-width="0.75"/>
    <line x1="${x2}" y1="${y1}" x2="${MID}" y2="${MID}" stroke="${stroke}" stroke-width="0.75"/>
    <line x1="${x1}" y1="${y2}" x2="${MID}" y2="${MID}" stroke="${stroke}" stroke-width="0.75"/>
    <line x1="${x2}" y1="${y2}" x2="${MID}" y2="${MID}" stroke="${stroke}" stroke-width="0.75"/>
    <line x1="${MID}" y1="${y1}" x2="${x2}" y2="${MID}" stroke="${stroke}" stroke-width="0.75"/>
    <line x1="${MID}" y1="${y1}" x2="${x1}" y2="${MID}" stroke="${stroke}" stroke-width="0.75"/>
    <line x1="${MID}" y1="${y2}" x2="${x2}" y2="${MID}" stroke="${stroke}" stroke-width="0.75"/>
    <line x1="${MID}" y1="${y2}" x2="${x1}" y2="${MID}" stroke="${stroke}" stroke-width="0.75"/>
  `;
}

export function northIndianChartToDataUrl(planets: ChartPlanet[], ascendantSign: string) {
  const { houseSigns, planetsByHouse } = buildHouseContent(planets, ascendantSign);

  const houseTexts = Object.entries(HOUSE_LAYOUT)
    .map(([houseKey, pos]) => {
      const house = Number(houseKey);
      const sign = houseSigns[house];
      const signNum = getSignNumber(sign);
      const housePlanets = planetsByHouse[house] || [];
      const lagnaMark = house === 1 ? `<text x="${pos.x}" y="${pos.y - 6}" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">ल</text>` : '';
      const planetTexts = housePlanets
        .map(
          (p, index) =>
            `<text x="${pos.x}" y="${pos.y + index * 14}" text-anchor="middle" fill="#f5f5f5" font-size="11" font-weight="600">${formatPlanetLabel(p)}</text>`
        )
        .join('');
      return `
        <text x="${pos.x}" y="${pos.signY}" text-anchor="middle" fill="#e8912d" font-size="13" font-weight="700">${signNum}</text>
        ${lagnaMark}
        ${planetTexts}
      `;
    })
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CHART_SIZE} ${CHART_SIZE}">
    <rect width="${CHART_SIZE}" height="${CHART_SIZE}" fill="#060f1e"/>
    ${chartGridSvg()}
    ${houseTexts}
    <text x="${MID}" y="${CHART_SIZE - 4}" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="10">लग्न कुंडली · ${ascendantSign}</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
