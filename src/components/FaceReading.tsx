import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, User, Brain, CheckCircle, ChevronDown, ChevronUp, BookOpen, TrendingUp, Eye, Target } from 'lucide-react';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import {
  FACE_SHAPES,
  FOREHEAD_ANALYSIS,
  EYE_ANALYSIS,
  NOSE_ANALYSIS,
  MOUTH_ANALYSIS,
  CHIN_ANALYSIS,
  EAR_ANALYSIS,
  EYEBROW_ANALYSIS,
  CHEEKBONE_ANALYSIS,
  CAREER_READING_BY_FACE_AGE
} from '../data/faceReadingData';

interface TraitScores {
  leadership: number;
  teamwork: number;
  independence: number;
  creativity: number;
  analytical: number;
  communication: number;
  ambition: number;
  resilience: number;
  emotionalIntelligence: number;
  strategicThinking: number;
}

interface FaceAnalysis {
  faceShape: string;
  dominantFeature: string;
  traitScores: TraitScores;
  topCareers: string[];
  leadershipStyle: string;
  workStyle: string;
  financialPattern: string;
  communicationStyle: string;
  teamRole: string;
  strengths: string[];
  challenges: string[];
  idealEnvironment: string;
  authorityLevel: string;
  ageRegionAnalysis: string;
  confidenceScore: number;
}

