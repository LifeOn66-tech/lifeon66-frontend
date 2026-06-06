export function isBase64Image(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.startsWith('data:image/');
}

export async function blobUrlToDataUrl(blobUrl: string): Promise<string> {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (isBase64Image(result)) {
        resolve(result);
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read blob image'));
    reader.readAsDataURL(blob);
  });
}

export async function ensureBase64Image(value: string | null | undefined): Promise<string | null> {
  if (!value) return null;
  if (isBase64Image(value)) return value;
  if (typeof value === 'string' && value.startsWith('blob:')) {
    try {
      return await blobUrlToDataUrl(value);
    } catch {
      return null;
    }
  }
  return null;
}

export async function sanitizeImageMap(
  images: Record<string, string | null | undefined>,
  keys: readonly string[]
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  for (const key of keys) {
    const base64 = await ensureBase64Image(images[key]);
    if (base64) {
      result[key] = base64;
    }
  }
  return result;
}

export const PALM_IMAGE_KEYS = ['left', 'right'] as const;
export const FACE_IMAGE_KEYS = ['center', 'left', 'right'] as const;

const STORAGE_KEYS = {
  palm: 'lifeon66_palm_images',
  face: 'lifeon66_face_images',
} as const;

export function storePalmImages(images: Record<string, string>) {
  sessionStorage.setItem(STORAGE_KEYS.palm, JSON.stringify(images));
}

export function storeFaceImages(images: Record<string, string>) {
  sessionStorage.setItem(STORAGE_KEYS.face, JSON.stringify(images));
}

function loadStoredImages(key: string): Record<string, string> | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, string>;
    return Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => isBase64Image(value))
    );
  } catch {
    return null;
  }
}

export async function resolvePalmImages(
  readingImages?: Record<string, string | null | undefined>
): Promise<Record<string, string>> {
  const stored = loadStoredImages(STORAGE_KEYS.palm) ?? {};
  const merged = { ...readingImages, ...stored };
  return sanitizeImageMap(merged, PALM_IMAGE_KEYS);
}

export async function resolveFaceImages(
  readingImages?: Record<string, string | null | undefined>
): Promise<Record<string, string>> {
  const stored = loadStoredImages(STORAGE_KEYS.face) ?? {};
  const merged = { ...readingImages, ...stored };
  return sanitizeImageMap(merged, FACE_IMAGE_KEYS);
}

export function countValidImages(images: Record<string, string>): number {
  return Object.values(images).filter(isBase64Image).length;
}

export async function compressImage(
  dataUrl: string,
  maxDimension = 1200,
  quality = 0.85
): Promise<string> {
  if (!isBase64Image(dataUrl)) {
    throw new Error('Invalid image data');
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressed = canvas.toDataURL('image/jpeg', quality);
      if (!isBase64Image(compressed)) {
        reject(new Error('Failed to compress image'));
        return;
      }
      resolve(compressed);
    };
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = dataUrl;
  });
}
