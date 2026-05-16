import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, CheckCircle, AlertCircle, Award, Briefcase, ArrowRight, Zap, Crown, Star, Shield, Rocket, Loader2 } from 'lucide-react';
import apiClient from '../api/apiClient';

import { CareerReportSummary } from './CareerReportSummary';

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
  astrologyData?: any;
  palmistryData?: any;
  faceReadingData?: any;
}

export default function ComprehensiveAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [hasAstrology, setHasAstrology] = useState(false);
  const [hasPalm, setHasPalm] = useState(false);
  const [hasFace, setHasFace] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState(0);
  const navigate = useNavigate();

  const [fullData, setFullData] = useState<{ face: any, palmistry: any, astrology: any } | null>(null);

  useEffect(() => {
    checkCompletedReadings();
  }, []);

  const checkCompletedReadings = async () => {
    try {
      const response = await apiClient.get('readings');
      if (response.data.success) {
        const { astrology, palmistry, face } = response.data.data;
        setHasAstrology(astrology.length > 0);
        setHasPalm(palmistry.length > 0);
        setHasFace(face.length > 0);
        
        if (astrology.length > 0 && palmistry.length > 0 && face.length > 0) {
          setFullData({
            face: face[0],
            palmistry: palmistry[0],
            astrology: astrology[0]
          });
        }
      }
    } catch (error) {
      console.error('Error fetching readings:', error);
    }
  };

  const generateComprehensiveAnalysis = async () => {
    if (!hasAstrology || !hasPalm || !hasFace) return;

    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockAnalysis: Analysis = {
      topCareerMatches: [
        {
          title: 'Technology Project Manager',
          matchScore: 94,
          reasoning: 'Your analytical mind (face reading), natural leadership abilities (palm reading), and strong Mercury influence (astrology) align perfectly with tech project management.',
          salaryRange: '$85,000 - $140,000',
          growthPotential: 'High'
        },
        {
          title: 'UX/UI Design Lead',
          matchScore: 91,
          reasoning: 'Creative problem-solving skills and empathy suggest excellence in user-centered design leadership.',
          salaryRange: '$75,000 - $125,000',
          growthPotential: 'Very High'
        }
      ],
      sixMonthPathway: [],
      threeYearPathway: [],
      strengthsSummary: [
        'Natural leadership abilities',
        'Strong analytical thinking',
        'Excellent communication',
        'High emotional intelligence'
      ],
      developmentAreas: [
        'Public speaking confidence',
        'Delegation skills',
        'Work-life balance'
      ],
      confidenceScore: 92,
      astrologyData: fullData?.astrology,
      palmistryData: fullData?.palmistry,
      faceReadingData: fullData?.face
    };

    setAnalysis(mockAnalysis);
    
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
    
    setIsAnalyzing(false);
  };

  const completedCount = [hasAstrology, hasPalm, hasFace].filter(Boolean).length;
  const allComplete = completedCount === 3;

  if (!allComplete) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center"
        >
          <Brain className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Comprehensive Career Analysis</h2>
          <p className="text-purple-200 mb-8">Complete all three readings to unlock your personalized career pathway</p>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 text-center">
            <p className="text-blue-200 mb-2">{completedCount} of 3 readings completed</p>
            <div className="w-full bg-white/10 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / 3) * 100}%` }}
              />
            </div>
            <p className="text-white text-sm">Finish all readings to proceed.</p>
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
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center shadow-2xl"
        >
          <div className="w-24 h-24 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Rocket className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Readings Complete!</h2>
          <p className="text-purple-200 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            All your cosmic signatures have been gathered. We are ready to synthesize your personalized career roadmap.
          </p>

          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
              <p className="text-purple-300 animate-pulse font-medium">Synthesizing your destiny...</p>
            </div>
          ) : (
            <motion.button
              onClick={generateComprehensiveAnalysis}
              className="px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold text-lg rounded-2xl hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all flex items-center gap-3 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Generate Final Analysis
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-10 border border-purple-400/30 text-center relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
          <Award className="w-48 h-48 text-white rotate-12 group-hover:rotate-0 transition-transform duration-700" />
        </div>
        <h1 className="text-5xl font-black text-white mb-4 group-hover:scale-[1.02] transition-transform duration-500">Your Career Blueprint</h1>
        <p className="text-purple-200 text-xl max-w-2xl mx-auto mb-6 group-hover:translate-y-[-2px] transition-transform duration-500">
          A synthesized professional roadmap based on your unique cosmic and physical signatures.
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="px-6 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
            <span className="text-green-400 font-bold text-2xl">{analysis?.confidenceScore}%</span>
            <span className="text-green-400/60 text-sm ml-2 font-medium">Confidence Score</span>
          </div>
        </div>
      </motion.div>

      <CareerReportSummary analysis={analysis} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {analysis.topCareerMatches.map((career, index) => (
          <motion.div
            key={index}
            onClick={() => setSelectedCareer(index)}
            className={`cursor-pointer rounded-3xl p-10 border-2 transition-all relative overflow-hidden ${
              selectedCareer === index
                ? 'bg-white/10 border-purple-400 shadow-2xl'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            {selectedCareer === index && (
              <div className="absolute top-0 right-0 p-4">
                <CheckCircle className="w-8 h-8 text-purple-400" />
              </div>
            )}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">{career.title}</h3>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/30 transition-colors duration-300"><Briefcase className="w-6 h-6 text-purple-400" /></div>
            </div>
            <p className="text-purple-100 text-lg leading-relaxed mb-6 group-hover:translate-x-1 transition-transform duration-300 delay-75">{career.reasoning}</p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-purple-200">{career.salaryRange}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-purple-200">{career.growthPotential} Growth</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-[#1a1c2e]/60 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Shield className="w-6 h-6 text-green-400" />
            Strategic Strengths
          </h2>
          <div className="space-y-4">
            {analysis.strengthsSummary.map((strength, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-purple-100 font-medium">{strength}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1a1c2e]/60 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-yellow-400" />
            Growth Opportunities
          </h2>
          <div className="space-y-4">
            {analysis.developmentAreas.map((area, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <span className="text-purple-100 font-medium">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group overflow-hidden rounded-[48px] p-1 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.4)]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
        
        <div className="relative bg-[#0d0f1a]/95 backdrop-blur-3xl rounded-[46px] p-12 md:p-20 text-center overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-600/20 rounded-full blur-[100px]" />
          
          <div className="max-w-3xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-purple-300 text-sm font-bold mb-8 uppercase tracking-widest shadow-inner"
            >
              <Crown className="w-4 h-4 text-yellow-400" />
              Final Report Selection
            </motion.div>
            
            <h3 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tight">
              Unlock Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Complete Destiny
              </span>
            </h3>
            
            <p className="text-gray-400 text-xl mb-12 leading-relaxed font-medium">
              Choose the depth of guidance that matches your ambition.
            </p>

            <div className="flex flex-col lg:flex-row gap-6 justify-center items-stretch mb-16">
              <motion.div 
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => navigate('/pricing')}
                className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <Star className="w-10 h-10 text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h4 className="text-white font-bold text-lg mb-1 group-hover:translate-x-1 transition-transform duration-300">Cosmic Explorer</h4>
                <p className="text-gray-500 text-sm mb-6 group-hover:translate-x-1 transition-transform duration-300 delay-75">Foundational Guide</p>
                <div className="text-white/60 text-xs text-left w-full space-y-2 mb-8 group-hover:translate-x-1 transition-transform duration-300 delay-100">
                  <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> 10-Page Report</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Basic Overview</div>
                </div>
                <button className="mt-auto w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white text-xs font-bold transition-all uppercase tracking-wider">
                  Download Free
                </button>
              </motion.div>

              <motion.div 
                whileHover={{ y: -12, scale: 1.05 }}
                onClick={() => navigate('/pricing')}
                className="flex-1 bg-white/5 border border-yellow-500/30 rounded-3xl p-8 flex flex-col items-center scale-105 shadow-[0_0_40px_rgba(234,179,8,0.1)] ring-1 ring-yellow-500/20 cursor-pointer group"
              >
                <Zap className="w-10 h-10 text-yellow-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h4 className="text-white font-bold text-lg mb-1 group-hover:translate-x-1 transition-transform duration-300">Astral</h4>
                <p className="text-gray-500 text-sm mb-6 group-hover:translate-x-1 transition-transform duration-300 delay-75">Strategic Pathway</p>
                <div className="text-white/60 text-xs text-left w-full space-y-2 mb-8 group-hover:translate-x-1 transition-transform duration-300 delay-100">
                  <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> 15-Page Detailed</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> 3yr Roadmap</div>
                </div>
                <button className="mt-auto w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl text-white text-xs font-bold shadow-lg uppercase tracking-wider">
                  Unlock Astral Report
                </button>
              </motion.div>

              <motion.div 
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => navigate('/pricing')}
                className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <Crown className="w-10 h-10 text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h4 className="text-white font-bold text-lg mb-1 group-hover:translate-x-1 transition-transform duration-300">Cosmic Master</h4>
                <p className="text-gray-500 text-sm mb-6 group-hover:translate-x-1 transition-transform duration-300 delay-75">Exhaustive Blueprint</p>
                <div className="text-white/60 text-xs text-left w-full space-y-2 mb-8 group-hover:translate-x-1 transition-transform duration-300 delay-100">
                  <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> 25-Page Master</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Daily Action Plans</div>
                </div>
                <button className="mt-auto w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white text-xs font-bold shadow-lg uppercase tracking-wider">
                  Unlock Cosmic Master Report
                </button>
              </motion.div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 text-gray-500 text-sm italic">
              * All reports are personalized based on your exact birth time and palm signatures.
            </div>
            
            <p className="mt-8 text-gray-500 text-sm font-medium flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              Secure Payment • PDF Instant Generation • Lifetime Access
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-center pb-20">
        <button
          onClick={() => setAnalysis(null)}
          className="px-8 py-4 bg-white/5 text-gray-500 rounded-2xl hover:bg-white/10 transition-all text-sm font-bold border border-white/5"
        >
          Generate New Analysis
        </button>
      </div>
    </div>
  );
}
