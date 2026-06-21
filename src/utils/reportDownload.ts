import type { AxiosError } from 'axios';
import apiClient from '../api/apiClient';
import { buildUserDetails, getReadingId, linkReadingsInsightWithRetry, type UserDetails } from './readingsApi';
import { ensureReadingsReadyForReport } from './readingSave';
import { parseApiErrorAsync } from './apiErrors';
import { canAccessReportTier, validateReadingsForReport } from './readingRequirements';

const PDF_TIMEOUT_MS = 240000;
const PDF_MAX_RETRIES = 3;
const PREP_TIMEOUT_MS = 180000;
const PREP_MAX_RETRIES = 3;
const WAKE_TIMEOUT_MS = 120000;

export type ReportTier = 'free' | 'premium' | 'professional';

const REPORT_ENDPOINTS: Record<ReportTier, string> = {
  free: 'reports/generate',
  premium: 'reports/career-blueprint',
  professional: 'reports/cosmic-master',
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isRetryableNetworkError(error: unknown) {
  const axiosError = error as AxiosError;
  return (
    !axiosError.response &&
    (axiosError.code === 'ECONNABORTED' ||
      axiosError.message.includes('Network Error') ||
      axiosError.message.includes('timeout'))
  );
}

export function normalizeReportTier(tier: string | null | undefined): ReportTier {
  const value = String(tier || 'free').toLowerCase();
  if (value === 'premium' || value === 'professional') {
    return value;
  }
  return 'free';
}

export async function wakeBackend() {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await apiClient.get('auth/me', { timeout: WAKE_TIMEOUT_MS });
      return;
    } catch {
      if (attempt < 2) {
        await sleep(3000);
      }
    }
  }
}

export async function fetchReadingsForReport() {
  let lastError: unknown;

  for (let attempt = 0; attempt <= PREP_MAX_RETRIES; attempt += 1) {
    try {
      if (attempt > 0) {
        await wakeBackend();
        await sleep(3000);
      }

      const response = await apiClient.get('readings', { timeout: PREP_TIMEOUT_MS });
      if (!response.data?.success) {
        throw new Error('Could not load your saved readings.');
      }
      return response.data.data as {
        astrology: Record<string, unknown>[];
        palmistry: Record<string, unknown>[];
        face: Record<string, unknown>[];
      };
    } catch (error) {
      lastError = error;
      if (!isRetryableNetworkError(error) || attempt === PREP_MAX_RETRIES) {
        throw error;
      }
    }
  }

  throw lastError;
}

async function assertPdfBlob(blob: Blob): Promise<Blob> {
  if (!blob || blob.size < 100) {
    throw new Error('The server returned an empty PDF file.');
  }

  const header = new TextDecoder().decode(await blob.slice(0, 5).arrayBuffer());
  if (header.startsWith('%PDF')) {
    return blob;
  }

  const text = await blob.text();
  try {
    const data = JSON.parse(text) as { message?: string; error?: string };
    throw new Error(data.message || data.error || 'PDF generation failed on the server.');
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('The server did not return a valid PDF file.');
  }
}

export async function downloadPdfBlob(blob: Blob, tier: string) {
  const pdfBlob = await assertPdfBlob(blob);

  const url = window.URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `LifeOn66_Report_${tier}_${Date.now()}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export async function requestReportPdf(payload: {
  tier: ReportTier;
  userDetails: UserDetails;
  readingIds: {
    astrology: string;
    palmistry: string;
    face: string;
  };
  language?: string;
}) {
  const endpoint = REPORT_ENDPOINTS[payload.tier];
  let lastError: unknown;

  for (let attempt = 0; attempt <= PDF_MAX_RETRIES; attempt += 1) {
    try {
      if (attempt > 0) {
        await wakeBackend();
        await sleep(4000);
      }

      const response = await apiClient.post(
        endpoint,
        {
          tier: payload.tier,
          language: payload.language ?? 'en',
          userDetails: payload.userDetails,
          astrologyReadingId: payload.readingIds.astrology,
          palmistryReadingId: payload.readingIds.palmistry,
          faceReadingId: payload.readingIds.face,
        },
        {
          responseType: 'blob',
          timeout: PDF_TIMEOUT_MS,
        }
      );

      return await assertPdfBlob(response.data as Blob);
    } catch (error) {
      lastError = error;
      const axiosError = error as AxiosError;
      if (axiosError.response?.data instanceof Blob) {
        try {
          const text = await axiosError.response.data.text();
          const data = JSON.parse(text) as { message?: string; error?: string };
          throw new Error(data.message || data.error || 'PDF generation failed on the server.');
        } catch (parseError) {
          if (parseError instanceof Error && parseError.message !== 'Unexpected token') {
            throw parseError;
          }
        }
      }

      if (!isRetryableNetworkError(error) || attempt === PDF_MAX_RETRIES) {
        throw error;
      }
    }
  }

  throw lastError;
}

export interface DownloadCareerReportResult {
  blob: Blob;
  tier: ReportTier;
}

export async function downloadCareerReport(
  tier: string,
  onProgress?: (message: string) => void,
  userSubscriptionTier?: string
): Promise<DownloadCareerReportResult> {
  const progress = onProgress ?? (() => {});
  const reportTier = normalizeReportTier(tier);

  if (!canAccessReportTier(userSubscriptionTier, reportTier)) {
    throw new Error(
      reportTier === 'professional'
        ? 'Upgrade to Cosmic Master to download this report.'
        : 'Upgrade to Astral to download this report.'
    );
  }

  const readiness = await validateReadingsForReport();
  if (!readiness.ready) {
    throw new Error(readiness.message);
  }

  progress('Waking server — first download may take 2–3 minutes...');
  await wakeBackend();

  progress('Loading your readings...');
  const { astrology, palmistry, face } = await fetchReadingsForReport();

  const userDetails = buildUserDetails(astrology[0]);
  if (!userDetails.dateOfBirth || !userDetails.timeOfBirth || !userDetails.placeOfBirth || !userDetails.gender) {
    throw new Error('Your birth chart is missing required details. Please regenerate your chart.');
  }

  progress('Preparing images for your report...');
  await ensureReadingsReadyForReport(palmistry[0], face[0]);

  progress('Linking your career analysis...');
  try {
    await linkReadingsInsightWithRetry({
      astrology: astrology[0],
      palmistry: palmistry[0],
      face: face[0],
    });
  } catch (insightError) {
    console.warn('Insight link skipped:', insightError);
  }

  progress('Generating PDF — please keep this tab open...');
  const blob = await requestReportPdf({
    tier: reportTier,
    userDetails,
    readingIds: {
      astrology: getReadingId(astrology[0]),
      palmistry: getReadingId(palmistry[0]),
      face: getReadingId(face[0]),
    },
    language: 'en',
  });

  return { blob, tier: reportTier };
}

export { parseApiErrorAsync as formatDownloadError };
