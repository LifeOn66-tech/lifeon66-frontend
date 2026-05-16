import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, Target, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import apiClient from '../api/apiClient';

interface ReadingData {
  astrology?: {
    careerHouse: string;
    planetaryPeriods: string[];
    recommendations: string;
  };
  palmistry?: {
    fateLineStrength: number;
    headLineDepth: number;
    sunLinePresent: boolean;
    recommendations: string;
  };
  faceReading?: {
    leadership: number;
    teamwork: number;
    independence: number;
    recommendations: string;
  };
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

export default function AIAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insight, setInsight] = useState<SynthesizedInsight | null>(null);
  const [step, setStep] = useState(1);

  // Mock reading data - in real app, this would come from previous readings
  const mockReadingData: ReadingData = {
    astrology: {
      careerHouse: 'Strong 10th house with Sun placement indicating leadership potential',
      planetaryPeriods: ['Jupiter period: Career expansion', 'Saturn period: Consolidation'],
      recommendations: 'Leadership roles in creative or public-facing industries'
    },
    palmistry: {
      fateLineStrength: 85,
      headLineDepth: 78,
      sunLinePresent: true,
      recommendations: 'Strong career progression with creative and analytical abilities'
    },
    faceReading: {
      leadership: 82,
      teamwork: 75,
      independence: 88,
      recommendations: 'Natural leadership with preference for independent work'
    }
  };

  const synthesizeInsights = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI synthesis process
    await new Promise(resolve => setTimeout(resolve, 4000));

    const synthesizedInsight: SynthesizedInsight = {
      topCareerPaths: [
        'Executive Leadership',
        'Creative Director',
        'Management Consultant',
        'Entrepreneur',
        'Project Manager'
      ],
      bestTiming: {
        immediate: [
          'Apply for leadership roles',
          'Start networking in target industries',
          'Develop public speaking skills'
        ],
        shortTerm: [
          'Pursue advanced certifications',
          'Build a strong professional brand',
          'Seek mentorship opportunities'
        ],
        longTerm: [
          'Consider starting your own business',
          'Aim for C-suite positions',
          'Develop industry expertise'
        ]
      },
      strengths: [
        'Natural leadership presence',
        'Strong analytical thinking',
        'Creative problem-solving',
        'Independent work style',
        'Good communication skills'
      ],
      challenges: [
        'May need to improve collaborative skills',
        'Could benefit from patience in team settings',
        'Should develop emotional intelligence',
        'Need to balance independence with teamwork'
      ],
      actionItems: [
        'Join professional leadership groups',
        'Take on high-visibility projects',
        'Develop a 5-year career plan',
        'Build a strong professional network',
        'Consider executive coaching'
      ],
      confidenceScore: 91,
      synthesizedRecommendation: 'Your combined readings strongly indicate exceptional leadership potential with a natural inclination toward independent, creative work. The convergence of your astrological chart, palm lines, and facial features all point to success in executive or entrepreneurial roles. Your analytical abilities combined with creative thinking make you ideal for strategic positions where you can lead teams while maintaining autonomy in decision-making.'
    };

    setInsight(synthesizedInsight);
    
    try {
      await apiClient.post('readings/insight', {
        synthesizedRecommendation: synthesizedInsight.synthesizedRecommendation,
        topCareerPaths: synthesizedInsight.topCareerPaths,
        bestTiming: synthesizedInsight.bestTiming,
        strengths: synthesizedInsight.strengths,
        challenges: synthesizedInsight.challenges,
        actionItems: synthesizedInsight.actionItems,
        confidenceScore: synthesizedInsight.confidenceScore
      });
    } catch (error) {
      console.error('Error saving career insight:', error);
    }

    setIsAnalyzing(false);
    setStep(2);
  };

  const ProgressStep = ({ number, title, isActive, isComplete }: {
    number: number;
    title: string;
    isActive: boolean;
    isComplete: boolean;
  }) => (
    <div className="flex items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
        isComplete ? 'bg-green-500 text-white' :
        isActive ? 'bg-purple-500 text-white' :
        'bg-white/20 text-purple-200'
      }`}>
        {isComplete ? <CheckCircle className="w-4 h-4" /> : number}
      </div>
      <span className={`ml-2 text-sm ${
        isActive || isComplete ? 'text-white' : 'text-purple-300'
      }`}>
        {title}
      </span>
    </div>
  );

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
            <p className="text-purple-200">Combining insights from astrology, palmistry, and face reading</p>
          </div>

          {/* Analysis Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <ProgressStep number={1} title="Astrology Analysis" isActive={false} isComplete={true} />
              <div className="flex-1 h-0.5 bg-green-500 mx-4" />
              <ProgressStep number={2} title="Palm Reading" isActive={false} isComplete={true} />
              <div className="flex-1 h-0.5 bg-green-500 mx-4" />
              <ProgressStep number={3} title="Face Reading" isActive={false} isComplete={true} />
              <div className="flex-1 h-0.5 bg-purple-300 mx-4" />
              <ProgressStep number={4} title="AI Synthesis" isActive={true} isComplete={false} />
            </div>
          </div>

          {/* Reading Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-white font-bold mb-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                Astrology
              </h3>
              <p className="text-purple-100 text-sm mb-2">{mockReadingData.astrology?.careerHouse}</p>
              <div className="text-green-400 text-xs">✓ Analysis Complete</div>
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-white font-bold mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-400" />
                Palmistry
              </h3>
              <p className="text-purple-100 text-sm mb-2">{mockReadingData.palmistry?.recommendations}</p>
              <div className="text-green-400 text-xs">✓ Analysis Complete</div>
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-white font-bold mb-3 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-400" />
                Face Reading
              </h3>
              <p className="text-purple-100 text-sm mb-2">{mockReadingData.faceReading?.recommendations}</p>
              <div className="text-green-400 text-xs">✓ Analysis Complete</div>
            </div>
          </div>

          {/* Synthesis Process */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-purple-400/30 mb-8">
            <h3 className="text-white font-bold mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              AI Synthesis Process
            </h3>
            <div className="space-y-3 text-purple-100 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                Cross-referencing astrological timing with palm line strength
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                Analyzing personality traits against career house indicators
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                Identifying convergent patterns across all three readings
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                Generating personalized career recommendations
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
            {/* Main Recommendation */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-8 border border-purple-400/30">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Target className="w-6 h-6 mr-3 text-yellow-400" />
                Your Career Blueprint
              </h3>
              <p className="text-purple-100 text-lg leading-relaxed">{insight.synthesizedRecommendation}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Top Career Paths */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Top Career Paths
                </h3>
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
              </div>

              {/* Timing Recommendations */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-400" />
                  Optimal Timing
                </h3>
                <div className="space-y-4">
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
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Strengths */}
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

              {/* Challenges */}
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

            {/* Action Items */}
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
            Generate New Analysis
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
            Download Report
          </button>
        </div>
      </motion.div>
    </div>
  );
}