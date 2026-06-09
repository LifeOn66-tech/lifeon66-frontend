interface ReadingResultsViewProps {
  title: string;
  subtitle?: string;
  analysis: Record<string, unknown>;
  images?: Array<{ label: string; src: string }>;
  accent?: 'amber' | 'blue';
}

function renderValue(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map((item) => renderValue(item)).filter(Boolean).join(', ');
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
}

function flattenAnalysis(analysis: Record<string, unknown>) {
  const skip = new Set(['images', '_id', 'id', 'userId', 'createdAt', 'updatedAt', '__v']);
  return Object.entries(analysis)
    .filter(([key, value]) => !skip.has(key) && value != null && value !== '')
    .map(([key, value]) => ({
      key,
      label: key
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase()),
      value: renderValue(value),
    }))
    .filter((item) => item.value);
}

export function ReadingResultsView({
  title,
  subtitle,
  analysis,
  images = [],
  accent = 'amber',
}: ReadingResultsViewProps) {
  const fields = flattenAnalysis(analysis);
  const borderClass = accent === 'blue' ? 'border-blue-400/30' : 'border-amber-400/30';
  const badgeClass = accent === 'blue' ? 'text-blue-300' : 'text-amber-300';

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-1">{title}</h2>
        {subtitle && <p className="text-white/60 text-sm">{subtitle}</p>}
        {analysis.confidenceScore != null && (
          <div className="mt-3 inline-flex items-center gap-2 bg-green-500/20 border border-green-400/40 px-4 py-2 rounded-full">
            <span className="text-white/70 text-sm">Analysis Confidence:</span>
            <span className="text-green-300 font-bold text-lg">{String(analysis.confidenceScore)}%</span>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className={`grid gap-4 ${images.length > 1 ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {images.map((image) => (
            <div key={image.label}>
              <h3 className="text-white/60 text-xs uppercase tracking-wider mb-2 text-center">{image.label}</h3>
              <img src={image.src} alt={image.label} className={`w-full rounded-xl shadow-lg border ${borderClass}`} />
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4">
        {fields.map((field) => (
          <div key={field.key} className={`rounded-xl border ${borderClass} bg-white/5 p-5`}>
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${badgeClass}`}>{field.label}</h3>
            <p className="text-white/85 text-sm leading-relaxed whitespace-pre-wrap">{field.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
