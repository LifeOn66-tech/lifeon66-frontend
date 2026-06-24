import apiClient from '../api/apiClient';
import { getAstrologyBirthDetails } from '../types/astrology';
import { compressImage, isBase64Image } from './imageUtils';

const READING_TIMEOUT = 120000;

export interface UserDetails {
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  gender: string;
}

export function getReadingId(reading: { _id?: string; id?: string } | null | undefined) {
  return reading?._id || reading?.id || '';
}

export function buildUserDetails(astrologyReading: Record<string, unknown> | null | undefined): UserDetails {
  const details = getAstrologyBirthDetails(astrologyReading);
  return {
    dateOfBirth: details.date,
    timeOfBirth: details.time,
    placeOfBirth: details.place,
    gender: details.gender,
  };
}

export async function analyzeAndSavePalm(images: { left: string; right: string }) {
  if (!isBase64Image(images.left) || !isBase64Image(images.right)) {
    throw new Error('Palm images must be saved as base64 before analysis.');
  }

  const compressed = {
    left: await compressImage(images.left, 900, 0.8),
    right: await compressImage(images.right, 900, 0.8),
  };

  const analyzeRes = await apiClient.post(
    'readings/palmistry-analyze',
    { images: compressed },
    { timeout: READING_TIMEOUT }
  );

  const analysis = analyzeRes.data?.data ?? analyzeRes.data;

  await apiClient.post(
    'readings/palmistry',
    { ...analysis, images: compressed },
    { timeout: READING_TIMEOUT }
  );

  return analysis;
}

export async function analyzeAndSaveFace(images: { center: string; left: string; right: string }) {
  if (!isBase64Image(images.center) || !isBase64Image(images.left) || !isBase64Image(images.right)) {
    throw new Error('Face images must be saved as base64 before analysis.');
  }

  const compressed = {
    center: await compressImage(images.center, 900, 0.8),
    left: await compressImage(images.left, 900, 0.8),
    right: await compressImage(images.right, 900, 0.8),
  };

  const analyzeRes = await apiClient.post(
    'readings/face-analyze',
    { images: compressed },
    { timeout: READING_TIMEOUT }
  );

  const analysis = analyzeRes.data?.data ?? analyzeRes.data;

  await apiClient.post(
    'readings/face',
    { ...analysis, images: compressed },
    { timeout: READING_TIMEOUT }
  );

  return analysis;
}

export async function linkReadingsInsight(readings: {
  astrology?: Record<string, unknown>;
  palmistry?: Record<string, unknown>;
  face?: Record<string, unknown>;
}) {
  const payload = {
    astrologyReadingId: getReadingId(readings.astrology),
    palmistryReadingId: getReadingId(readings.palmistry),
    faceReadingId: getReadingId(readings.face),
  };

  const response = await apiClient.post('readings/insight', payload, { timeout: READING_TIMEOUT });
  return response.data?.data ?? response.data;
}

export async function linkReadingsInsightWithRetry(readings: {
  astrology?: Record<string, unknown>;
  palmistry?: Record<string, unknown>;
  face?: Record<string, unknown>;
}) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await linkReadingsInsight(readings);
    } catch (error) {
      lastError = error;
      if (attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, 2500));
      }
    }
  }
  throw lastError;
}

export async function fetchInsight(): Promise<Record<string, unknown> | null> {
  try {
    const response = await apiClient.get('readings/insight', { timeout: 120000 });
    if (!response.data?.success) return null;
    const insight = response.data.data;
    return insight && typeof insight === 'object' ? (insight as Record<string, unknown>) : null;
  } catch (error) {
    console.error('Error fetching insight:', error);
    return null;
  }
}
