import type { AxiosError } from 'axios';
import apiClient from '../api/apiClient';
import type { UserDetails } from './readingsApi';
import { parseApiErrorAsync } from './apiErrors';

const PDF_TIMEOUT_MS = 180000;
const PDF_MAX_RETRIES = 2;

export type ReportTier = 'free' | 'premium' | 'professional';

const REPORT_ENDPOINTS: Record<ReportTier, string> = {
  free: 'reports/generate',
  premium: 'reports/career-blueprint',
  professional: 'reports/cosmic-master',
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function normalizeReportTier(tier: string | null | undefined): ReportTier {
  const value = String(tier || 'free').toLowerCase();
  if (value === 'premium' || value === 'professional') {
    return value;
  }
  return 'free';
}

export async function wakeBackend() {
  try {
    await apiClient.get('auth/me', { timeout: 45000 });
  } catch {
    // Render cold start may fail once; retry handles follow-up.
  }
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
  language?: string;
}) {
  const endpoint = REPORT_ENDPOINTS[payload.tier];
  let lastError: unknown;

  for (let attempt = 0; attempt <= PDF_MAX_RETRIES; attempt += 1) {
    try {
      if (attempt > 0) {
        await wakeBackend();
        await sleep(3000);
      }

      const response = await apiClient.post(
        endpoint,
        {
          tier: payload.tier,
          language: payload.language ?? 'en',
          userDetails: payload.userDetails,
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

      const isRetryable =
        !axiosError.response &&
        (axiosError.code === 'ECONNABORTED' ||
          axiosError.message.includes('Network Error') ||
          axiosError.message.includes('timeout'));

      if (!isRetryable || attempt === PDF_MAX_RETRIES) {
        throw error;
      }
    }
  }

  throw lastError;
}

export { parseApiErrorAsync as formatDownloadError };
