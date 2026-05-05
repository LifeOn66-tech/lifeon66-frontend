import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Star, Sun, Sparkles, ChevronDown, ChevronUp, BookOpen, TrendingUp, Gem, Hash } from 'lucide-react';
import { format } from 'date-fns';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import {
  VEDIC_SIGN_PROFILES,
  PLANET_CAREER_INFLUENCES,
  HOUSE_INTERPRETATIONS,
  DASHA_CAREER_EFFECTS,
  YOGA_COMBINATIONS
} from '../data/astrologyData';

interface Planet {
  name: string;
  sign: string;
  house: number;
  degree: number;
  icon: string;
}

interface AstrologyReading {
  planets: Planet[];
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
  accentColor = 'yellow'
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
    pink: 'border-pink-400/40',
    teal: 'border-teal-400/40',
    orange: 'border-orange-400/40'
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

export default function AstrologyChart() {
  const navigate = useNavigate();
  const [birthData, setBirthData] = useState({ date: '', time: '', place: '' });
  const [reading, setReading] = useState<AstrologyReading | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(1);

  const generateChart = async () => {
    if (!birthData.date || !birthData.time || !birthData.place) {
      alert('Please fill in all birth details');
      return;
    }
    setIsGenerating(true);
    try {
      const birthDate = new Date(birthData.date);
      const [hours, minutes] = birthData.time.split(':');

      let lat = 0;
      let lon = 0;

      try {
        const geocodeResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(birthData.place)}&format=json&limit=1`,
          {
            signal: AbortSignal.timeout(8000),
            headers: { 'Accept': 'application/json', 'User-Agent': 'AstrologyApp/1.0' }
          }
        );
        if (geocodeResponse.ok) {
          const geocodeData = await geocodeResponse.json();
          if (geocodeData && geocodeData.length > 0) {
            lat = parseFloat(geocodeData[0].lat);
            lon = parseFloat(geocodeData[0].lon);
          } else {
            lat = 28.6139;
            lon = 77.2090;
          }
        } else {
          lat = 28.6139;
          lon = 77.2090;
        }
      } catch (geoError) {
        console.warn('Geocoding failed, using default location:', geoError);
        lat = 28.6139;
        lon = 77.2090;
      }
      const requestBody = {
        birthData: {
          day: birthDate.getDate(),
          month: birthDate.getMonth() + 1,
          year: birthDate.getFullYear(),
          hour: parseInt(hours),
          min: parseInt(minutes),
          lat,
          lon,
          tzone: new Date().getTimezoneOffset() / -60,
        }
      };
      const apiUrl = '/readings/astrology-generate';
      console.log('Calling astrology API:', apiUrl);
      console.log('Request body:', requestBody);

      const apiResponse = await apiClient.post(apiUrl, requestBody);
      const apiData = apiResponse.data;

      const planetIcons: Record<string, string> = {
        'Sun': '☉', 'Moon': '☽', 'Mercury': '☿', 'Venus': '♀',
        'Mars': '♂', 'Jupiter': '♃', 'Saturn': '♄', 'Rahu': '☊', 'Ketu': '☋'
      };
      const formattedPlanets = (apiData.planets || []).map((p: any) => ({
        name: p.name || p.planet,
        sign: p.sign || p.zodiac,
        house: p.house || 1,
        degree: p.degree || p.full_degree || 0,
        icon: planetIcons[p.name || p.planet] || '⭐'
      })).slice(0, 9);
      const result: AstrologyReading = {
        planets: formattedPlanets,
        careerHouse: apiData.careerHouse || '',
        planetaryPeriods: apiData.favorablePeriods || [],
        careerRecommendations: apiData.careerRecommendations || '',
        favorablePeriods: apiData.favorablePeriods || [],
        houses: apiData.houses,
        dashas: apiData.dashas,
        yogas: apiData.yogas
      };
      
      try {
        await apiClient.post('/readings/astrology', {
          birthChartData: { planets: result.planets },
          careerHouseAnalysis: result.careerHouse,
          planetaryPeriods: result.planetaryPeriods,
          careerRecommendations: result.careerRecommendations,
          favorablePeriods: result.favorablePeriods
        });
      } catch (saveError) {
        console.error('Error saving astrology reading:', saveError);
      }
      setReading(result);
      setStep(2);
    } catch (error) {
      console.error('Error generating chart:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to generate astrology reading: ${errorMessage}\n\nPlease check the console for more details.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const ChartWheel = ({ planets }: { planets: Planet[] }) => (
    <div className="relative w-72 h-72 mx-auto">
      <div className="absolute inset-0 rounded-full border-4 border-yellow-400/30 bg-gradient-to-br from-slate-800/80 to-slate-900/80">
        <div className="absolute inset-0 rounded-full border-2 border-yellow-400/10" style={{ margin: '20%' }} />
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute w-px bg-yellow-400/20 origin-bottom"
            style={{
              left: '50%',
              bottom: '50%',
              height: '50%',
              transform: `translateX(-50%) rotate(${i * 30}deg)`
            }}
          />
        ))}
        {planets.map((planet, index) => {
          const angle = (planet.house - 1) * 30 + (planet.degree % 30);
          const radius = 100;
          const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
          const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
          return (
            <motion.div
              key={planet.name}
              className="absolute w-8 h-8 bg-slate-800 rounded-full border border-yellow-400/60 flex items-center justify-center text-sm shadow-lg cursor-pointer"
              style={{ left: `calc(50% + ${x}px - 16px)`, top: `calc(50% + ${y}px - 16px)` }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.15, type: 'spring' }}
              title={`${planet.name} in ${planet.sign} — House ${planet.house}`}
            >
              <span className="text-yellow-300">{planet.icon}</span>
            </motion.div>
          );
        })}
        <div className="absolute inset-1/2 w-14 h-14 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
          <Sun className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );

  const sunSign = reading?.planets?.find(p => p.name === 'Sun')?.sign;
  const moonSign = reading?.planets?.find(p => p.name === 'Moon')?.sign;
  const ascendantSign = reading?.houses?.house_1;
  const tenthHouseSign = reading?.houses?.house_10;

  const signProfile = sunSign ? VEDIC_SIGN_PROFILES[sunSign] : null;
  const tenthHouseProfile = tenthHouseSign ? VEDIC_SIGN_PROFILES[tenthHouseSign] : null;

  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="astrology-card"
        >
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
              <input
                type="date"
                value={birthData.date}
                onChange={(e) => setBirthData({ ...birthData, date: e.target.value })}
                className="w-full astrology-input"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: '#f0b800' }} /> Time of Birth
              </label>
              <input
                type="time"
                value={birthData.time}
                onChange={(e) => setBirthData({ ...birthData, time: e.target.value })}
                className="w-full astrology-input"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: '#f0b800' }} /> Place of Birth
              </label>
              <input
                type="text"
                value={birthData.place}
                onChange={(e) => setBirthData({ ...birthData, place: e.target.value })}
                placeholder="City, Country"
                className="w-full astrology-input"
              />
            </div>
            <div className="rounded-lg p-4 text-sm" style={{ background: 'rgba(240, 184, 0, 0.08)', border: '1px solid rgba(240, 184, 0, 0.2)', color: '#fddd76' }}>
              <p className="font-semibold mb-1">For maximum accuracy:</p>
              <ul className="space-y-1" style={{ color: 'rgba(253, 221, 118, 0.75)' }}>
                <li>• Exact birth time is critical for house calculations</li>
                <li>• Birth place determines Ascendant (Lagna) sign</li>
                <li>• Calculations use Lahiri Ayanamsa (Indian standard)</li>
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="astrology-card-gold"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-1">Your Vedic Birth Chart</h2>
          <p className="text-blue-200">
            {format(new Date(birthData.date), 'MMMM d, yyyy')} · {birthData.time} · {birthData.place}
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
              <ChartWheel planets={reading.planets} />
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
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-5 border border-yellow-400/30">
                <h3 className="text-lg font-bold text-yellow-300 mb-2 flex items-center gap-2">
                  <Star className="w-5 h-5" /> 10th House Career Analysis
                </h3>
                <p className="text-white/90 leading-relaxed">{reading.careerHouse}</p>
              </div>

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
            </div>
          </div>
        )}
      </motion.div>

      {signProfile && sunSign && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-yellow-400" />
            Deep Career Analysis — Sun in {sunSign}
          </h2>

          <SectionCard title="Primary Career Paths" icon={<TrendingUp className="w-5 h-5 text-yellow-400" />} defaultOpen accentColor="yellow">
            <div className="grid sm:grid-cols-2 gap-2">
              {signProfile.primaryCareers.map((career, i) => (
                <div key={i} className="flex items-center gap-2 bg-yellow-400/10 rounded-lg px-3 py-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0" />
                  <span className="text-white/90 text-sm">{career}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Natural Talents & Strengths" icon={<Star className="w-5 h-5 text-blue-400" />} accentColor="blue">
            <div className="space-y-3">
              {signProfile.naturalTalents.map((talent, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0 text-xs text-blue-300 font-bold">{i + 1}</div>
                  <span className="text-white/90">{talent}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Work Style & Leadership" icon={<Sun className="w-5 h-5 text-orange-400" />} accentColor="orange">
            <div className="space-y-4">
              <div>
                <h4 className="text-orange-300 font-semibold mb-2">Work Style</h4>
                <p className="text-white/80 leading-relaxed">{signProfile.workStyle}</p>
              </div>
              <div>
                <h4 className="text-orange-300 font-semibold mb-2">Leadership Style</h4>
                <p className="text-white/80 leading-relaxed">{signProfile.leadershipStyle}</p>
              </div>
              <div>
                <h4 className="text-orange-300 font-semibold mb-2">Financial Tendency</h4>
                <p className="text-white/80 leading-relaxed">{signProfile.financialTendency}</p>
              </div>
              <div>
                <h4 className="text-orange-300 font-semibold mb-2">Ideal Work Environment</h4>
                <p className="text-white/80 leading-relaxed">{signProfile.idealEnvironment}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Career Challenges to Overcome" icon={<ChevronDown className="w-5 h-5 text-pink-400" />} accentColor="pink">
            <div className="space-y-2">
              {signProfile.careerChallenges.map((challenge, i) => (
                <div key={i} className="flex items-start gap-3 bg-pink-400/10 rounded-lg px-4 py-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-white/80 text-sm">{challenge}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Vedic Remedies & Career Timing" icon={<Gem className="w-5 h-5 text-teal-400" />} accentColor="teal">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-teal-300 font-semibold mb-2">Power Gemstone</h4>
                <p className="text-white/80">{signProfile.gemstone}</p>
              </div>
              <div>
                <h4 className="text-teal-300 font-semibold mb-2">Lucky Numbers</h4>
                <div className="flex gap-2">
                  {signProfile.luckyNumbers.map(n => (
                    <span key={n} className="w-8 h-8 bg-teal-400/20 rounded-full flex items-center justify-center text-teal-300 font-bold text-sm">{n}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-teal-300 font-semibold mb-2">Best Business Partners</h4>
                <div className="flex flex-wrap gap-2">
                  {signProfile.bestBusinessPartners.map(sign => (
                    <span key={sign} className="bg-teal-400/10 text-teal-200 px-3 py-1 rounded-full text-sm">{sign}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-teal-300 font-semibold mb-2">Career Peak Years</h4>
                <p className="text-white/80 text-sm">{signProfile.careerPeakYears}</p>
              </div>
            </div>
          </SectionCard>
        </motion.div>
      )}

      {tenthHouseProfile && tenthHouseSign && tenthHouseSign !== sunSign && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <SectionCard
            title={`10th House in ${tenthHouseSign} — Your Professional Destiny`}
            icon={<Hash className="w-5 h-5 text-yellow-400" />}
            accentColor="yellow"
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-yellow-300 font-semibold mb-2">Destined Career Fields</h4>
                <div className="grid sm:grid-cols-2 gap-2">
                  {tenthHouseProfile.primaryCareers.map((career, i) => (
                    <div key={i} className="flex items-center gap-2 bg-yellow-400/10 rounded-lg px-3 py-2">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                      <span className="text-white/90 text-sm">{career}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-yellow-300 font-semibold mb-2">Professional Authority Style</h4>
                <p className="text-white/80 leading-relaxed">{tenthHouseProfile.leadershipStyle}</p>
              </div>
            </div>
          </SectionCard>
        </motion.div>
      )}

      {reading?.planets && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Star className="w-6 h-6 text-blue-400" />
            Planet-by-Planet Career Influences
          </h2>
          <div className="space-y-3">
            {reading.planets.filter(p => PLANET_CAREER_INFLUENCES[p.name]).map((planet) => {
              const influence = PLANET_CAREER_INFLUENCES[planet.name];
              const houseInterp = HOUSE_INTERPRETATIONS[planet.house];
              return (
                <SectionCard
                  key={planet.name}
                  title={`${planet.icon} ${planet.name} in ${planet.sign} — House ${planet.house}`}
                  icon={<div />}
                  accentColor="blue"
                >
                  <div className="space-y-3">
                    <div className="bg-blue-400/10 rounded-lg p-3">
                      <p className="text-blue-300 font-semibold text-sm mb-1">Career Domain</p>
                      <p className="text-white/80 text-sm">{influence.career}</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <p className="text-green-300 font-semibold text-sm mb-2">Strengths Given</p>
                        <ul className="space-y-1">
                          {influence.strengths.map((s, i) => (
                            <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />{s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-orange-300 font-semibold text-sm mb-2">Challenges</p>
                        <ul className="space-y-1">
                          {influence.challenges.map((c, i) => (
                            <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 flex-shrink-0" />{c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {houseInterp && (
                      <div className="rounded-lg p-3 border border-celestial-800/40" style={{ background: 'rgba(6, 15, 30, 0.5)' }}>
                        <p className="text-celestial-400/60 text-xs font-semibold uppercase tracking-wider mb-1">{houseInterp.title}</p>
                        <p className="text-white/70 text-sm">{houseInterp.career}</p>
                      </div>
                    )}
                  </div>
                </SectionCard>
              );
            })}
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-green-400" />
          Mahadasha Career Guide
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(DASHA_CAREER_EFFECTS).map(([planet, data]) => (
            <div key={planet} className="astrology-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold">{planet} Mahadasha</h3>
                <span className="text-white/40 text-sm">{data.duration} years</span>
              </div>
              <p className="text-white/70 text-sm mb-3 leading-relaxed">{data.careerEffect}</p>
              <div className="space-y-2">
                <p className="text-green-300 text-xs font-semibold uppercase tracking-wider">Key Opportunities</p>
                <ul className="space-y-1">
                  {data.opportunities.slice(0, 2).map((opp, i) => (
                    <li key={i} className="text-white/60 text-xs flex items-start gap-2">
                      <div className="w-1 h-1 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />{opp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <Hash className="w-6 h-6 text-teal-400" />
          Sacred Yoga Combinations
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {YOGA_COMBINATIONS.map((yoga) => (
            <div key={yoga.name} className="rounded-xl p-5 border border-face-800/30" style={{ background: 'rgba(4, 47, 46, 0.25)' }}>
              <div className="mb-3">
                <h3 className="text-white font-bold">{yoga.name}</h3>
                <p className="text-teal-300/70 text-sm">{yoga.sanskrit}</p>
              </div>
              <p className="text-white/70 text-sm mb-3 leading-relaxed">{yoga.effect}</p>
              <div className="bg-teal-400/10 rounded-lg px-3 py-2">
                <p className="text-teal-200 text-xs"><span className="font-semibold">Career path: </span>{yoga.career}</p>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {yoga.planets.map(p => (
                  <span key={p} className="text-celestial-300/60 text-xs px-2 py-0.5 rounded-full border border-celestial-700/30" style={{ background: 'rgba(6, 15, 30, 0.6)' }}>{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex gap-4 justify-center pb-6">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-teal-700 transition-colors"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => setStep(1)}
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
