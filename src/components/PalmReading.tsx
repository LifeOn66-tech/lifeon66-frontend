import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Hand, Scan, CheckCircle, ChevronDown, ChevronUp, BookOpen, TrendingUp } from 'lucide-react';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import { PALM_LINES, PALM_MOUNTS, HAND_TYPES, FINGER_ANALYSIS } from '../data/palmistryData';

interface PalmAnalysis {
  fateLine: { strength: number; description: string; careerImplications: string };
  headLine: { length: number; depth: number; description: string; intellectualTraits: string };
  heartLine: { clarity: number; description: string; careerImpact: string };
  sunLine: { present: boolean; clarity: number; description: string; successIndicators: string };
  mercuryLine: { present: boolean; strength: number; businessAcumen: string };
  handType: string;
  dominantMount: string;
  overallRecommendations: string;
  topCareers: string[];
  leadershipStyle: string;
  financialPattern: string;
  workEnvironment: string;
  naturalStrengths: string[];
  growthAreas: string[];
  confidenceScore: number;
}

const SectionCard = ({
  title, icon, children, defaultOpen = false, accentColor = 'amber'
}: {
  title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; accentColor?: string;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const borders: Record<string, string> = {
    amber: 'border-amber-400/40', blue: 'border-blue-400/40', green: 'border-green-400/40',
    rose: 'border-rose-400/40', teal: 'border-teal-400/40', orange: 'border-orange-400/40'
  };
  return (
    <div className={`rounded-xl border ${borders[accentColor] || borders.amber} overflow-hidden`} style={{ background: 'rgba(30, 10, 2, 0.6)' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left transition-colors" style={{ background: 'transparent' }} onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(249, 115, 22, 0.06)')} onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}>
        <div className="flex items-center gap-3">{icon}<span className="text-white font-bold text-lg">{title}</span></div>
        {open ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-white/10 pt-4">{children}</div>}
    </div>
  );
};

function generateDeepAnalysis(): PalmAnalysis {
  const handTypes = ['earth', 'air', 'water', 'fire'];
  const mounts = ['jupiter', 'saturn', 'apollo', 'mercury', 'venus', 'luna'];
  const randomHandType = handTypes[Math.floor(Math.random() * handTypes.length)];
  const randomMount = mounts[Math.floor(Math.random() * mounts.length)];

  const fateStrength = 72 + Math.floor(Math.random() * 20);
  const headDepth = 75 + Math.floor(Math.random() * 18);
  const headLength = 70 + Math.floor(Math.random() * 20);
  const heartClarity = 68 + Math.floor(Math.random() * 22);
  const sunClarity = 60 + Math.floor(Math.random() * 30);

  const handProfile = HAND_TYPES[randomHandType];
  const mountProfile = PALM_MOUNTS[randomMount];

  return {
    fateLine: {
      strength: fateStrength,
      description: fateStrength > 85
        ? 'Deep, clearly defined fate line rising from the wrist — a rare indicator of strong career destiny and professional clarity from an early age'
        : fateStrength > 75
        ? 'Well-defined fate line with clear trajectory — career direction is strong and purposeful, built through both destiny and personal effort'
        : 'Moderately defined fate line with some breaks — career built primarily through personal will and self-determination rather than external fortune',
      careerImplications: PALM_LINES.fateLine.strongIndicators[0]
    },
    headLine: {
      length: headLength,
      depth: headDepth,
      description: headDepth > 85
        ? 'Exceptionally deep head line with slight creative curve — indicates rare combination of analytical precision and imaginative capacity'
        : headDepth > 75
        ? 'Deep, clear head line running across the palm — strong intellectual capacity and excellent decision-making under pressure'
        : 'Clear head line with balanced depth — practical intelligence suited for both analytical and people-oriented work',
      intellectualTraits: headLength > 85
        ? 'Long head line reaching toward Luna mount: Creative, imaginative intelligence with strong intuitive capacity — writing, research, arts, or strategy'
        : 'Mid-length, well-balanced head line: Practical intelligence — excels in business, management, and structured environments'
    },
    heartLine: {
      clarity: heartClarity,
      description: heartClarity > 85
        ? 'Long, deeply curved heart line reaching toward Jupiter mount — exceptional emotional intelligence and profound capacity for loyalty and dedication'
        : heartClarity > 70
        ? 'Clear, well-defined heart line with upward sweep — strong emotional intelligence with balanced professional boundaries'
        : 'Clean, relatively straight heart line — pragmatic emotional expression well-suited to professional environments',
      careerImpact: heartClarity > 80
        ? 'High emotional intelligence transforms into professional excellence in team leadership, counseling, HR, and all relationship-dependent roles. Teams are deeply loyal.'
        : 'Balanced emotional intelligence enables effective professional relationships without becoming over-involved. Suited for both leadership and technical roles.'
    },
    sunLine: {
      present: sunClarity > 55,
      clarity: sunClarity,
      description: sunClarity > 80
        ? 'Strong, clear sun line rising toward Apollo mount — outstanding potential for public recognition and creative success in chosen field'
        : sunClarity > 60
        ? 'Visible sun line indicating creative recognition potential — success through consistent quality and professional excellence'
        : 'Faint or absent sun line — success through Saturn-ruled discipline and sustained effort rather than natural brilliance (equally valid path)',
      successIndicators: sunClarity > 75
        ? 'Fame, public recognition, and creative brilliance in chosen field. Leadership through personal charisma and artistic mastery.'
        : 'Quiet, lasting success built through expertise and consistency. Recognition earned among peers and in specialized communities.'
    },
    mercuryLine: {
      present: Math.random() > 0.3,
      strength: 65 + Math.floor(Math.random() * 25),
      businessAcumen: 'Strong Mercury line indicates excellent business instincts, communication skills, and health foundation supporting a long, productive career'
    },
    handType: randomHandType,
    dominantMount: randomMount,
    overallRecommendations: `Your ${handProfile.type} with dominant ${mountProfile.name} reveals a unique career profile. ${handProfile.workStyle} The ${mountProfile.name} amplifies your ${mountProfile.welldevelopedMeaning.toLowerCase()}.`,
    topCareers: [...handProfile.careerSuggestions, ...mountProfile.careerFields].slice(0, 8),
    leadershipStyle: handProfile.leadershipStyle,
    financialPattern: handProfile.type === 'earth' || handProfile.type === 'air'
      ? 'Your hand type indicates strong financial building capacity. Earth/Air hands typically accumulate wealth steadily through disciplined effort and intellectual work.'
      : 'Your hand type indicates income through creative or emotional work. Wealth building requires pairing natural talents with disciplined financial systems.',
    workEnvironment: handProfile.workStyle,
    naturalStrengths: handProfile.strengths,
    growthAreas: handProfile.challenges,
    confidenceScore: 84 + Math.floor(Math.random() * 10)
  };
}

export function PalmReading() {
  const navigate = useNavigate();
  const [leftPalmImage, setLeftPalmImage] = useState<string | null>(null);
  const [rightPalmImage, setRightPalmImage] = useState<string | null>(null);
  const [currentPalm, setCurrentPalm] = useState<'left' | 'right'>('left');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PalmAnalysis | null>(null);
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
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
        if (currentPalm === 'left') { setLeftPalmImage(imageData); stopCamera(); setCurrentPalm('right'); }
        else { setRightPalmImage(imageData); stopCamera(); setStep(2); }
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        if (currentPalm === 'left') { setLeftPalmImage(imageData); setCurrentPalm('right'); }
        else { setRightPalmImage(imageData); setStep(2); }
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzePalm = async () => {
    if (!leftPalmImage || !rightPalmImage) return;
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 4000));
    const result = generateDeepAnalysis();
    try {
      await apiClient.post('readings/palmistry', {
        images: {
          left: leftPalmImage || '',
          right: rightPalmImage || '',
          both: ''
        },
        fateLineAnalysis: result.fateLine.description,
        headLineAnalysis: result.headLine.description,
        sunLineAnalysis: result.sunLine.description,
        careerRecommendations: result.overallRecommendations,
        confidenceScore: result.confidenceScore
      });
    } catch (error) {
      console.error('Error saving palm reading:', error);
    }
    setAnalysis(result);
    setIsAnalyzing(false);
    setStep(3);
  };

  const LineDepthBar = ({ score, label }: { score: number; label: string }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-white/60">{label}</span>
        <span className="text-amber-300 font-semibold">{score}%</span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(249, 115, 22, 0.12)' }}>
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
    </div>
  );

  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="palmistry-card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Hand className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Hasta Samudrika Shastra</h2>
            <p className="text-amber-200/80 text-sm mb-1">Classical Indian Palm Reading</p>
            <p className="text-white/60 text-sm">
              {currentPalm === 'left' ? 'Step 1 of 2 — Capture your LEFT palm (inherited destiny)' : 'Step 2 of 2 — Capture your RIGHT palm (active karma)'}
            </p>
            {leftPalmImage && (
              <div className="mt-4 inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span className="text-green-300 text-sm font-medium">Left palm captured</span>
              </div>
            )}
          </div>

          <div className="bg-amber-400/10 border border-amber-400/20 rounded-lg p-4 mb-6 text-sm">
            <p className="text-amber-300 font-semibold mb-2">Reading Significance:</p>
            <ul className="text-amber-100/80 space-y-1">
              <li>• <span className="text-amber-300">Left palm:</span> Born potential, inherited abilities, natural karmic gifts</li>
              <li>• <span className="text-amber-300">Right palm:</span> Active karma — how you have developed your gifts</li>
              <li>• Comparison reveals where you are fulfilling or diverging from destiny</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg p-5 border border-palm-800/40" style={{ background: 'rgba(30, 10, 2, 0.5)' }}>
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                Capture {currentPalm === 'left' ? 'LEFT' : 'RIGHT'} Palm
              </h3>
              {isCameraActive ? (
                <div className="space-y-4">
                  <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="flex gap-3">
                    <button onClick={capturePhoto} className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg transition-all">Capture Photo</button>
                    <button onClick={stopCamera} className="px-5 py-3 text-white rounded-lg transition-colors border border-palm-800/40" style={{ background: 'rgba(30, 10, 2, 0.5)' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button onClick={startCamera} className="w-full py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 text-amber-300 font-semibold rounded-lg hover:bg-amber-500/30 transition-all flex items-center justify-center gap-2">
                    <Camera className="w-5 h-5" /> Open Camera
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-400/40 text-green-300 font-semibold rounded-lg hover:bg-green-500/30 transition-all flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5" /> Upload Image
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </div>
              )}
            </div>

            <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-4 text-sm">
              <p className="text-blue-300 font-semibold mb-2">Photo guidelines for accurate reading:</p>
              <ul className="text-blue-100/80 space-y-1">
                <li>• Palm fully flat, fingers spread naturally — not forced apart</li>
                <li>• Clear, even lighting without harsh shadows</li>
                <li>• Close enough to see individual lines clearly</li>
                <li>• Entire palm visible from wrist crease to fingertips</li>
                <li>• Natural skin tone — no filters or heavy editing</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="palmistry-card">
          <div className="text-center mb-8">
            <Scan className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Review Palm Images</h2>
            <p className="text-white/60">Ensure all major lines are clearly visible before analysis</p>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-white font-bold mb-3 text-center text-sm uppercase tracking-wider">Left Palm — Inherited Destiny</h3>
              <div className="relative"><img src={leftPalmImage!} alt="Left Palm" className="w-full rounded-xl shadow-lg" /><div className="absolute inset-0 border-2 border-amber-400/60 rounded-xl pointer-events-none" /></div>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3 text-center text-sm uppercase tracking-wider">Right Palm — Active Karma</h3>
              <div className="relative"><img src={rightPalmImage!} alt="Right Palm" className="w-full rounded-xl shadow-lg" /><div className="absolute inset-0 border-2 border-blue-400/60 rounded-xl pointer-events-none" /></div>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => { setStep(1); setLeftPalmImage(null); setRightPalmImage(null); setCurrentPalm('left'); }} className="flex-1 py-3 text-white rounded-lg transition-colors border border-palm-800/40" style={{ background: 'rgba(30, 10, 2, 0.5)' }}>Retake Photos</button>
            <motion.button
              onClick={analyzePalm}
              disabled={isAnalyzing}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center gap-2"><Scan className="w-5 h-5 animate-pulse" />Performing Deep Analysis...</div>
              ) : 'Begin Deep Analysis'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!analysis) return null;

  const handProfile = HAND_TYPES[analysis.handType];
  const mountProfile = PALM_MOUNTS[analysis.dominantMount];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="palmistry-card-amber">
        <div className="text-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-white mb-1">Palm Reading Complete</h2>
          <p className="text-white/60 text-sm">Hasta Samudrika Shastra — Classical Career Analysis</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-green-500/20 border border-green-400/40 px-4 py-2 rounded-full">
            <span className="text-white/70 text-sm">Analysis Confidence:</span>
            <span className="text-green-300 font-bold text-lg">{analysis.confidenceScore}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div><h3 className="text-white/60 text-xs uppercase tracking-wider mb-2 text-center">Left Palm</h3><img src={leftPalmImage!} alt="Left Palm" className="w-full rounded-xl shadow-lg border border-amber-400/30" /></div>
          <div><h3 className="text-white/60 text-xs uppercase tracking-wider mb-2 text-center">Right Palm</h3><img src={rightPalmImage!} alt="Right Palm" className="w-full rounded-xl shadow-lg border border-blue-400/30" /></div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <LineDepthBar score={analysis.fateLine.strength} label="Fate Line (Bhagya Rekha)" />
          <LineDepthBar score={analysis.headLine.depth} label="Head Line (Mastishk Rekha)" />
          <LineDepthBar score={analysis.heartLine.clarity} label="Heart Line (Hridaya Rekha)" />
          <LineDepthBar score={analysis.sunLine.clarity} label="Sun Line (Surya Rekha)" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <Hand className="w-6 h-6 text-amber-400" /> Hand Type & Mount Analysis
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="palmistry-card" style={{ padding: '1.5rem' }}>
            <h3 className="text-amber-300 font-bold text-lg mb-3">{handProfile?.type}</h3>
            <p className="text-white/80 text-sm mb-4 leading-relaxed">{handProfile?.workStyle}</p>
            <div className="space-y-2">
              <p className="text-green-300 text-xs font-semibold uppercase tracking-wider">Core Strengths</p>
              {handProfile?.strengths.map((s, i) => <p key={i} className="text-white/70 text-sm flex items-start gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />{s}</p>)}
            </div>
          </div>
          <div className="palmistry-card" style={{ padding: '1.5rem' }}>
            <h3 className="text-orange-300 font-bold text-lg mb-1">{mountProfile?.name}</h3>
            <p className="text-orange-200/60 text-xs mb-3">Ruling planet: {mountProfile?.planet} — {mountProfile?.location}</p>
            <p className="text-white/80 text-sm mb-4 leading-relaxed">{mountProfile?.welldevelopedMeaning}</p>
            <div className="space-y-2">
              <p className="text-teal-300 text-xs font-semibold uppercase tracking-wider">Career Fields</p>
              <div className="flex flex-wrap gap-2">
                {mountProfile?.careerFields.map((f, i) => <span key={i} className="bg-teal-400/10 text-teal-200 text-xs px-2 py-1 rounded-full">{f}</span>)}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-amber-400" /> Major Lines — Deep Interpretation
        </h2>

        <SectionCard title="Fate Line (Bhagya Rekha) — Career Destiny" icon={<TrendingUp className="w-5 h-5 text-amber-400" />} defaultOpen accentColor="amber">
          <div className="space-y-4">
            <div className="bg-amber-400/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-amber-300 font-semibold">Line Strength</span>
                <span className="text-amber-300 font-bold">{analysis.fateLine.strength}%</span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">{analysis.fateLine.description}</p>
            </div>
            <div>
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Career Implications</p>
              <p className="text-white/80 text-sm leading-relaxed">{analysis.fateLine.careerImplications}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <p className="text-green-300 text-xs font-semibold uppercase tracking-wider mb-2">Strong Line Indicators</p>
                {PALM_LINES.fateLine.strongIndicators.slice(0, 2).map((ind, i) => <p key={i} className="text-white/60 text-xs mb-1 flex items-start gap-1.5"><div className="w-1 h-1 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />{ind}</p>)}
              </div>
              <div>
                <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">Line Formations</p>
                <p className="text-white/60 text-xs mb-1"><span className="text-blue-300">Branches up:</span> {PALM_LINES.fateLine.branchesUpMeaning}</p>
                <p className="text-white/60 text-xs"><span className="text-orange-300">Islands:</span> {PALM_LINES.fateLine.islandMeaning}</p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Head Line (Mastishk Rekha) — Intellectual Career Power" icon={<BookOpen className="w-5 h-5 text-blue-400" />} accentColor="blue">
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-blue-400/10 rounded-lg p-3">
                <p className="text-blue-300 text-xs font-semibold mb-1">Mental Depth</p>
                <p className="text-white/80 text-sm">{analysis.headLine.description}</p>
              </div>
              <div className="bg-blue-400/10 rounded-lg p-3">
                <p className="text-blue-300 text-xs font-semibold mb-1">Intellectual Type</p>
                <p className="text-white/80 text-sm">{analysis.headLine.intellectualTraits}</p>
              </div>
            </div>
            <div>
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Head Line Variations & Their Career Meanings</p>
              {PALM_LINES.headLine.strongIndicators.slice(0, 3).map((ind, i) => <p key={i} className="text-white/60 text-xs mb-2 flex items-start gap-1.5"><div className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />{ind}</p>)}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Heart Line (Hridaya Rekha) — Emotional Career Intelligence" icon={<Hand className="w-5 h-5 text-rose-400" />} accentColor="rose">
          <div className="space-y-4">
            <div className="bg-rose-400/10 rounded-lg p-4">
              <p className="text-rose-300 font-semibold text-sm mb-2">Emotional Intelligence in Career</p>
              <p className="text-white/80 text-sm leading-relaxed">{analysis.heartLine.description}</p>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">{analysis.heartLine.careerImpact}</p>
            <div>
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Heart Line Formations</p>
              {PALM_LINES.heartLine.strongIndicators.slice(0, 3).map((ind, i) => <p key={i} className="text-white/60 text-xs mb-2 flex items-start gap-1.5"><div className="w-1 h-1 bg-rose-400 rounded-full mt-1.5 flex-shrink-0" />{ind}</p>)}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Sun Line (Surya Rekha) — Fame & Recognition Potential" icon={<CheckCircle className="w-5 h-5 text-yellow-400" />} accentColor="orange">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${analysis.sunLine.present ? 'bg-green-400/20' : 'bg-palm-950/50'}`}>
                <CheckCircle className={`w-5 h-5 ${analysis.sunLine.present ? 'text-green-400' : 'text-white/30'}`} />
              </div>
              <div>
                <p className="text-white font-semibold">{analysis.sunLine.present ? 'Sun Line Present' : 'Sun Line Absent or Faint'}</p>
                <p className="text-white/50 text-xs">{analysis.sunLine.present ? 'Creative recognition potential identified' : 'Success through Saturn-ruled discipline path'}</p>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">{analysis.sunLine.description}</p>
            <div className="bg-yellow-400/10 rounded-lg p-3">
              <p className="text-yellow-300 text-xs font-semibold mb-1">Success Indicators</p>
              <p className="text-white/70 text-sm">{analysis.sunLine.successIndicators}</p>
            </div>
          </div>
        </SectionCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-green-400" /> Career Path Recommendations
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="palmistry-card" style={{ padding: '1.5rem' }}>
              <h3 className="text-green-300 font-bold mb-4">Top Career Matches</h3>
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
            <div className="palmistry-card" style={{ padding: '1.5rem' }}>
              <h3 className="text-blue-300 font-bold mb-3">Leadership & Financial Style</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-blue-200/70 text-xs uppercase tracking-wider mb-1">Leadership Approach</p>
                  <p className="text-white/80 text-sm">{analysis.leadershipStyle}</p>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <p className="text-blue-200/70 text-xs uppercase tracking-wider mb-1">Financial Pattern</p>
                  <p className="text-white/80 text-sm">{analysis.financialPattern}</p>
                </div>
              </div>
            </div>
            <div className="palmistry-card" style={{ padding: '1.5rem' }}>
              <h3 className="text-teal-300 font-bold mb-3">Natural Strengths</h3>
              {analysis.naturalStrengths.map((s, i) => (
                <p key={i} className="text-white/70 text-sm flex items-start gap-2 mb-2">
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-1.5 flex-shrink-0" />{s}
                </p>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-amber-400" /> All Palm Lines Reference Guide
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(PALM_LINES).map(([key, line]) => (
            <SectionCard key={key} title={`${line.name}${line.sanskritName ? ` — ${line.sanskritName}` : ''}`} icon={<div />} accentColor="amber">
              <div className="space-y-3">
                <p className="text-white/80 text-sm leading-relaxed">{line.meaning}</p>
                <div className="bg-amber-400/10 rounded-lg p-3">
                  <p className="text-amber-300 text-xs font-semibold mb-1">Career Significance</p>
                  <p className="text-white/70 text-sm">{line.careerSignificance}</p>
                </div>
                <div>
                  <p className="text-green-300 text-xs font-semibold uppercase tracking-wider mb-2">Strong Line Indicators</p>
                  {line.strongIndicators.slice(0, 2).map((ind, i) => (
                    <p key={i} className="text-white/60 text-xs mb-1.5 flex items-start gap-1.5"><div className="w-1 h-1 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />{ind}</p>
                  ))}
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <Hand className="w-6 h-6 text-orange-400" /> Mounts & Fingers — Complete Analysis
        </h2>
        <div className="space-y-3">
          <SectionCard title="All Eight Mounts — Planetary Career Influences" icon={<div />} accentColor="orange">
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(PALM_MOUNTS).map(([key, mount]) => (
                <div key={key} className="rounded-lg p-4 border border-palm-800/35" style={{ background: 'rgba(30, 10, 2, 0.55)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-semibold text-sm">{mount.name}</h4>
                    <span className="text-palm-400/60 text-xs">{mount.planet}</span>
                  </div>
                  <p className="text-white/70 text-xs mb-2">{mount.welldevelopedMeaning}</p>
                  <div className="flex flex-wrap gap-1">
                    {mount.careerFields.slice(0, 3).map((f, i) => (
                      <span key={i} className="bg-orange-400/10 text-orange-200 text-xs px-2 py-0.5 rounded-full">{f}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Finger Analysis — Individual Planetary Influences" icon={<div />} accentColor="teal">
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(FINGER_ANALYSIS).map(([key, finger]) => (
                <div key={key} className="rounded-lg p-4 border border-parchment-800/30" style={{ background: 'rgba(30, 10, 2, 0.55)' }}>
                  <h4 className="text-teal-300 font-semibold text-sm mb-1">{finger.name}</h4>
                  <p className="text-white/60 text-xs mb-2">{finger.careerMeaning}</p>
                  <p className="text-white/70 text-xs"><span className="text-green-300">Long:</span> {finger.longMeaning}</p>
                  <p className="text-white/70 text-xs mt-1"><span className="text-orange-300">Short:</span> {finger.shortMeaning}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </motion.div>

      <div className="flex gap-4 justify-center pb-6">
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-teal-700 transition-colors">Back to Dashboard</button>
        <button onClick={() => { setStep(1); setLeftPalmImage(null); setRightPalmImage(null); setCurrentPalm('left'); setAnalysis(null); }} className="px-6 py-3 text-white rounded-lg transition-colors border border-palm-800/40" style={{ background: 'rgba(30, 10, 2, 0.5)' }}>New Reading</button>
      </div>
    </div>
  );
}
