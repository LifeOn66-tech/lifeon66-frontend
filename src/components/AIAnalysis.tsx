import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, Target, Clock, CheckCircle, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
import apiClient from '../api/apiClient';
import { fetchInsight, linkReadingsInsight } from '../utils/readingsApi';
import { parseApiError } from '../utils/apiErrors';
import { formatGenderLabel } from '../types/astrology';

interface ReadingSummaries {
  astrology: string;
  palmistry: string;
  face: string;
}

interface SynthesizedInsight {
  topCareerPaths: string[];
  bestTiming: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  strengths: string[];
  challenges: string[];
  actionItems: string[];
  confidenceScore: number;
  synthesizedRecommendation: string;
}

type SavedReadings = {
  astrology: Record<string, unknown>;
  palmistry: Record<string, unknown>;
  face: Record<string, unknown>;
};

function getAstrologySummary(reading: Record<string, unknown>): string {
  const text =
    reading.careerHouseAnalysis ||
    reading.careerHouse ||
    reading.integratedCareerGuidance ||
    reading.careerRecommendations;
  if (text) return String(text);

  const birthDate = reading.birthDate || reading.dateOfBirth;
  const birthPlace = reading.birthPlace || reading.placeOfBirth;
  if (birthDate || birthPlace) {
    const gender = reading.gender ? formatGenderLabel(String(reading.gender)) : '';
    return `Chart saved${birthDate ? ` for ${birthDate}` : ''}${birthPlace ? ` · ${birthPlace}` : ''}${gender ? ` · ${gender}` : ''}.`;
  }
  return 'Birth chart saved.';
}

function getPalmistrySummary(reading: Record<string, unknown>): string {
  return String(
    reading.careerRecommendations ||
      reading.overallRecommendations ||
      reading.fateLineAnalysis ||
      reading.summary ||
      'Palm reading saved.'
  );
}

function getFaceSummary(reading: Record<string, unknown>): string {
  return String(
    reading.careerRecommendations ||
      reading.summary ||
      reading.leadershipStyle ||
      reading.workStyle ||
      'Face reading saved.'
  );
}

function extractPathwayActions(
  steps: Array<Record<string, unknown>> | undefined,
  limit = 3
): string[] {
  if (!Array.isArray(steps)) return [];
  return steps
    .flatMap((step) => {
      const actions = step.actions;
      if (Array.isArray(actions) && actions.length > 0) {
        return actions.map(String);
      }
      if (step.title) return [String(step.title)];
      if (step.description) return [String(step.description)];
      return [];
    })
    .slice(0, limit);
}

function mapInsightToSynthesized(insight: Record<string, unknown>): SynthesizedInsight {
  const topCareerPathsRaw = (insight.topCareerPaths || insight.topCareerMatches || []) as unknown[];
  const topCareerPaths = topCareerPathsRaw.map((item) => {
    if (typeof item === 'string') return item;
    const career = item as Record<string, unknown>;
    return String(career.title || career.name || 'Career Path');
  });

  const bestTimingRaw = insight.bestTiming as
    | { immediate?: string[]; shortTerm?: string[]; longTerm?: string[] }
    | undefined;

  const sixMonthPathway = insight.sixMonthPathway as Array<Record<string, unknown>> | undefined;
  const threeYearPathway = insight.threeYearPathway as Array<Record<string, unknown>> | undefined;

  const actionItemsRaw = insight.actionItems;
  const actionItems = Array.isArray(actionItemsRaw)
    ? actionItemsRaw.map(String)
    : [
        ...extractPathwayActions(sixMonthPathway, 3),
        ...extractPathwayActions(threeYearPathway, 2),
      ].slice(0, 5);

  return {
    topCareerPaths,
    bestTiming: {
      immediate: bestTimingRaw?.immediate || extractPathwayActions(sixMonthPathway, 3),
      shortTerm: bestTimingRaw?.shortTerm || extractPathwayActions(sixMonthPathway?.slice(1), 3),
      longTerm: bestTimingRaw?.longTerm || extractPathwayActions(threeYearPathway, 3),
    },
    strengths: (insight.strengths || insight.strengthsSummary || []) as string[],
    challenges: (insight.challenges || insight.developmentAreas || []) as string[],
    actionItems,
    confidenceScore: Number(insight.confidenceScore ?? 0),
    synthesizedRecommendation: String(
      insight.synthesizedRecommendation ||
        insight.summary ||
        (topCareerPaths.length > 0
          ? `Your readings point toward strong potential in ${topCareerPaths.slice(0, 3).join(', ')}.`
          : 'Your personalized career synthesis is ready.')
    ),
  };
}

