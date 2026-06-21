import { useState, useRef, useEffect } from 'react';
import { useCameraCapture } from '../hooks/useCameraCapture';
import { motion } from 'framer-motion';
import { Camera, Upload, Hand, Scan, CheckCircle } from 'lucide-react';
import { CapturedPhotoPreview, SavedPhotoThumb } from './CapturedPhotoPreview';
import { ReadingResultsView } from './ReadingResultsView';
import { compressImage, isBase64Image, storePalmImages } from '../utils/imageUtils';
import { analyzeAndSavePalm } from '../utils/readingsApi';
import { parseApiError } from '../utils/apiErrors';
import { useNavigate } from 'react-router-dom';

export function PalmReading() {
  const navigate = useNavigate();
  const [leftPalmImage, setLeftPalmImage] = useState<string | null>(null);
  const [rightPalmImage, setRightPalmImage] = useState<string | null>(null);
  const [currentPalm, setCurrentPalm] = useState<'left' | 'right'>('left');
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
  } = useCameraCapture('environment');

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
      alert('Could not capture palm image. Please try again.');
    }
  };

  const confirmPendingPhoto = () => {
    if (!pendingPreview) return;

    if (currentPalm === 'left') {
      setLeftPalmImage(pendingPreview);
      setPendingPreview(null);
      setCurrentPalm('right');
    } else {
      setRightPalmImage(pendingPreview);
      setPendingPreview(null);
      setStep(2);
    }
  };

  const discardPendingPhoto = () => {
    setPendingPreview(null);
  };

  const removeLeftPalm = () => {
    setLeftPalmImage(null);
    setCurrentPalm('left');
    setPendingPreview(null);
  };

  const removeRightPalm = () => {
    setRightPalmImage(null);
    setCurrentPalm('right');
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

  const analyzePalm = async () => {
    if (!leftPalmImage || !rightPalmImage) {
      alert('Please upload both left and right palm photos before starting analysis.');
      return;
    }
    if (!isBase64Image(leftPalmImage) || !isBase64Image(rightPalmImage)) {
      alert('Palm images must be saved before analysis. Please retake your photos.');
      return;
    }
    setIsAnalyzing(true);
    try {
      const images = { left: leftPalmImage, right: rightPalmImage };
      const result = await analyzeAndSavePalm(images);
      storePalmImages(images);
      setAnalysis(result as Record<string, unknown>);
      setStep(3);
    } catch (error) {
      console.error('Palm analysis failed:', error);
      const { title, message } = parseApiError(error);
      alert(`${title}: ${message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

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
            {(leftPalmImage || rightPalmImage) && (
              <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
                {leftPalmImage && (
                  <div className="flex items-center gap-2">
                    <SavedPhotoThumb image={leftPalmImage} label="Left palm" onRemove={removeLeftPalm} />
                    <span className="text-green-300 text-sm font-medium">Left palm</span>
                  </div>
                )}
                {rightPalmImage && (
                  <div className="flex items-center gap-2">
                    <SavedPhotoThumb image={rightPalmImage} label="Right palm" onRemove={removeRightPalm} />
                    <span className="text-green-300 text-sm font-medium">Right palm</span>
                  </div>
                )}
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
              {pendingPreview ? (
                <CapturedPhotoPreview
                  image={pendingPreview}
                  title={`${currentPalm === 'left' ? 'Left' : 'Right'} palm preview`}
                  onConfirm={confirmPendingPhoto}
                  onRetake={discardPendingPhoto}
                  confirmLabel="Use This Photo"
                  accent="amber"
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
                      <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-amber-200 text-sm">
                        Starting camera…
                      </div>
                    )}
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="flex gap-3">
                    <button
                      onClick={handleCapturePhoto}
                      disabled={!isVideoReady}
                      className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Capture Photo
                    </button>
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

  if (step === 3 && analysis) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="palmistry-card-amber p-6">
          <div className="text-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          </div>
          <ReadingResultsView
            title="Palm Reading Complete"
            subtitle="Hasta Samudrika Shastra — AI Career Analysis"
            analysis={analysis}
            images={[
              { label: 'Left Palm', src: leftPalmImage! },
              { label: 'Right Palm', src: rightPalmImage! },
            ]}
            accent="amber"
          />
        </motion.div>
        <div className="flex gap-4 justify-center pb-6">
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-teal-700 transition-colors">Back to Dashboard</button>
          <button onClick={() => { setStep(1); setLeftPalmImage(null); setRightPalmImage(null); setCurrentPalm('left'); setAnalysis(null); }} className="px-6 py-3 text-white rounded-lg transition-colors border border-palm-800/40" style={{ background: 'rgba(30, 10, 2, 0.5)' }}>New Reading</button>
        </div>
      </div>
    );
  }

  return null;
}
