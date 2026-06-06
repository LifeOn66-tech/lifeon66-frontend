import apiClient from '../api/apiClient';
import {
  compressImage,
  countValidImages,
  FACE_IMAGE_KEYS,
  PALM_IMAGE_KEYS,
  resolveFaceImages,
  resolvePalmImages,
} from './imageUtils';

const READING_SAVE_TIMEOUT = 120000;

async function compressForUpload(images: Record<string, string>): Promise<Record<string, string>> {
  const entries = await Promise.all(
    Object.entries(images).map(async ([key, value]) => [key, await compressImage(value, 900, 0.8)])
  );
  return Object.fromEntries(entries);
}

export async function resaveReadingsWithBase64Images(palmData: any, faceData: any) {
  const palmImages = await resolvePalmImages(palmData?.images);
  const faceImages = await resolveFaceImages(faceData?.images);

  if (countValidImages(palmImages) < PALM_IMAGE_KEYS.length) {
    throw new Error('Palm images are missing or invalid. Please complete your palm reading again.');
  }

  if (countValidImages(faceImages) < FACE_IMAGE_KEYS.length) {
    throw new Error('Face images are missing or invalid. Please complete your face reading again.');
  }

  const compressedPalmImages = await compressForUpload(palmImages);
  const compressedFaceImages = await compressForUpload(faceImages);

  await apiClient.post(
    'readings/palmistry',
    {
      images: {
        left: compressedPalmImages.left,
        right: compressedPalmImages.right,
      },
      fateLineAnalysis: palmData.fateLineAnalysis || palmData.fateLine?.description || '',
      headLineAnalysis: palmData.headLineAnalysis || palmData.headLine?.description || '',
      sunLineAnalysis: palmData.sunLineAnalysis || palmData.sunLine?.description || '',
      careerRecommendations: palmData.careerRecommendations || palmData.overallRecommendations || '',
      confidenceScore: palmData.confidenceScore ?? 85,
    },
    { timeout: READING_SAVE_TIMEOUT }
  );

  await apiClient.post(
    'readings/face',
    {
      images: {
        center: compressedFaceImages.center,
        left: compressedFaceImages.left,
        right: compressedFaceImages.right,
      },
      personalityTraits: faceData.personalityTraits || faceData.traitScores || {},
      leadershipScore: faceData.leadershipScore ?? faceData.traitScores?.leadership ?? 80,
      teamworkScore: faceData.teamworkScore ?? faceData.traitScores?.teamwork ?? 80,
      independenceScore: faceData.independenceScore ?? faceData.traitScores?.independence ?? 80,
      careerRecommendations: faceData.careerRecommendations || '',
      confidenceScore: faceData.confidenceScore ?? 85,
    },
    { timeout: READING_SAVE_TIMEOUT }
  );

  return {
    palmImages: compressedPalmImages,
    faceImages: compressedFaceImages,
  };
}

function stripReadingImages(entry: any) {
  if (!entry) return entry;
  const { images, ...rest } = entry;
  return rest;
}

/** Images are saved via palm/face POST; backend merges them from DB for PDF generation. */
export function buildFullDataForGenerate(astrology: any, palmData: any, faceData: any) {
  return {
    astrology: stripReadingImages(astrology),
    palmistry: stripReadingImages(palmData),
    face: stripReadingImages(faceData),
  };
}

export function buildFullDataForReport(
  astrology: any,
  palmData: any,
  faceData: any,
  palmImages: Record<string, string>,
  faceImages: Record<string, string>
) {
  return {
    astrology,
    palmistry: {
      ...palmData,
      images: {
        left: palmImages.left,
        right: palmImages.right,
      },
    },
    face: {
      ...faceData,
      images: {
        center: faceImages.center,
        left: faceImages.left,
        right: faceImages.right,
      },
    },
  };
}
