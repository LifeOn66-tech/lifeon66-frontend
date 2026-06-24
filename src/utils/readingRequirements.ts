import apiClient from '../api/apiClient';
import { getAstrologyBirthDetails, getMissingBirthDetailLabels } from '../types/astrology';
import { parseReadingsList } from './insightMapper';

export interface MissingReading {
  label: string;
  path: string;
}

export interface ReadingsReadyCheck {
  ready: boolean;
  message: string;
  missing: MissingReading[];
}

export async function validateReadingsForReport(): Promise<ReadingsReadyCheck> {
  const missing: MissingReading[] = [];

  let readings;
  try {
    const response = await apiClient.get('readings', { timeout: 120000 });
    if (!response.data?.success) {
      return {
        ready: false,
        message: 'Could not load your saved readings. Please try again in a moment.',
        missing: [],
      };
    }
    readings = parseReadingsList(response.data.data);
  } catch {
    return {
      ready: false,
      message: 'Could not load your saved readings. Please try again in a moment.',
      missing: [],
    };
  }

  if (!readings.astrology[0]) {
    missing.push({ label: 'Vedic birth chart', path: '/astrology' });
  }
  if (!readings.palmistry[0]) {
    missing.push({ label: 'Palm reading', path: '/palmistry' });
  }
  if (!readings.face[0]) {
    missing.push({ label: 'Face reading', path: '/face-reading' });
  }

  if (missing.length > 0) {
    return {
      ready: false,
      message: `Complete these readings before downloading your report: ${missing.map((item) => item.label).join(', ')}.`,
      missing,
    };
  }

  const birthDetails = getAstrologyBirthDetails(readings.astrology[0]);
  const missingBirthFields = getMissingBirthDetailLabels(birthDetails);
  if (missingBirthFields.length > 0) {
    return {
      ready: false,
      message: `Your saved birth chart is missing ${missingBirthFields.join(', ')}. Please open Vedic Astrology and regenerate your chart.`,
      missing: [{ label: 'Vedic birth chart', path: '/astrology' }],
    };
  }

  return { ready: true, message: '', missing: [] };
}

export function canAccessReportTier(
  userTier: string | undefined,
  reportTier: 'free' | 'premium' | 'professional'
): boolean {
  const tier = String(userTier || 'free').toLowerCase();
  if (reportTier === 'free') return true;
  if (reportTier === 'premium') return tier === 'premium' || tier === 'professional';
  if (reportTier === 'professional') return tier === 'professional';
  return false;
}
