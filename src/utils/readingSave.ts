import apiClient from '../api/apiClient';
import {
  compressImage,
  countValidImages,
  FACE_IMAGE_KEYS,
  isBase64Image,
  PALM_IMAGE_KEYS,
  resolveFaceImages,
  resolvePalmImages,
} from './imageUtils';

const READING_SAVE_TIMEOUT = 180000;

function hasValidImagesInRecord(images: unknown, keys: readonly string[]): boolean {
  if (!images || typeof images !== 'object') return false;
  const map = images as Record<string, string>;
  return keys.every((key) => isBase64Image(map[key]));
}

async function compressForUpload(images: Record<string, string>): Promise<Record<string, string>> {
  const entries = await Promise.all(
    Object.entries(images).map(async ([key, value]) => [key, await compressImage(value, 900, 0.8)])
  );
  return Object.fromEntries(entries);
}

export async function resaveReadingsWithBase64Images(
  palmData: Record<string, unknown>,
  faceData: Record<string, unknown>
) {
  const palmImages = await resolvePalmImages(palmData?.images as Record<string, string | null | undefined>);
  const faceImages = await resolveFaceImages(faceData?.images as Record<string, string | null | undefined>);

  if (countValidImages(palmImages) < PALM_IMAGE_KEYS.length) {
    throw new Error('Palm images are missing or invalid. Please complete your palm reading again.');
  }

  if (countValidImages(faceImages) < FACE_IMAGE_KEYS.length) {
    throw new Error('Face images are missing or invalid. Please complete your face reading again.');
  }

  const compressedPalmImages = await compressForUpload(palmImages);
  const compressedFaceImages = await compressForUpload(faceImages);

  const palmRecord = palmData as Record<string, unknown>;
  const faceRecord = faceData as Record<string, unknown>;
  const palmFateLine = palmRecord.fateLine as Record<string, unknown> | undefined;
  const palmHeadLine = palmRecord.headLine as Record<string, unknown> | undefined;
  const palmSunLine = palmRecord.sunLine as Record<string, unknown> | undefined;
  const faceTraits = faceRecord.traitScores as Record<string, unknown> | undefined;

  await Promise.all([
    apiClient.post(
      'readings/palmistry',
      {
        images: {
          left: compressedPalmImages.left,
          right: compressedPalmImages.right,
        },
        fateLineAnalysis: palmRecord.fateLineAnalysis || palmFateLine?.description || '',
        headLineAnalysis: palmRecord.headLineAnalysis || palmHeadLine?.description || '',
        sunLineAnalysis: palmRecord.sunLineAnalysis || palmSunLine?.description || '',
        careerRecommendations: palmRecord.careerRecommendations || palmRecord.overallRecommendations || '',
        confidenceScore: Number(palmRecord.confidenceScore ?? 85),
      },
      { timeout: READING_SAVE_TIMEOUT }
    ),
    apiClient.post(
      'readings/face',
      {
        images: {
          center: compressedFaceImages.center,
          left: compressedFaceImages.left,
          right: compressedFaceImages.right,
        },
        personalityTraits: faceRecord.personalityTraits || faceTraits || {},
        leadershipScore: Number(faceRecord.leadershipScore ?? faceTraits?.leadership ?? 80),
        teamworkScore: Number(faceRecord.teamworkScore ?? faceTraits?.teamwork ?? 80),
        independenceScore: Number(faceRecord.independenceScore ?? faceTraits?.independence ?? 80),
        careerRecommendations: faceRecord.careerRecommendations || '',
        confidenceScore: Number(faceRecord.confidenceScore ?? 85),
      },
      { timeout: READING_SAVE_TIMEOUT }
    ),
  ]);

  return {
    palmImages: compressedPalmImages,
    faceImages: compressedFaceImages,
  };
}

/** Re-save only when DB is missing valid base64 images (avoids slow duplicate uploads). */
export async function ensureReadingsReadyForReport(
  palmData: Record<string, unknown>,
  faceData: Record<string, unknown>
) {
  const dbReady =
    hasValidImagesInRecord(palmData?.images, PALM_IMAGE_KEYS) &&
    hasValidImagesInRecord(faceData?.images, FACE_IMAGE_KEYS);

  if (dbReady) {
    return;
  }

  await resaveReadingsWithBase64Images(palmData, faceData);
}
