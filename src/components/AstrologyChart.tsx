import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Star, Sparkles, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { BirthDetails, formatGenderLabel, GENDER_OPTIONS } from '../types/astrology';
import apiClient from '../api/apiClient';
import { parseApiError } from '../utils/apiErrors';
import {
  computeVedicChart,
  geocodeBirthPlace,
  parseBirthDateParts,
  estimateTimezone,
  pickBackendDashas,
  pickBackendList,
  pickBackendNarrative,
} from '../utils/vedicChart';
import { NorthIndianChart, northIndianChartToDataUrl } from './NorthIndianChart';

interface Planet {
  name: string;
  sign: string;
  house: number;
  degree: number;
  icon: string;
}

interface AstrologyReading {
  planets: Planet[];
  chartImageDataUrl?: string;
  careerHouse: string;
  planetaryPeriods: string[];
  careerRecommendations: string;
  favorablePeriods: string[];
  houses?: Record<string, string>;
  dashas?: Array<{ planet: string; period: string; effect: string }>;
  yogas?: string[];
}

const SectionCard = ({
  title,
  icon,
  children,
  defaultOpen = false,
  accentColor = 'yellow',
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accentColor?: string;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const borderColors: Record<string, string> = {
    yellow: 'border-yellow-400/40',
    blue: 'border-blue-400/40',
    green: 'border-green-400/40',
    orange: 'border-orange-400/40',
  };
  return (
    <div className={`rounded-xl border ${borderColors[accentColor] || borderColors.yellow} overflow-hidden`} style={{ background: 'rgba(6, 15, 30, 0.6)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left transition-colors"
        style={{ background: 'transparent' }}
        onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(56, 181, 248, 0.05)')}
        onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-white font-bold text-lg">{title}</span>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-white/10 pt-4">{children}</div>}
    </div>
  );
};

export function AstrologyChart() {
  const navigate = useNavigate();
  const [birthData, setBirthData] = useState<BirthDetails>({ date: '', time: '', place: '', gender: '' });
  const [reading, setReading] = useState<AstrologyReading | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(1);

  const generateChart = async () => {
    if (!birthData.date || !birthData.time || !birthData.place || !birthData.gender) {
      alert('Please fill in all birth details including gender');
      return;
    }
    setIsGenerating(true);
    try {
      const { year, month, day } = parseBirthDateParts(birthData.date);
      const [hours, minutes] = birthData.time.split(':').map((part) => parseInt(part, 10));
      const { lat, lon } = await geocodeBirthPlace(birthData.place);
      const tzone = estimateTimezone(lon, birthData.place);

      const computedChart = computeVedicChart({
        date: birthData.date,
        time: birthData.time,
        lat,
        lon,
        place: birthData.place,
      });

      const requestBody = {
        birthData: {
          day,
          month,
          year,
          hour: hours,
          min: minutes,
          lat,
          lon,
          tzone,
          gender: birthData.gender,
        },
      };

      let chartImageDataUrl: string | undefined;
      let apiData: Record<string, unknown> = {};
      try {
        const apiResponse = await apiClient.post('readings/astrology-generate', requestBody);
        apiData = (apiResponse.data?.data ?? apiResponse.data) as Record<string, unknown>;
        if (typeof apiData.chartImageDataUrl === 'string' && apiData.chartImageDataUrl) {
          chartImageDataUrl = apiData.chartImageDataUrl;
        }
      } catch (apiError) {
        console.warn('Backend astrology-generate unavailable, using computed chart only.', apiError);
      }

      const careerHouse = pickBackendNarrative(
        apiData.careerHouse || apiData.careerHouseAnalysis,
        computedChart.careerHouse
      );
      const careerRecommendations = pickBackendNarrative(
        apiData.careerRecommendations || apiData.integratedCareerGuidance,
        computedChart.careerRecommendations
      );
      const favorablePeriods = pickBackendList(apiData.favorablePeriods, computedChart.favorablePeriods);
      const dashas = pickBackendDashas(apiData.dashas, computedChart.dashas);
      const yogas = pickBackendList(apiData.yogas, computedChart.yogas);

      const localChartImage = northIndianChartToDataUrl(computedChart.planets, computedChart.risingSign);
      const finalChartImage = chartImageDataUrl || localChartImage;

      const result: AstrologyReading = {
        planets: computedChart.planets,
        chartImageDataUrl: finalChartImage,
        careerHouse,
        planetaryPeriods: favorablePeriods,
        careerRecommendations,
        favorablePeriods,
        houses: computedChart.houses,
        dashas,
        yogas,
      };

      await apiClient.post('readings/astrology', {
        gender: birthData.gender,
        birthDate: birthData.date,
        birthTime: birthData.time,
        birthPlace: birthData.place,
        sunSign: computedChart.sunSign,
        moonSign: computedChart.moonSign,
        risingSign: computedChart.risingSign,
        careerFocus: computedChart.tenthHouseSign,
        planets: computedChart.planets,
        houses: computedChart.houses,
        careerHouse,
        careerHouseAnalysis: careerHouse,
        careerRecommendations,
        favorablePeriods,
        dashas,
        yogas,
        chartImageDataUrl: finalChartImage,
        birthData: requestBody.birthData,
      });

      setReading(result);
      setStep(2);
    } catch (error) {
      console.error('Error generating chart:', error);
      const { title, message } = parseApiError(error);
      alert(`${title}: ${message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const sunSign = reading?.planets?.find((p) => p.name === 'Sun')?.sign;
  const moonSign = reading?.planets?.find((p) => p.name === 'Moon')?.sign;
  const ascendantSign = reading?.houses?.house_1;
  const tenthHouseSign = reading?.houses?.house_10;

  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="astrology-card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(240, 184, 0, 0.15)', border: '1px solid rgba(240, 184, 0, 0.3)' }}>
              <Star className="w-8 h-8" style={{ color: '#f0b800' }} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Vedic Birth Chart</h2>
            <p style={{ color: '#7dceff' }}>Precise planetary positions using Sidereal (Nirayana) calculations</p>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-white font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" style={{ color: '#f0b800' }} /> Date of Birth
              </label>
              <input type="date" value={birthData.date} onChange={(e) => setBirthData({ ...birthData, date: e.target.value })} className="w-full astrology-input" />
            </div>
            <div>
              <label className="block text-white font-medium mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: '#f0b800' }} /> Time of Birth
              </label>
              <input type="time" value={birthData.time} onChange={(e) => setBirthData({ ...birthData, time: e.target.value })} className="w-full astrology-input" />
            </div>
            <div>
              <label className="block text-white font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: '#f0b800' }} /> Place of Birth
              </label>
              <input type="text" value={birthData.place} onChange={(e) => setBirthData({ ...birthData, place: e.target.value })} placeholder="City, State, India" className="w-full astrology-input" />
            </div>
            <div>
              <label className="block text-white font-medium mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" style={{ color: '#f0b800' }} /> Gender
              </label>
              <div className="grid grid-cols-3 gap-2">
                {GENDER_OPTIONS.map((option) => {
                  const isSelected = birthData.gender === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setBirthData({ ...birthData, gender: option.value })}
                      className={`py-3 rounded-lg text-sm font-medium transition-all border ${
                        isSelected
                          ? 'border-celestial-400 text-white shadow-md'
                          : 'border-celestial-700/40 text-white/60 hover:border-celestial-500/50 hover:text-white/85'
                      }`}
                      style={{
                        background: isSelected ? 'rgba(14, 154, 232, 0.25)' : 'rgba(6, 15, 30, 0.6)',
                      }}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="rounded-lg p-4 text-sm" style={{ background: 'rgba(240, 184, 0, 0.08)', border: '1px solid rgba(240, 184, 0, 0.2)', color: '#fddd76' }}>
              <p className="font-semibold mb-1">For maximum accuracy:</p>
              <ul className="space-y-1" style={{ color: 'rgba(253, 221, 118, 0.75)' }}>
                <li>• Exact birth time is critical for house calculations</li>
                <li>• Birth place determines Ascendant (Lagna) sign</li>
                <li>• Calculations use Lahiri Ayanamsa (Indian standard)</li>
                <li>• Gender helps tailor career and life-path interpretations</li>
              </ul>
            </div>
            <motion.button
              onClick={generateChart}
              disabled={isGenerating}
              className="w-full py-4 astrology-button font-bold rounded-lg disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 animate-spin" />
                  Calculating Planetary Positions...
                </div>
              ) : 'Generate Vedic Birth Chart'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="astrology-card-gold">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-1">Your Vedic Birth Chart</h2>
          <p className="text-blue-200">
            {(() => {
              const { year, month, day } = parseBirthDateParts(birthData.date);
              return format(new Date(year, month - 1, day), 'MMMM d, yyyy');
            })()} · {birthData.time} · {birthData.place}
            {birthData.gender ? ` · ${formatGenderLabel(birthData.gender)}` : ''}
          </p>
          {sunSign && (
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <span className="bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">Sun: {sunSign}</span>
              {moonSign && <span className="bg-blue-400/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">Moon: {moonSign}</span>}
              {ascendantSign && <span className="bg-green-400/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium">Lagna: {ascendantSign}</span>}
              {tenthHouseSign && <span className="bg-orange-400/20 text-orange-300 px-3 py-1 rounded-full text-sm font-medium">10th House: {tenthHouseSign}</span>}
            </div>
          )}
        </div>

        {reading && (
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <NorthIndianChart
                planets={reading.planets}
                ascendantSign={ascendantSign || reading.houses?.house_1 || ''}
              />
              <div className="mt-6 grid grid-cols-3 gap-2">
                {reading.planets.map((planet) => (
                  <div key={planet.name} className="rounded-lg p-3 text-center border border-celestial-700/30" style={{ background: 'rgba(6, 15, 30, 0.7)' }}>
                    <div className="text-2xl mb-1">{planet.icon}</div>
                    <div className="text-white text-xs font-bold">{planet.name}</div>
                    <div className="text-blue-300 text-xs">{planet.sign}</div>
                    <div className="text-white/40 text-xs">H{planet.house}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {reading.careerHouse && (
                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-5 border border-yellow-400/30">
                  <h3 className="text-lg font-bold text-yellow-300 mb-2 flex items-center gap-2">
                    <Star className="w-5 h-5" /> 10th House Career Analysis
                  </h3>
                  <p className="text-white/90 leading-relaxed">{reading.careerHouse}</p>
                </div>
              )}

              {reading.careerRecommendations && (
                <SectionCard title="Career Recommendations" icon={<Sparkles className="w-5 h-5 text-green-400" />} defaultOpen accentColor="green">
                  <p className="text-white/80 leading-relaxed">{reading.careerRecommendations}</p>
                </SectionCard>
              )}

              {reading.dashas && reading.dashas.length > 0 && (
                <div className="rounded-xl p-5 border border-celestial-600/30" style={{ background: 'rgba(3, 97, 160, 0.15)' }}>
                  <h3 className="text-lg font-bold text-blue-300 mb-3">Active Dasha Periods</h3>
                  <div className="space-y-3">
                    {reading.dashas.map((dasha, i) => (
                      <div key={i} className="rounded-lg p-3" style={{ background: 'rgba(6, 15, 30, 0.5)' }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-semibold">{dasha.planet} Mahadasha</span>
                          <span className="text-blue-300 text-sm font-medium">{dasha.period}</span>
                        </div>
                        <p className="text-white/70 text-sm">{dasha.effect}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reading.yogas && reading.yogas.length > 0 && (
                <div className="rounded-xl p-5 border border-green-500/30" style={{ background: 'rgba(6, 40, 20, 0.4)' }}>
                  <h3 className="text-lg font-bold text-green-300 mb-3">Yoga Combinations in Your Chart</h3>
                  <div className="space-y-2">
                    {reading.yogas.map((yoga, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-white/80 text-sm">{yoga}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reading.favorablePeriods.length > 0 && (
                <div className="rounded-xl p-5 border border-starlight-700/40" style={{ background: 'rgba(30, 20, 4, 0.5)' }}>
                  <h3 className="text-lg font-bold text-orange-300 mb-3">Favorable Periods</h3>
                  <div className="space-y-2">
                    {reading.favorablePeriods.map((period, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-white/80 text-sm">{period}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      <div className="flex gap-4 justify-center pb-6">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-teal-700 transition-colors"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => {
            setStep(1);
            setReading(null);
          }}
          className="px-6 py-3 text-white rounded-lg transition-colors border border-celestial-700/30"
          style={{ background: 'rgba(6, 15, 30, 0.5)' }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(14, 154, 232, 0.15)')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(6, 15, 30, 0.5)')}
        >
          New Chart
        </button>
      </div>
    </div>
  );
}
