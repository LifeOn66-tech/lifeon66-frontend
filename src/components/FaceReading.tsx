import { useState, useRef, useEffect } from 'react';
import { useCameraCapture } from '../hooks/useCameraCapture';
import { motion } from 'framer-motion';
import { Camera, Upload, User, Brain, CheckCircle } from 'lucide-react';
import { CapturedPhotoPreview, SavedPhotoThumb } from './CapturedPhotoPreview';
import { ReadingResultsView } from './ReadingResultsView';
import { compressImage, isBase64Image, storeFaceImages } from '../utils/imageUtils';
import { analyzeAndSaveFace } from '../utils/readingsApi';
import { parseApiError } from '../utils/apiErrors';
import { useNavigate } from 'react-router-dom';

export function FaceReading() {
  const navigate = useNavigate();
  const [frontFaceImage, setFrontFaceImage] = useState<string | null>(null);
  const [leftSideImage, setLeftSideImage] = useState<string | null>(null);
  const [rightSideImage, setRightSideImage] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'front' | 'left' | 'right'>('front');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Record<string, unknown> | null>(null);
  const [step, setStep] = useState(1);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    videoRef,
    canvasRef,
    videoClassName,
    isCameraActive,
    isVideoReady,
    error: cameraError,
    startCamera,
    stopCamera,
    capturePhoto,
    clearError: clearCameraError,
  } = useCameraCapture('user');

  useEffect(() => {
    if (cameraError) {
      alert(cameraError);
      clearCameraError();
    }
  }, [cameraError, clearCameraError]);

  const handleCapturePhoto = async () => {
    try {
      const rawImage = await capturePhoto();
      if (!rawImage) return;

      const imageData = await compressImage(rawImage);
      stopCamera();
      setPendingPreview(imageData);
    } catch {
      alert('Could not capture face image. Please try again.');
    }
  };

  const confirmPendingPhoto = () => {
    if (!pendingPreview) return;

    if (currentView === 'front') {
      setFrontFaceImage(pendingPreview);
      setPendingPreview(null);
      setCurrentView('left');
    } else if (currentView === 'left') {
      setLeftSideImage(pendingPreview);
      setPendingPreview(null);
      setCurrentView('right');
    } else {
      setRightSideImage(pendingPreview);
      setPendingPreview(null);
      setStep(2);
    }
  };

  const discardPendingPhoto = () => {
    setPendingPreview(null);
  };

  const removeFrontFace = () => {
    setFrontFaceImage(null);
    setCurrentView('front');
    setPendingPreview(null);
  };

  const removeLeftFace = () => {
    setLeftSideImage(null);
    setCurrentView('left');
    setPendingPreview(null);
  };

  const removeRightFace = () => {
    setRightSideImage(null);
    setCurrentView('right');
    setPendingPreview(null);
    setStep(1);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const rawImage = e.target?.result as string;
          if (!isBase64Image(rawImage)) {
            alert('Invalid image format. Please upload a JPEG or PNG file.');
            return;
          }
          const imageData = await compressImage(rawImage);
          stopCamera();
          setPendingPreview(imageData);
        } catch {
          alert('Could not process that image. Please try a different photo.');
        }
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  const analyzeFace = async () => {
    if (!frontFaceImage || !leftSideImage || !rightSideImage) {
      alert('Please upload front, left, and right face photos before starting analysis.');
      return;
    }
    if (!isBase64Image(frontFaceImage) || !isBase64Image(leftSideImage) || !isBase64Image(rightSideImage)) {
      alert('Face images must be saved before analysis. Please retake your photos.');
      return;
    }
    setIsAnalyzing(true);
    try {
      const images = {
        center: frontFaceImage,
        left: leftSideImage,
        right: rightSideImage,
      };
      const result = await analyzeAndSaveFace(images);
      storeFaceImages(images);
      setAnalysis(result as Record<string, unknown>);
      setStep(3);
    } catch (error) {
      console.error('Face analysis failed:', error);
      const { title, message } = parseApiError(error);
      alert(`${title}: ${message}`);
    } finally {
      setIsAnalyzing(false);
    }
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
            <p className="text-blue-200/80 text-sm mb-1">Classical Indian Face Reading â€” Physiognomy</p>
          </div>

          <div className="flex gap-3 mb-4">
            {progressSteps.map((s, i) => (
              <div key={s.view} className={`flex-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${s.captured ? 'bg-green-500/20 border border-green-400/40' : currentView === s.view ? 'bg-face-700/20 border border-face-400/40' : 'border border-face-800/20'}`} style={!s.captured && currentView !== s.view ? { background: 'rgba(2, 18, 17, 0.4)' } : {}}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${s.captured ? 'bg-green-400 text-white' : 'bg-face-800/60 text-white/60'}`}>{s.captured ? 'âœ“' : i + 1}</div>
                <span className={s.captured ? 'text-green-300' : currentView === s.view ? 'text-blue-300' : 'text-white/40'}>{s.label}</span>
              </div>
            ))}
          </div>

          {(frontFaceImage || leftSideImage || rightSideImage) && (
            <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
              {frontFaceImage && (
                <div className="flex flex-col items-center gap-1">
                  <SavedPhotoThumb image={frontFaceImage} label="Front view" onRemove={removeFrontFace} />
                  <span className="text-green-300 text-xs">Front</span>
                </div>
              )}
              {leftSideImage && (
                <div className="flex flex-col items-center gap-1">
                  <SavedPhotoThumb image={leftSideImage} label="Left profile" onRemove={removeLeftFace} />
                  <span className="text-green-300 text-xs">Left</span>
                </div>
              )}
              {rightSideImage && (
                <div className="flex flex-col items-center gap-1">
                  <SavedPhotoThumb image={rightSideImage} label="Right profile" onRemove={removeRightFace} />
                  <span className="text-green-300 text-xs">Right</span>
                </div>
              )}
            </div>
          )}

          <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-4 mb-6 text-sm">
            <p className="text-blue-300 font-semibold mb-1">Why three angles?</p>
            <ul className="text-blue-100/80 space-y-1 text-xs">
              <li>â€¢ <span className="text-blue-300">Front view:</span> Face shape, forehead, overall proportions, cheekbones</li>
              <li>â€¢ <span className="text-blue-300">Side profiles:</span> Nose structure, chin projection, forehead slope, ear position</li>
              <li>â€¢ All three views together enable precise feature assessment</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg p-5 border border-face-800/40" style={{ background: 'rgba(2, 18, 17, 0.5)' }}>
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-400" />
                Capture {currentView === 'front' ? 'FRONT View' : currentView === 'left' ? 'LEFT Profile' : 'RIGHT Profile'}
              </h3>
              <p className="text-white/50 text-xs mb-4">
                {currentView === 'front' && 'Face the camera directly â€” neutral expression, good front lighting'}
                {currentView === 'left' && 'Turn 90Â° to show your left profile â€” ear should be centered in frame'}
                {currentView === 'right' && 'Turn 90Â° to show your right profile â€” ear should be centered in frame'}
              </p>
              {pendingPreview ? (
                <CapturedPhotoPreview
                  image={pendingPreview}
                  title={
                    currentView === 'front'
                      ? 'Front view preview'
                      : currentView === 'left'
                        ? 'Left profile preview'
                        : 'Right profile preview'
                  }
                  onConfirm={confirmPendingPhoto}
                  onRetake={discardPendingPhoto}
                  confirmLabel="Use This Photo"
                  accent="blue"
                />
              ) : isCameraActive ? (
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-lg bg-black aspect-video">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={videoClassName}
                    />
                    {!isVideoReady && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-blue-200 text-sm">
                        Starting cameraâ€¦
                      </div>
                    )}
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="flex gap-3">
                    <button
                      onClick={handleCapturePhoto}
                      disabled={!isVideoReady}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Capture Photo
                    </button>
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


  if (step === 3 && analysis) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="facereading-card-cyan p-6">
          <div className="text-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          </div>
          <ReadingResultsView
            title="Face Reading Complete"
            subtitle="Saamudraka Shastra — AI Physiognomy Analysis"
            analysis={analysis}
            images={[
              { label: 'Front View', src: frontFaceImage! },
              { label: 'Left Profile', src: leftSideImage! },
              { label: 'Right Profile', src: rightSideImage! },
            ]}
            accent="blue"
          />
        </motion.div>
        <div className="flex gap-4 justify-center pb-6">
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-teal-700 transition-colors">Back to Dashboard</button>
          <button onClick={() => { setStep(1); setFrontFaceImage(null); setLeftSideImage(null); setRightSideImage(null); setCurrentView('front'); setAnalysis(null); }} className="px-6 py-3 text-white rounded-lg transition-colors border border-face-800/40" style={{ background: 'rgba(2, 18, 17, 0.5)' }}>New Reading</button>
        </div>
      </div>
    );
  }

  return null;
}
