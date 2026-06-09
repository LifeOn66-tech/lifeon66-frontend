import type { AxiosError } from 'axios';
import apiClient from '../api/apiClient';
import type { UserDetails } from './readingsApi';
import { parseApiErrorAsync } from './apiErrors';

const PDF_TIMEOUT_MS = 120000;
const PDF_MAX_RETRIES = 1;

export type ReportTier = 'free' | 'premium' | 'professional';

const REPORT_ENDPOINTS: Record<ReportTier, string> = {
  free: 'reports/generate',
  premium: 'reports/career-blueprint',
  professional: 'reports/cosmic-master',
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function wakeBackend() {
  try {
    await apiClient.get('auth/me', { timeout: 45000 });
  } catch {
    // Render cold start may fail once; retry handles follow-up.
  }
}

export async function downloadPdfBlob(blob: Blob, tier: string) {
  if (!blob || blob.size < 100) {
    throw new Error('The server returned an empty PDF file.');
  }

  if (blob.type === 'application/json') {
    const text = await blob.text();
    const data = JSON.parse(text);
    throw new Error(data.message || data.error || 'PDF generation failed.');
  }

  const url = window.URL.createObjectURL(blob);
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

      return response.data as Blob;
    } catch (error) {
      lastError = error;
      const axiosError = error as AxiosError;
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
