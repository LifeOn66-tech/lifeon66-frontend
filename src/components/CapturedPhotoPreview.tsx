import { Check, X } from 'lucide-react';

interface CapturedPhotoPreviewProps {
  image: string;
  title: string;
  onConfirm: () => void;
  onRetake: () => void;
  confirmLabel?: string;
  accent?: 'amber' | 'blue';
}

const accentStyles = {
  amber: {
    confirm: 'bg-gradient-to-r from-amber-500 to-orange-500',
    border: 'border-amber-400/30',
    badge: 'text-amber-200',
  },
  blue: {
    confirm: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    border: 'border-blue-400/30',
    badge: 'text-blue-200',
  },
};

export function CapturedPhotoPreview({
  image,
  title,
  onConfirm,
  onRetake,
  confirmLabel = 'Use This Photo',
  accent = 'amber',
}: CapturedPhotoPreviewProps) {
  const styles = accentStyles[accent];

  return (
    <div className="space-y-4">
      <div className={`relative overflow-hidden rounded-lg border ${styles.border} bg-black aspect-video`}>
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={onRetake}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-red-500/80 transition-colors"
          aria-label="Remove photo and retake"
          title="Remove and retake"
        >
          <X className="w-5 h-5" />
        </button>
        <div className={`absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 text-xs font-medium ${styles.badge}`}>
          {title}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onConfirm}
          className={`flex-1 py-3 ${styles.confirm} text-white font-bold rounded-lg flex items-center justify-center gap-2`}
        >
          <Check className="w-5 h-5" />
          {confirmLabel}
        </button>
        <button
          type="button"
          onClick={onRetake}
          className="px-5 py-3 text-white rounded-lg transition-colors border border-white/15 bg-white/5 hover:bg-white/10"
        >
          Retake
        </button>
      </div>
    </div>
  );
}

interface SavedPhotoThumbProps {
  image: string;
  label: string;
  onRemove: () => void;
}

export function SavedPhotoThumb({ image, label, onRemove }: SavedPhotoThumbProps) {
  return (
    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-green-400/40 shrink-0">
      <img src={image} alt={label} className="w-full h-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/75 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
        aria-label={`Remove ${label}`}
        title={`Remove ${label}`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