export default function AIAnalysis() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insight, setInsight] = useState<SynthesizedInsight | null>(null);
  const [step, setStep] = useState(1);
  const [hasAstrology, setHasAstrology] = useState(false);
  const [hasPalm, setHasPalm] = useState(false);
  const [hasFace, setHasFace] = useState(false);
  const [summaries, setSummaries] = useState<ReadingSummaries | null>(null);
  const [savedReadings, setSavedReadings] = useState<SavedReadings | null>(null);

  const allComplete = hasAstrology && hasPalm && hasFace;

  useEffect(() => {
    loadReadings();
  }, []);

  const loadReadings = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('readings');
      if (!response.data.success) return;

      const { astrology, palmistry, face } = response.data.data;
      setHasAstrology(astrology.length > 0);
      setHasPalm(palmistry.length > 0);
      setHasFace(face.length > 0);

      if (astrology.length > 0 && palmistry.length > 0 && face.length > 0) {
        const readings: SavedReadings = {
          astrology: astrology[0],
          palmistry: palmistry[0],
          face: face[0],
        };
        setSavedReadings(readings);
        setSummaries({
          astrology: getAstrologySummary(readings.astrology),
          palmistry: getPalmistrySummary(readings.palmistry),
          face: getFaceSummary(readings.face),
        });

        const existingInsight = await fetchInsight();
        if (existingInsight) {
          setInsight(mapInsightToSynthesized(existingInsight as Record<string, unknown>));
          setStep(2);
        }
      }
    } catch (error) {
      console.error('Error loading readings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const synthesizeInsights = async () => {
    if (!savedReadings || !allComplete) return;

    setIsAnalyzing(true);
    try {
      const result = await linkReadingsInsight({
        astrology: savedReadings.astrology,
        palmistry: savedReadings.palmistry,
        face: savedReadings.face,
      });
      setInsight(mapInsightToSynthesized(result as Record<string, unknown>));
      setStep(2);
    } catch (error) {
      console.error('Error synthesizing insights:', error);
      const { title, message } = parseApiError(error);
      alert(`${title}: ${message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const ProgressStep = ({
    number,
    title,
    isActive,
    isComplete,
  }: {
    number: number;
    title: string;
    isActive: boolean;
    isComplete: boolean;
  }) => (
    <div className="flex items-center">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          isComplete
            ? 'bg-green-500 text-white'
            : isActive
              ? 'bg-purple-500 text-white'
              : 'bg-white/20 text-purple-200'
        }`}
      >
        {isComplete ? <CheckCircle className="w-4 h-4" /> : number}
      </div>
      <span className={`ml-2 text-sm ${isActive || isComplete ? 'text-white' : 'text-purple-300'}`}>
        {title}
      </span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-purple-400 animate-spin mb-4" />
        <p className="text-purple-200">Loading your readings...</p>
      </div>
    );
  }

  if (!allComplete) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center"
        >
          <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">AI Career Synthesis</h2>
          <p className="text-purple-200 mb-8">
            Complete all three readings before the AI can synthesize your personalized career insight.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8 text-left">
            {[
              { label: 'Vedic Birth Chart', done: hasAstrology, path: '/astrology' },
              { label: 'Palm Reading', done: hasPalm, path: '/palmistry' },
              { label: 'Face Reading', done: hasFace, path: '/face-reading' },
            ].map((item) => (
              <div
                key={item.path}
                className={`rounded-lg p-4 border ${item.done ? 'border-green-400/40 bg-green-500/10' : 'border-white/10 bg-white/5'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-sm">{item.label}</span>
                  {item.done ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                {!item.done && (
                  <button
                    onClick={() => navigate(item.path)}
                    className="text-purple-300 text-xs hover:text-white flex items-center gap-1"
                  >
                    Complete now <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={loadReadings}
            className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Refresh Status
          </button>
        </motion.div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          <div className="text-center mb-8">
            <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">AI Career Synthesis</h2>
            <p className="text-purple-200">Combining insights from your saved astrology, palmistry, and face readings</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <ProgressStep number={1} title="Astrology" isActive={false} isComplete={hasAstrology} />
              <div className={`flex-1 h-0.5 mx-4 ${hasAstrology ? 'bg-green-500' : 'bg-white/20'}`} />
              <ProgressStep number={2} title="Palm Reading" isActive={false} isComplete={hasPalm} />
              <div className={`flex-1 h-0.5 mx-4 ${hasPalm ? 'bg-green-500' : 'bg-white/20'}`} />
              <ProgressStep number={3} title="Face Reading" isActive={false} isComplete={hasFace} />
              <div className="flex-1 h-0.5 bg-purple-300 mx-4" />
              <ProgressStep number={4} title="AI Synthesis" isActive={true} isComplete={false} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-white font-bold mb-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                Astrology
              </h3>
              <p className="text-purple-100 text-sm mb-2 line-clamp-4">{summaries?.astrology}</p>
              <div className="text-green-400 text-xs">✓ Your chart</div>
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-white font-bold mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-400" />
                Palmistry
              </h3>
              <p className="text-purple-100 text-sm mb-2 line-clamp-4">{summaries?.palmistry}</p>
              <div className="text-green-400 text-xs">✓ Your palms</div>
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-white font-bold mb-3 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-400" />
                Face Reading
              </h3>
              <p className="text-purple-100 text-sm mb-2 line-clamp-4">{summaries?.face}</p>
              <div className="text-green-400 text-xs">✓ Your profile</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-purple-400/30 mb-8">
            <h3 className="text-white font-bold mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              AI Synthesis Process
            </h3>
            <div className="space-y-3 text-purple-100 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                Linking your saved birth chart, palm, and face readings
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                Cross-referencing career indicators across all three sciences
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                Generating personalized recommendations from the backend AI
              </div>
            </div>
          </div>

          <motion.button
            onClick={synthesizeInsights}
            disabled={isAnalyzing}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isAnalyzing ? (
              <div className="flex items-center justify-center">
                <Brain className="w-5 h-5 mr-2 animate-pulse" />
                Synthesizing Insights...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Start AI Synthesis
              </div>
            )}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
      >
        <div className="text-center mb-8">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Career Synthesis Complete</h2>
          <div className="flex items-center justify-center">
            <span className="text-purple-200 mr-2">Overall Confidence:</span>
            <span className="text-2xl font-bold text-green-400">{insight?.confidenceScore}%</span>
          </div>
        </div>

        {insight && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-8 border border-purple-400/30">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Target className="w-6 h-6 mr-3 text-yellow-400" />
                Your Career Blueprint
              </h3>
              <p className="text-purple-100 text-lg leading-relaxed">{insight.synthesizedRecommendation}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Top Career Paths
                </h3>
                {insight.topCareerPaths.length > 0 ? (
                  <div className="space-y-3">
                    {insight.topCareerPaths.map((path, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center p-3 bg-white/5 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                          {index + 1}
                        </div>
                        <span className="text-purple-100 font-medium">{path}</span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-purple-200 text-sm">Career paths will appear once the backend insight is fully generated.</p>
                )}
              </div>

              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-400" />
                  Optimal Timing
                </h3>
                <div className="space-y-4">
                  {insight.bestTiming.immediate.length > 0 && (
                    <div>
                      <h4 className="text-green-400 font-bold mb-2">Immediate (Next 3 months)</h4>
                      <div className="space-y-1">
                        {insight.bestTiming.immediate.map((item, index) => (
                          <div key={index} className="text-purple-100 text-sm flex items-start">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {insight.bestTiming.shortTerm.length > 0 && (
                    <div>
                      <h4 className="text-yellow-400 font-bold mb-2">Short-term (3-12 months)</h4>
                      <div className="space-y-1">
                        {insight.bestTiming.shortTerm.map((item, index) => (
                          <div key={index} className="text-purple-100 text-sm flex items-start">
                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {insight.bestTiming.longTerm.length > 0 && (
                    <div>
                      <h4 className="text-purple-400 font-bold mb-2">Long-term (1-3 years)</h4>
                      <div className="space-y-1">
                        {insight.bestTiming.longTerm.map((item, index) => (
                          <div key={index} className="text-purple-100 text-sm flex items-start">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {insight.bestTiming.immediate.length === 0 &&
                    insight.bestTiming.shortTerm.length === 0 &&
                    insight.bestTiming.longTerm.length === 0 && (
                      <p className="text-purple-200 text-sm">Timing guidance will appear when available from your insight.</p>
                    )}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  Key Strengths
                </h3>
                <div className="space-y-2">
                  {insight.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-purple-100">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                  Growth Areas
                </h3>
                <div className="space-y-2">
                  {insight.challenges.map((challenge, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-purple-100">{challenge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {insight.actionItems.length > 0 && (
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-400" />
                  Recommended Action Items
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {insight.actionItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center p-3 bg-white/5 rounded-lg"
                    >
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                        {index + 1}
                      </div>
                      <span className="text-purple-100">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setStep(1);
              setInsight(null);
            }}
            className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors mr-4"
          >
            Regenerate Analysis
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Download Report
          </button>
        </div>
      </motion.div>
    </div>
  );
}
