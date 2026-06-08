import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

type FacingMode = 'user' | 'environment';

interface CameraStreamResult {
  stream: MediaStream;
  usedFallback: boolean;
}

function getTrackInfo(stream: MediaStream) {
  const track = stream.getVideoTracks()[0];
  const settings = track?.getSettings() ?? {};
  const label = track?.label?.toLowerCase() ?? '';
  return { facing: settings.facingMode as string | undefined, label };
}

function isRearCamera(facing?: string, label?: string) {
  if (facing === 'environment') return true;
  if (!label) return false;
  return /back|rear|environment|trás|arka|后置|wide angle|camera2/i.test(label)
    && !/front|user|selfie|facetime|face time/i.test(label);
}

/**
 * Flip preview + capture horizontally unless this is a confirmed rear camera.
 * Webcams and front cameras need flip so left/right match what users expect.
 */
function shouldMirrorStream(stream: MediaStream): boolean {
  const { facing, label } = getTrackInfo(stream);
  return !isRearCamera(facing, label);
}

async function requestCameraStream(facingMode: FacingMode): Promise<CameraStreamResult> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: facingMode },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });
    return { stream, usedFallback: false };
  } catch {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    return { stream, usedFallback: true };
  }
}

export function useCameraCapture(facingMode: FacingMode = 'user') {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mirroredRef = useRef(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [mirrored, setMirrored] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoClassName = mirrored
    ? 'w-full h-full object-cover transform scale-x-[-1]'
    : 'w-full h-full object-cover';

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    mirroredRef.current = false;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setMirrored(false);
    setIsCameraActive(false);
    setIsVideoReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera is not supported in this browser. Please upload an image instead.');
      return;
    }

    try {
      stopCamera();
      const { stream } = await requestCameraStream(facingMode);
      const useMirror = shouldMirrorStream(stream);
      streamRef.current = stream;
      mirroredRef.current = useMirror;
      setMirrored(useMirror);
      setIsCameraActive(true);
    } catch {
      setError('Unable to access camera. Please allow camera permission or upload an image instead.');
    }
  }, [facingMode, stopCamera]);

  useLayoutEffect(() => {
    if (!isCameraActive || !streamRef.current) return;

    let disposed = false;
    let removeMetaListener: (() => void) | undefined;
    let retryTimer: number | undefined;

    const bindStream = () => {
      const video = videoRef.current;
      if (!video || !streamRef.current || disposed) return false;

      video.srcObject = streamRef.current;
      video.muted = true;
      setIsVideoReady(false);

      const onLoadedMetadata = () => setIsVideoReady(true);
      video.addEventListener('loadedmetadata', onLoadedMetadata);
      removeMetaListener = () => video.removeEventListener('loadedmetadata', onLoadedMetadata);

      void video.play().catch(() => {
        if (!disposed) {
          setError('Could not start camera preview. Please try again or upload an image.');
        }
      });

      return true;
    };

    if (!bindStream()) {
      retryTimer = window.setTimeout(() => bindStream(), 0);
    }

    return () => {
      disposed = true;
      if (retryTimer) window.clearTimeout(retryTimer);
      removeMetaListener?.();
    };
  }, [isCameraActive]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const capturePhoto = useCallback(async (): Promise<string | null> => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    if (!video.videoWidth || !video.videoHeight) {
      setError('Camera is still loading. Please wait a moment and try again.');
      return null;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (mirroredRef.current) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.85);
  }, []);

  return {
    videoRef,
    canvasRef,
    videoClassName,
    isCameraActive,
    isVideoReady,
    error,
    startCamera,
    stopCamera,
    capturePhoto,
    clearError: () => setError(null),
  };
}