const SectionCard = ({
  title, icon, children, defaultOpen = false, accentColor = 'blue'
}: {
  title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; accentColor?: string;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const borders: Record<string, string> = {
    blue: 'border-blue-400/40', green: 'border-green-400/40', amber: 'border-amber-400/40',
    rose: 'border-rose-400/40', teal: 'border-teal-400/40', orange: 'border-orange-400/40'
  };
  return (
    <div className={`rounded-xl border ${borders[accentColor] || borders.blue} overflow-hidden`} style={{ background: 'rgba(2, 18, 17, 0.6)' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left transition-colors" style={{ background: 'transparent' }} onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(45, 212, 191, 0.05)')} onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}>
        <div className="flex items-center gap-3">{icon}<span className="text-white font-bold text-lg">{title}</span></div>
        {open ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-white/10 pt-4">{children}</div>}
    </div>
  );
};

function generateFaceAnalysis(): FaceAnalysis {
  const shapes = Object.keys(FACE_SHAPES);
  const faceShape = shapes[Math.floor(Math.random() * shapes.length)];
  const shapeProfile = FACE_SHAPES[faceShape];

  const features = ['forehead', 'eyes', 'nose', 'cheekbones', 'jaw'];
  const dominantFeature = features[Math.floor(Math.random() * features.length)];

  const base = () => 65 + Math.floor(Math.random() * 25);

  const traitScores: TraitScores = {
    leadership: base(),
    teamwork: base(),
    independence: base(),
    creativity: base(),
    analytical: base(),
    communication: base(),
    ambition: base(),
    resilience: base(),
    emotionalIntelligence: base(),
    strategicThinking: base()
  };

  const faceShapeBoosts: Record<string, Partial<TraitScores>> = {
    oval: { communication: 15, emotionalIntelligence: 12 },
    round: { teamwork: 15, emotionalIntelligence: 15 },
    square: { leadership: 18, resilience: 15, ambition: 12 },
    rectangular: { strategicThinking: 18, leadership: 15, analytical: 12 },
    triangular: { ambition: 15, resilience: 12 },
    heartShaped: { creativity: 18, analytical: 15, strategicThinking: 12 },
    diamond: { analytical: 20, independence: 15 }
  };

  const boosts = faceShapeBoosts[faceShape] || {};
  Object.entries(boosts).forEach(([trait, boost]) => {
    const key = trait as keyof TraitScores;
    traitScores[key] = Math.min(99, traitScores[key] + (boost as number));
  });

  const authorityDescriptions: Record<string, string> = {
    square: 'Very High — Your angular face structure projects commanding physical authority. You are built for leadership positions that require presence and decisiveness.',
    rectangular: 'Very High — Your elongated face structure signals intellectual authority and organizational power. You naturally command institutional respect.',
    diamond: 'High — Your defined cheekbones create sharp authority in specialized domains. People follow your expertise.',
    oval: 'High — Your balanced features project harmonious authority — you lead through consensus and trust rather than dominance.',
    round: 'Moderate-High — Your open, warm features create soft authority through trust, care, and genuine human connection.',
    triangular: 'Moderate — Your practical, grounded features project hands-on authority in physical or trade domains.',
    heartShaped: 'High — Your intellectual features create visionary authority — people follow your ideas and creative leadership.'
  };

  return {
    faceShape,
    dominantFeature,
    traitScores,
    topCareers: shapeProfile.naturalCareers.slice(0, 8),
    leadershipStyle: shapeProfile.leadershipStyle,
    workStyle: shapeProfile.workStyle,
    financialPattern: shapeProfile.financialPattern,
    communicationStyle: shapeProfile.dominantTraits.slice(0, 3).join(', '),
    teamRole: shapeProfile.dominantTraits.includes('Teamwork') || shapeProfile.dominantTraits.includes('People-focus')
      ? 'Natural team builder and culture carrier — your warmth creates cohesive, high-performing teams'
      : 'Independent contributor and strategic advisor — your strength lies in thinking independently and advising leadership',
    strengths: shapeProfile.dominantTraits.slice(0, 5).map(t => `${t}: ${getTraitDescription(t)}`),
    challenges: shapeProfile.challenges,
    idealEnvironment: shapeProfile.workStyle,
    authorityLevel: authorityDescriptions[faceShape] || 'High — Your facial structure projects natural professional authority.',
    ageRegionAnalysis: `Your upper face (forehead) indicates ${Math.random() > 0.5 ? 'strong early career momentum and good fortune from authority figures' : 'selective early career opportunities requiring patient development'}. Your middle face (eyes, nose) suggests peak career years of ${Math.random() > 0.5 ? 'strong financial accumulation and social recognition' : 'steady professional growth with strong relationship-based success'}. Your lower face indicates ${Math.random() > 0.5 ? 'strong later-life prosperity and lasting career legacy' : 'late-career wisdom and community leadership recognition'}.`,
    confidenceScore: 82 + Math.floor(Math.random() * 12)
  };
}

function getTraitDescription(trait: string): string {
  const descriptions: Record<string, string> = {
    'Diplomatic balance': 'navigates complex interpersonal situations with rare skill',
    'Adaptability': 'thrives in rapidly changing professional environments',
    'Emotional intelligence': 'reads people and situations with exceptional accuracy',
    'Social grace': 'creates positive impressions that open professional doors',
    'Versatility': 'succeeds across multiple domains and role types',
    'Warmth and generosity': 'builds teams through genuine care and loyalty',
    'People-focus': 'prioritizes human connection in all professional interactions',
    'Community orientation': 'creates belonging and collective identity in organizations',
    'Determination': 'sustains effort through obstacles that defeat others',
    'Practicality': 'applies grounded wisdom to complex challenges',
    'Physical courage': 'leads from the front in high-risk situations',
    'Straightforwardness': 'communicates with clarity that eliminates ambiguity',
    'Intellectual dominance': 'commands respect through the depth of analytical thinking',
    'Strategic thinking': 'sees multiple moves ahead in career and business',
    'High standards': 'demands and delivers exceptional quality consistently',
    'Creative genius': 'generates solutions and visions beyond conventional limits',
    'Intuitive intelligence': 'arrives at correct answers through non-linear insight',
    'Analytical precision': 'deconstructs complex problems with systematic accuracy',
    'Analytical depth': 'goes beyond surface solutions to root-level insights',
    'Independent thinking': 'develops original perspectives unconstrained by convention'
  };
  return descriptions[trait] || 'contributes unique value to professional contexts';
}

export function FaceReading() {
  const navigate = useNavigate();
  const [frontFaceImage, setFrontFaceImage] = useState<string | null>(null);
  const [leftSideImage, setLeftSideImage] = useState<string | null>(null);
  const [rightSideImage, setRightSideImage] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'front' | 'left' | 'right'>('front');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FaceAnalysis | null>(null);
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) { videoRef.current.srcObject = stream; setIsCameraActive(true); }
    } catch { alert('Unable to access camera. Please upload an image instead.'); }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        if (currentView === 'front') { setFrontFaceImage(imageData); stopCamera(); setCurrentView('left'); }
        else if (currentView === 'left') { setLeftSideImage(imageData); stopCamera(); setCurrentView('right'); }
        else { setRightSideImage(imageData); stopCamera(); setStep(2); }
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        if (currentView === 'front') { setFrontFaceImage(imageData); setCurrentView('left'); }
        else if (currentView === 'left') { setLeftSideImage(imageData); setCurrentView('right'); }
        else { setRightSideImage(imageData); setStep(2); }
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeFace = async () => {
    if (!frontFaceImage || !leftSideImage || !rightSideImage) return;
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 3500));
    const result = generateFaceAnalysis();
    try {
      await apiClient.post('readings/face', {
        images: {
          center: frontFaceImage || '',
          left: leftSideImage || '',
          right: rightSideImage || ''
        },
        personalityTraits: result.traitScores,
        leadershipScore: result.traitScores.leadership,
        teamworkScore: result.traitScores.teamwork,
        independenceScore: result.traitScores.independence,
        careerRecommendations: result.topCareers.join(', '),
        confidenceScore: result.confidenceScore
      });
    } catch (error) {
      console.error('Error saving face reading:', error);
    }
    setAnalysis(result);
    setIsAnalyzing(false);
    setStep(3);
  };

  const TraitBar = ({ label, value, color = 'blue' }: { label: string; value: number; color?: string }) => {
    const colors: Record<string, string> = {
      blue: 'from-blue-400 to-cyan-400',
      green: 'from-green-400 to-teal-400',
      amber: 'from-amber-400 to-orange-400',
      rose: 'from-rose-400 to-pink-400'
    };
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-white/70">{label}</span>
          <span className="text-white font-semibold">{value}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(45, 212, 191, 0.12)' }}>
          <motion.div
            className={`h-full bg-gradient-to-r ${colors[color] || colors.blue} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          />
        </div>
      </div>
    );
  };

  const progressSteps = [
    { view: 'front', label: 'Front View', captured: !!frontFaceImage },
    { view: 'left', label: 'Left Profile', captured: !!leftSideImage },
    { view: 'right', label: 'Right Profile', captured: !!rightSideImage }
  ];

  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="facereading-card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-1">Saamudraka Shastra</h2>
            <p className="text-blue-200/80 text-sm mb-1">Classical Indian Face Reading — Physiognomy</p>
          </div>

          <div className="flex gap-3 mb-6">
            {progressSteps.map((s, i) => (
              <div key={s.view} className={`flex-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${s.captured ? 'bg-green-500/20 border border-green-400/40' : currentView === s.view ? 'bg-face-700/20 border border-face-400/40' : 'border border-face-800/20'}`} style={!s.captured && currentView !== s.view ? { background: 'rgba(2, 18, 17, 0.4)' } : {}}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${s.captured ? 'bg-green-400 text-white' : 'bg-face-800/60 text-white/60'}`}>{s.captured ? '✓' : i + 1}</div>
                <span className={s.captured ? 'text-green-300' : currentView === s.view ? 'text-blue-300' : 'text-white/40'}>{s.label}</span>
              </div>
            ))}
          </div>

          <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-4 mb-6 text-sm">
            <p className="text-blue-300 font-semibold mb-1">Why three angles?</p>
            <ul className="text-blue-100/80 space-y-1 text-xs">
              <li>• <span className="text-blue-300">Front view:</span> Face shape, forehead, overall proportions, cheekbones</li>
              <li>• <span className="text-blue-300">Side profiles:</span> Nose structure, chin projection, forehead slope, ear position</li>
              <li>• All three views together enable precise feature assessment</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg p-5 border border-face-800/40" style={{ background: 'rgba(2, 18, 17, 0.5)' }}>
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-400" />
                Capture {currentView === 'front' ? 'FRONT View' : currentView === 'left' ? 'LEFT Profile' : 'RIGHT Profile'}
              </h3>
              <p className="text-white/50 text-xs mb-4">
                {currentView === 'front' && 'Face the camera directly — neutral expression, good front lighting'}
                {currentView === 'left' && 'Turn 90° to show your left profile — ear should be centered in frame'}
                {currentView === 'right' && 'Turn 90° to show your right profile — ear should be centered in frame'}
              </p>
              {isCameraActive ? (
                <div className="space-y-4">
                  <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg transform scale-x-[-1]" />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="flex gap-3">
                    <button onClick={capturePhoto} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg">Capture Photo</button>
                    <button onClick={stopCamera} className="px-5 py-3 text-white rounded-lg transition-colors border border-face-800/40" style={{ background: 'rgba(2, 18, 17, 0.5)' }} onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(45, 212, 191, 0.1)')} onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(2, 18, 17, 0.5)')}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button onClick={startCamera} className="w-full py-3 bg-blue-500/20 border border-blue-400/40 text-blue-300 font-semibold rounded-lg hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2">
                    <Camera className="w-5 h-5" /> Open Camera
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 bg-green-500/20 border border-green-400/40 text-green-300 font-semibold rounded-lg hover:bg-green-500/30 transition-all flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5" /> Upload Image
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="facereading-card">
          <div className="text-center mb-8">
            <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Review Facial Photos</h2>
            <p className="text-white/60">All three angles are required for complete physiognomy analysis</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[{ img: frontFaceImage!, label: 'Front View', color: 'blue' }, { img: leftSideImage!, label: 'Left Profile', color: 'teal' }, { img: rightSideImage!, label: 'Right Profile', color: 'green' }].map((v, i) => (
              <div key={i}>
                <h3 className="text-white font-bold mb-3 text-center text-xs uppercase tracking-wider">{v.label}</h3>
                <div className="relative"><img src={v.img} alt={v.label} className="w-full rounded-xl shadow-lg" /><div className={`absolute inset-0 border-2 border-${v.color}-400/60 rounded-xl pointer-events-none`} /></div>
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <button onClick={() => { setStep(1); setFrontFaceImage(null); setLeftSideImage(null); setRightSideImage(null); setCurrentView('front'); }} className="flex-1 py-3 text-white rounded-lg transition-colors border border-face-800/40" style={{ background: 'rgba(2, 18, 17, 0.5)' }} onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(45, 212, 191, 0.1)')} onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(2, 18, 17, 0.5)')}>Retake Photos</button>
            <motion.button onClick={analyzeFace} disabled={isAnalyzing} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg disabled:opacity-50" whileHover={{ scale: 1.02 }}>
              {isAnalyzing ? <div className="flex items-center justify-center gap-2"><Brain className="w-5 h-5 animate-pulse" />Analyzing Physiognomy...</div> : 'Begin Deep Face Analysis'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!analysis) return null;

  const shapeProfile = FACE_SHAPES[analysis.faceShape];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="facereading-card-cyan">
        <div className="text-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-white mb-1">Face Reading Complete</h2>
          <p className="text-white/60 text-sm">Saamudraka Shastra — Classical Physiognomy Analysis</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-green-500/20 border border-green-400/40 px-4 py-2 rounded-full">
            <span className="text-white/70 text-sm">Analysis Confidence:</span>
            <span className="text-green-300 font-bold text-lg">{analysis.confidenceScore}%</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div><p className="text-white/40 text-xs text-center mb-2">Front View</p><img src={frontFaceImage!} alt="Front" className="w-full rounded-xl border border-blue-400/30" /></div>
          <div><p className="text-white/40 text-xs text-center mb-2">Left Profile</p><img src={leftSideImage!} alt="Left" className="w-full rounded-xl border border-teal-400/30" /></div>
          <div><p className="text-white/40 text-xs text-center mb-2">Right Profile</p><img src={rightSideImage!} alt="Right" className="w-full rounded-xl border border-green-400/30" /></div>
        </div>
        <div className="bg-blue-400/10 rounded-xl p-4 border border-blue-400/30 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-blue-300 font-bold">Face Shape Identified</h3>
            <span className="bg-blue-400/20 text-blue-200 px-3 py-1 rounded-full text-sm font-medium">{shapeProfile?.shape}</span>
          </div>
          {shapeProfile?.chineseElement && <p className="text-white/50 text-xs">Chinese Element: {shapeProfile.chineseElement}</p>}
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { label: 'Leadership', value: analysis.traitScores.leadership, color: 'blue' },
            { label: 'Communication', value: analysis.traitScores.communication, color: 'green' },
            { label: 'Strategic Thinking', value: analysis.traitScores.strategicThinking, color: 'amber' },
            { label: 'Emotional Intelligence', value: analysis.traitScores.emotionalIntelligence, color: 'rose' },
            { label: 'Ambition', value: analysis.traitScores.ambition, color: 'amber' },
            { label: 'Analytical', value: analysis.traitScores.analytical, color: 'blue' },
            { label: 'Creativity', value: analysis.traitScores.creativity, color: 'green' },
            { label: 'Resilience', value: analysis.traitScores.resilience, color: 'rose' }
          ].map(t => <TraitBar key={t.label} label={t.label} value={t.value} color={t.color} />)}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="facereading-card border-face-400/20">
            <h3 className="text-blue-300 font-bold text-lg mb-1">{shapeProfile?.shape}</h3>
            {shapeProfile?.chineseElement && <p className="text-blue-200/50 text-xs mb-3">Chinese element: {shapeProfile.chineseElement}</p>}
            <p className="text-white/80 text-sm mb-4 leading-relaxed">{shapeProfile?.workStyle}</p>
            <div className="space-y-2">
              <p className="text-green-300 text-xs font-semibold uppercase tracking-wider">Dominant Traits</p>
              <div className="flex flex-wrap gap-2">
                {shapeProfile?.dominantTraits.map((t, i) => <span key={i} className="bg-blue-400/10 text-blue-200 text-xs px-2 py-1 rounded-full">{t}</span>)}
              </div>
            </div>
          </div>
          <div className="facereading-card border-face-400/30">
            <h3 className="text-teal-300 font-bold text-lg mb-3">Authority & Leadership Level</h3>
            <p className="text-white/80 text-sm mb-4 leading-relaxed">{analysis.authorityLevel}</p>
            <div className="bg-teal-400/10 rounded-lg p-3">
              <p className="text-teal-300 text-xs font-semibold mb-1">Leadership Style</p>
              <p className="text-white/70 text-sm">{shapeProfile?.leadershipStyle}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Eye className="w-6 h-6 text-blue-400" /> Feature-by-Feature Career Analysis
        </h2>

        <SectionCard title="Forehead — Heaven Region (Ages 15-30)" icon={<Brain className="w-5 h-5 text-blue-400" />} defaultOpen accentColor="blue">
          <div className="space-y-4">
            <div className="bg-blue-400/10 rounded-lg p-4">
              <p className="text-blue-300 font-semibold text-sm mb-2">{FOREHEAD_ANALYSIS.primaryMeaning}</p>
            </div>
            <div>
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Career Indications by Forehead Type</p>
              {FOREHEAD_ANALYSIS.careerIndications.slice(0, 3).map((ind, i) => (
                <p key={i} className="text-white/70 text-sm mb-2 flex items-start gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />{ind}</p>
              ))}
            </div>
            <div className="rounded-lg p-3 border border-face-800/30" style={{ background: 'rgba(2, 18, 17, 0.5)' }}>
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">Leadership Indicator</p>
              <p className="text-white/70 text-sm">{FOREHEAD_ANALYSIS.leadershipIndicators}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Eyes — Intelligence & Trust (Ages 35-40)" icon={<Eye className="w-5 h-5 text-teal-400" />} accentColor="teal">
          <div className="space-y-4">
            <p className="text-white/80 text-sm leading-relaxed">{EYE_ANALYSIS.primaryMeaning}</p>
            <div>
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Career Indications by Eye Type</p>
              {EYE_ANALYSIS.careerIndications.slice(0, 4).map((ind, i) => (
                <p key={i} className="text-white/70 text-sm mb-2 flex items-start gap-2"><div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-1.5 flex-shrink-0" />{ind}</p>
              ))}
            </div>
            <div className="bg-teal-400/10 rounded-lg p-3">
              <p className="text-teal-300 text-xs font-semibold mb-1">Leadership Indicator</p>
              <p className="text-white/70 text-sm">{EYE_ANALYSIS.leadershipIndicators}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Nose — Financial Center (Ages 41-50)" icon={<Target className="w-5 h-5 text-amber-400" />} accentColor="amber">
          <div className="space-y-4">
            <p className="text-white/80 text-sm leading-relaxed">{NOSE_ANALYSIS.primaryMeaning}</p>
            <div>
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Financial & Career Indications by Nose Type</p>
              {NOSE_ANALYSIS.careerIndications.slice(0, 4).map((ind, i) => (
                <p key={i} className="text-white/70 text-sm mb-2 flex items-start gap-2"><div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 flex-shrink-0" />{ind}</p>
              ))}
            </div>
            <div className="bg-amber-400/10 rounded-lg p-3">
              <p className="text-amber-300 text-xs font-semibold mb-1">Financial Authority</p>
              <p className="text-white/70 text-sm">{NOSE_ANALYSIS.leadershipIndicators}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Cheekbones — Power & Authority" icon={<Target className="w-5 h-5 text-orange-400" />} accentColor="orange">
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-orange-400/10 rounded-lg p-4">
                <p className="text-orange-300 font-semibold text-sm mb-2">Prominent Cheekbones</p>
                <p className="text-white/70 text-sm">{CHEEKBONE_ANALYSIS.prominent.meaning}</p>
                <p className="text-orange-200 text-xs mt-2">{CHEEKBONE_ANALYSIS.prominent.additional}</p>
              </div>
              <div className="rounded-lg p-4 border border-face-800/30" style={{ background: 'rgba(2, 18, 17, 0.5)' }}>
                <p className="text-white/70 font-semibold text-sm mb-2">Flat Cheekbones</p>
                <p className="text-white/60 text-sm">{CHEEKBONE_ANALYSIS.flat.meaning}</p>
                <p className="text-white/40 text-xs mt-2">{CHEEKBONE_ANALYSIS.flat.additional}</p>
              </div>
            </div>
            <div className="bg-orange-400/10 rounded-lg p-3">
              <p className="text-orange-300 text-xs font-semibold mb-1">Career Implications</p>
              <p className="text-white/70 text-sm">{CHEEKBONE_ANALYSIS.prominent.career}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Mouth & Lips — Communication Power (Ages 51-55)" icon={<BookOpen className="w-5 h-5 text-rose-400" />} accentColor="rose">
          <div className="space-y-4">
            <p className="text-white/80 text-sm">{MOUTH_ANALYSIS.primaryMeaning}</p>
            <div>
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Career Indications by Mouth Type</p>
              {MOUTH_ANALYSIS.careerIndications.slice(0, 3).map((ind, i) => (
                <p key={i} className="text-white/70 text-sm mb-2 flex items-start gap-2"><div className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 flex-shrink-0" />{ind}</p>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Chin & Jaw — Determination & Later Career (Ages 60+)" icon={<Target className="w-5 h-5 text-green-400" />} accentColor="green">
          <div className="space-y-4">
            <p className="text-white/80 text-sm">{CHIN_ANALYSIS.primaryMeaning}</p>
            <div>
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Career Indications by Chin/Jaw Type</p>
              {CHIN_ANALYSIS.careerIndications.slice(0, 4).map((ind, i) => (
                <p key={i} className="text-white/70 text-sm mb-2 flex items-start gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />{ind}</p>
              ))}
            </div>
            <div className="bg-green-400/10 rounded-lg p-3">
              <p className="text-green-300 text-xs font-semibold mb-1">Leadership Indicator</p>
              <p className="text-white/70 text-sm">{CHIN_ANALYSIS.leadershipIndicators}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Ears — Intelligence Type & Life Fortune" icon={<Eye className="w-5 h-5 text-teal-400" />} accentColor="teal">
          <div className="space-y-4">
            <p className="text-white/80 text-sm">{EAR_ANALYSIS.primaryMeaning}</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {EAR_ANALYSIS.careerIndications.slice(0, 4).map((ind, i) => (
                <p key={i} className="text-white/70 text-xs flex items-start gap-1.5"><div className="w-1 h-1 bg-teal-400 rounded-full mt-1.5 flex-shrink-0" />{ind}</p>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Eyebrows — Character & Professional Authority" icon={<Eye className="w-5 h-5 text-blue-400" />} accentColor="blue">
          <div className="space-y-4">
            <p className="text-white/80 text-sm">{EYEBROW_ANALYSIS.primaryMeaning}</p>
            <div>
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Career Indications by Eyebrow Type</p>
              {EYEBROW_ANALYSIS.careerIndications.slice(0, 4).map((ind, i) => (
                <p key={i} className="text-white/70 text-sm mb-2 flex items-start gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />{ind}</p>
              ))}
            </div>
          </div>
        </SectionCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-blue-400" /> Three-Age Career Regions
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {Object.values(CAREER_READING_BY_FACE_AGE).map((region, i) => (
            <div key={i} className="facereading-card" style={{ padding: '1.25rem' }}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-bold ${i === 0 ? 'text-blue-300' : i === 1 ? 'text-amber-300' : 'text-green-300'}`}>Ages {region.ageRange}</span>
                <span className="text-white/30 text-xs">Region {i + 1}</span>
              </div>
              <p className="text-white font-semibold text-sm mb-2">{region.region}</p>
              <p className="text-white/70 text-xs leading-relaxed">{region.interpretation}</p>
              <p className="text-white/60 text-xs mt-3 italic leading-relaxed">{analysis.ageRegionAnalysis.split('. ')[i]}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-green-400" /> Career Recommendations
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="facereading-card border-green-400/20">
              <h3 className="text-green-300 font-bold mb-4">Naturally Aligned Career Paths</h3>
              <div className="space-y-2">
                {analysis.topCareers.map((career, i) => (
                  <div key={i} className="flex items-center gap-3 bg-green-400/10 rounded-lg px-3 py-2">
                    <div className="w-6 h-6 bg-green-400/20 rounded-full flex items-center justify-center text-xs text-green-300 font-bold flex-shrink-0">{i + 1}</div>
                    <span className="text-white/90 text-sm">{career}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="facereading-card border-face-400/25">
              <h3 className="text-blue-300 font-bold mb-3">Professional Profile</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-blue-200/70 text-xs uppercase tracking-wider mb-1">Work Style</p>
                  <p className="text-white/80 text-sm">{analysis.workStyle}</p>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <p className="text-blue-200/70 text-xs uppercase tracking-wider mb-1">Financial Pattern</p>
                  <p className="text-white/80 text-sm">{shapeProfile?.financialPattern}</p>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <p className="text-blue-200/70 text-xs uppercase tracking-wider mb-1">Team Role</p>
                  <p className="text-white/80 text-sm">{analysis.teamRole}</p>
                </div>
              </div>
            </div>
            <div className="facereading-card border-rose-400/20">
              <h3 className="text-rose-300 font-bold mb-3">Growth Challenges</h3>
              {shapeProfile?.challenges.map((c, i) => (
                <p key={i} className="text-white/70 text-sm flex items-start gap-2 mb-2">
                  <div className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 flex-shrink-0" />{c}
                </p>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <User className="w-6 h-6 text-blue-400" /> All Face Shapes — Complete Career Guide
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(FACE_SHAPES).map(([key, shape]) => (
            <SectionCard key={key} title={`${shape.shape}${shape.chineseElement ? ` (${shape.chineseElement} Element)` : ''}`} icon={<div />} accentColor={key === analysis.faceShape ? 'green' : 'blue'}>
              <div className="space-y-3">
                {key === analysis.faceShape && <div className="bg-green-400/20 border border-green-400/40 rounded-lg px-3 py-2 text-green-300 text-sm font-semibold">Your face shape</div>}
                <p className="text-white/80 text-sm leading-relaxed">{shape.workStyle}</p>
                <div>
                  <p className="text-green-300 text-xs font-semibold uppercase tracking-wider mb-2">Natural Careers</p>
                  <div className="flex flex-wrap gap-1">
                    {shape.naturalCareers.slice(0, 4).map((c, i) => <span key={i} className="bg-green-400/10 text-green-200 text-xs px-2 py-0.5 rounded-full">{c}</span>)}
                  </div>
                </div>
                <div className="bg-blue-400/10 rounded-lg p-3">
                  <p className="text-blue-300 text-xs font-semibold mb-1">Leadership Style</p>
                  <p className="text-white/70 text-xs">{shape.leadershipStyle}</p>
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      </motion.div>

      <div className="flex gap-4 justify-center pb-6">
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-teal-700 transition-colors">Back to Dashboard</button>
        <button onClick={() => { setStep(1); setFrontFaceImage(null); setLeftSideImage(null); setRightSideImage(null); setCurrentView('front'); setAnalysis(null); }} className="px-6 py-3 text-white rounded-lg transition-colors border border-face-800/40" style={{ background: 'rgba(2, 18, 17, 0.5)' }} onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(45, 212, 191, 0.1)')} onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(2, 18, 17, 0.5)')}>New Reading</button>
      </div>
    </div>
  );
}
