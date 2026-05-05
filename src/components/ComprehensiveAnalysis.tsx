import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, Calendar, CheckCircle, AlertCircle, Award, Briefcase, BookOpen, Users, Download, Globe } from 'lucide-react';
import apiClient from '../api/apiClient';
import { generatePDFReport } from '../utils/pdfGeneratorV2';
import CareerReportSummary from './CareerReportSummary';

interface CareerMatch {
  title: string;
  matchScore: number;
  reasoning: string;
  salaryRange: string;
  growthPotential: string;
}

interface PathwayStep {
  month: string;
  title: string;
  description: string;
  actions: string[];
  milestones: string[];
}

interface Analysis {
  topCareerMatches: CareerMatch[];
  sixMonthPathway: PathwayStep[];
  threeYearPathway: PathwayStep[];
  strengthsSummary: string[];
  developmentAreas: string[];
  confidenceScore: number;
}

export default function ComprehensiveAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [hasAstrology, setHasAstrology] = useState(false);
  const [hasPalm, setHasPalm] = useState(false);
  const [hasFace, setHasFace] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState(0);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    checkCompletedReadings();

    // Set up polling to check for updates every 2 seconds
    const interval = setInterval(() => {
      checkCompletedReadings();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      checkCompletedReadings();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkCompletedReadings();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const checkCompletedReadings = async () => {
    try {
      const response = await apiClient.get('/readings');
      if (response.data.success) {
        const { astrology, palmistry, face } = response.data.data;
        setHasAstrology(astrology.length > 0);
        setHasPalm(palmistry.length > 0);
        setHasFace(face.length > 0);
      }
    } catch (error) {
      console.error('Error fetching readings:', error);
    }
  };

  const generateComprehensiveAnalysis = async () => {
    if (!hasAstrology || !hasPalm || !hasFace) return;

    setIsAnalyzing(true);

    await new Promise(resolve => setTimeout(resolve, 4000));

    const mockAnalysis: Analysis = {
      topCareerMatches: [
        {
          title: 'Technology Project Manager',
          matchScore: 94,
          reasoning: 'Your analytical mind (face reading), natural leadership abilities (palm reading), and strong Mercury influence (astrology) align perfectly with tech project management.',
          salaryRange: '$85,000 - $140,000',
          growthPotential: 'High - 15% annual growth expected'
        },
        {
          title: 'UX/UI Design Lead',
          matchScore: 91,
          reasoning: 'Creative problem-solving skills and empathy indicators from all three readings suggest excellence in user-centered design leadership.',
          salaryRange: '$75,000 - $125,000',
          growthPotential: 'Very High - 20% annual growth expected'
        },
        {
          title: 'Business Strategy Consultant',
          matchScore: 88,
          reasoning: 'Strong analytical capabilities, communication skills, and strategic thinking patterns identified across readings.',
          salaryRange: '$90,000 - $160,000',
          growthPotential: 'High - 12% annual growth expected'
        }
      ],
      sixMonthPathway: [
        {
          month: 'Month 1-2',
          title: 'Foundation Building',
          description: 'Establish core skills and build your professional brand',
          actions: [
            'Complete 2 relevant online certifications',
            'Update LinkedIn profile with new skills',
            'Join 3 industry-specific communities',
            'Start a professional blog or portfolio'
          ],
          milestones: [
            'LinkedIn profile at 100% completion',
            'First industry networking event attended',
            '5 new professional connections made'
          ]
        },
        {
          month: 'Month 3-4',
          title: 'Skill Development & Networking',
          description: 'Deepen expertise and expand professional network',
          actions: [
            'Take on stretch project at current role',
            'Attend 2 industry conferences or workshops',
            'Find a mentor in target field',
            'Contribute to open-source or volunteer projects'
          ],
          milestones: [
            'Mentor relationship established',
            'Portfolio with 3 showcase projects',
            '20+ meaningful professional connections'
          ]
        },
        {
          month: 'Month 5-6',
          title: 'Transition Preparation',
          description: 'Position yourself for career advancement or transition',
          actions: [
            'Apply to 5-10 target positions',
            'Prepare case studies of your best work',
            'Practice interviewing with peers',
            'Build relationships with recruiters'
          ],
          milestones: [
            'Resume reviewed by 3 industry professionals',
            '5+ job interviews scheduled',
            'Compelling personal brand established'
          ]
        }
      ],
      threeYearPathway: [
        {
          month: 'Year 1',
          title: 'Entry & Establishment',
          description: 'Secure position in target field and prove your value',
          actions: [
            'Land role in target career path',
            'Complete company onboarding excellence',
            'Deliver 2-3 high-impact projects',
            'Establish reputation as reliable expert',
            'Continue skill development with advanced certifications'
          ],
          milestones: [
            'Successfully transition to new role',
            'Positive performance review',
            'Lead at least one significant project',
            'Become go-to person for key area'
          ]
        },
        {
          month: 'Year 2',
          title: 'Growth & Leadership',
          description: 'Expand influence and take on leadership responsibilities',
          actions: [
            'Seek promotion or expanded role',
            'Mentor junior team members',
            'Lead cross-functional initiatives',
            'Speak at industry events or conferences',
            'Build strategic relationships with executives'
          ],
          milestones: [
            'Promotion to senior role or 15%+ salary increase',
            'Successfully mentor 2+ team members',
            'Lead team of 3-5 people',
            'Recognized as subject matter expert'
          ]
        },
        {
          month: 'Year 3',
          title: 'Mastery & Impact',
          description: 'Achieve expert status and create lasting organizational impact',
          actions: [
            'Drive strategic initiatives impacting bottom line',
            'Build and lead high-performing team',
            'Establish thought leadership in industry',
            'Create frameworks/processes adopted company-wide',
            'Prepare for director-level or specialized expert role'
          ],
          milestones: [
            'Director-level role or equivalent',
            'Salary in top 25% for role',
            'Recognized industry expert',
            'Created measurable organizational value',
            'Multiple career advancement options available'
          ]
        }
      ],
      strengthsSummary: [
        'Natural leadership abilities with collaborative approach',
        'Strong analytical and strategic thinking capabilities',
        'Excellent communication and interpersonal skills',
        'High emotional intelligence and empathy',
        'Creative problem-solving with practical execution',
        'Adaptability and resilience in challenging situations'
      ],
      developmentAreas: [
        'Public speaking confidence - practice presenting regularly',
        'Delegation skills - learn to trust team capabilities',
        'Work-life balance - set boundaries to prevent burnout',
        'Patience with slower-paced processes',
        'Financial management and budgeting skills'
      ],
      confidenceScore: 92
    };

    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);

    try {
      await apiClient.post('/readings/insight', {
        topCareerPaths: mockAnalysis.topCareerMatches,
        synthesizedRecommendation: mockAnalysis.topCareerMatches[0].reasoning,
        strengths: mockAnalysis.strengthsSummary,
        challenges: mockAnalysis.developmentAreas,
        sixMonthPathway: mockAnalysis.sixMonthPathway,
        threeYearPathway: mockAnalysis.threeYearPathway,
        confidenceScore: mockAnalysis.confidenceScore
      });
    } catch (error) {
      console.error('Error saving career insight:', error);
    }
  };

  const completedCount = [hasAstrology, hasPalm, hasFace].filter(Boolean).length;
  const allComplete = completedCount === 3;

  if (!allComplete) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          <div className="text-center mb-8">
            <Brain className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Comprehensive Career Analysis</h2>
            <p className="text-purple-200">Complete all three readings to unlock your personalized career pathway</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className={`flex items-center p-4 rounded-lg ${hasAstrology ? 'bg-green-500/20 border border-green-500/40' : 'bg-white/5 border border-white/10'}`}>
              {hasAstrology ? (
                <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
              ) : (
                <AlertCircle className="w-6 h-6 text-gray-400 mr-3" />
              )}
              <div>
                <h3 className="text-white font-bold">Astrology Reading</h3>
                <p className="text-sm text-purple-200">
                  {hasAstrology ? 'Completed' : 'Not completed - reveals cosmic influences on career'}
                </p>
              </div>
            </div>

            <div className={`flex items-center p-4 rounded-lg ${hasPalm ? 'bg-green-500/20 border border-green-500/40' : 'bg-white/5 border border-white/10'}`}>
              {hasPalm ? (
                <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
              ) : (
                <AlertCircle className="w-6 h-6 text-gray-400 mr-3" />
              )}
              <div>
                <h3 className="text-white font-bold">Palm Reading</h3>
                <p className="text-sm text-purple-200">
                  {hasPalm ? 'Completed' : 'Not completed - shows natural talents and abilities'}
                </p>
              </div>
            </div>

            <div className={`flex items-center p-4 rounded-lg ${hasFace ? 'bg-green-500/20 border border-green-500/40' : 'bg-white/5 border border-white/10'}`}>
              {hasFace ? (
                <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
              ) : (
                <AlertCircle className="w-6 h-6 text-gray-400 mr-3" />
              )}
              <div>
                <h3 className="text-white font-bold">Face Reading</h3>
                <p className="text-sm text-purple-200">
                  {hasFace ? 'Completed' : 'Not completed - indicates personality and work style'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 text-center">
            <p className="text-blue-200 mb-2">
              {completedCount} of 3 readings completed
            </p>
            <div className="w-full bg-white/10 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / 3) * 100}%` }}
              />
            </div>
            <p className="text-white text-sm">
              Complete the remaining {3 - completedCount} reading{3 - completedCount !== 1 ? 's' : ''} to unlock your comprehensive career analysis
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center"
        >
          <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Ready for Comprehensive Analysis</h2>
          <p className="text-purple-200 mb-8">
            All three readings completed! Generate your personalized career pathway with 6-month and 3-year plans.
          </p>

          <motion.button
            onClick={generateComprehensiveAnalysis}
            disabled={isAnalyzing}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isAnalyzing ? (
              <div className="flex items-center">
                <Brain className="w-5 h-5 mr-2 animate-pulse" />
                Generating Analysis...
              </div>
            ) : (
              'Generate Career Analysis'
            )}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-8 border border-purple-400/30"
      >
        <div className="text-center">
          <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Your Career Blueprint</h1>
          <p className="text-purple-200 mb-4">
            Based on comprehensive analysis of astrology, palmistry, and physiognomy
          </p>
          <div className="flex items-center justify-center">
            <span className="text-purple-200 mr-2">Analysis Confidence:</span>
            <span className="text-3xl font-bold text-green-400">{analysis.confidenceScore}%</span>
          </div>
        </div>
      </motion.div>

      <CareerReportSummary analysis={analysis} />

      <div className="grid lg:grid-cols-3 gap-6">
        {analysis.topCareerMatches.map((career, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedCareer(index)}
            className={`cursor-pointer rounded-2xl p-6 border-2 transition-all ${
              selectedCareer === index
                ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-purple-400'
                : 'bg-white/10 border-white/20 hover:border-purple-400/50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <Briefcase className="w-8 h-8 text-purple-400" />
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{career.matchScore}%</div>
                <div className="text-sm text-purple-200">Match</div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{career.title}</h3>
            <p className="text-purple-100 text-sm mb-4">{career.reasoning}</p>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-purple-200">{career.salaryRange}</span>
              </div>
              <div className="flex items-center text-sm">
                <Target className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-purple-200">{career.growthPotential}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Target className="w-6 h-6 text-green-400 mr-2" />
            Your Strengths
          </h2>
          <div className="space-y-3">
            {analysis.strengthsSummary.map((strength, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-purple-100">{strength}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 text-yellow-400 mr-2" />
            Development Areas
          </h2>
          <div className="space-y-3">
            {analysis.developmentAreas.map((area, index) => (
              <div key={index} className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-purple-100">{area}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-8 border border-blue-400/30"
      >
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
          <Calendar className="w-8 h-8 text-blue-400 mr-3" />
          6-Month Career Pathway
        </h2>
        <div className="space-y-6">
          {analysis.sixMonthPathway.map((step, index) => (
            <div key={index} className="bg-white/10 rounded-xl p-6 border border-white/20">
              <div className="flex items-start mb-4">
                <div className="bg-blue-500 text-white font-bold px-4 py-2 rounded-lg mr-4">
                  {step.month}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-purple-200">{step.description}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-bold mb-2 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-green-400" />
                    Action Steps
                  </h4>
                  <ul className="space-y-2">
                    {step.actions.map((action, i) => (
                      <li key={i} className="text-purple-100 text-sm flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-bold mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-yellow-400" />
                    Milestones
                  </h4>
                  <ul className="space-y-2">
                    {step.milestones.map((milestone, i) => (
                      <li key={i} className="text-purple-100 text-sm flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        {milestone}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-8 border border-purple-400/30"
      >
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
          <TrendingUp className="w-8 h-8 text-purple-400 mr-3" />
          3-Year Career Roadmap
        </h2>
        <div className="space-y-6">
          {analysis.threeYearPathway.map((step, index) => (
            <div key={index} className="bg-white/10 rounded-xl p-6 border border-white/20">
              <div className="flex items-start mb-4">
                <div className="bg-purple-500 text-white font-bold px-4 py-2 rounded-lg mr-4">
                  {step.month}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-purple-200">{step.description}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-bold mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-green-400" />
                    Key Actions
                  </h4>
                  <ul className="space-y-2">
                    {step.actions.map((action, i) => (
                      <li key={i} className="text-purple-100 text-sm flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-bold mb-2 flex items-center">
                    <Award className="w-4 h-4 mr-2 text-yellow-400" />
                    Success Milestones
                  </h4>
                  <ul className="space-y-2">
                    {step.milestones.map((milestone, i) => (
                      <li key={i} className="text-purple-100 text-sm flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        {milestone}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center"
      >
        <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Your Journey?</h3>
        <p className="text-purple-200 mb-6">
          This personalized pathway is designed specifically for you based on your unique combination of cosmic influences, natural talents, and personality traits.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2 mx-auto"
            >
              <Download className="w-5 h-5" />
              Download PDF Report
              <Globe className="w-4 h-4" />
            </button>

            {showLanguageMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-10 min-w-[200px]"
              >
                <button
                  onClick={async () => {
                    try {
                      await generatePDFReport(analysis, 'en');
                      setShowLanguageMenu(false);
                    } catch (error) {
                      console.error('Error generating PDF:', error);
                      alert('Failed to generate PDF. Please try again.');
                    }
                  }}
                  className="w-full px-6 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 text-gray-800"
                >
                  <span className="text-2xl">🇬🇧</span>
                  <div>
                    <div className="font-bold">English</div>
                    <div className="text-xs text-gray-500">Download in English</div>
                  </div>
                </button>
                <div className="h-px bg-gray-200" />
                <button
                  onClick={async () => {
                    try {
                      await generatePDFReport(analysis, 'hi');
                      setShowLanguageMenu(false);
                    } catch (error) {
                      console.error('Error generating PDF:', error);
                      alert('Failed to generate PDF. Please try again.');
                    }
                  }}
                  className="w-full px-6 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 text-gray-800"
                >
                  <span className="text-2xl">🇮🇳</span>
                  <div>
                    <div className="font-bold">हिंदी (Hindi)</div>
                    <div className="text-xs text-gray-500">हिंदी में डाउनलोड करें</div>
                  </div>
                </button>
              </motion.div>
            )}
          </div>

          <button
            onClick={() => setAnalysis(null)}
            className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Generate New Analysis
          </button>
        </div>
      </motion.div>
    </div>
  );
}
