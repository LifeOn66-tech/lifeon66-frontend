import type { AxiosError } from 'axios';
import apiClient from '../api/apiClient';
import { generatePDFReport } from './pdfGenerator';

const PDF_TIMEOUT_MS = 120000;
const PDF_MAX_RETRIES = 1;

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
  language: string;
  analysis: Record<string, unknown>;
  fullData: Record<string, unknown>;
  tier: string;
}) {
  let lastError: unknown;

  for (let attempt = 0; attempt <= PDF_MAX_RETRIES; attempt += 1) {
    try {
      if (attempt > 0) {
        await wakeBackend();
        await sleep(3000);
      }

      const response = await apiClient.post('reports/generate', payload, {
        responseType: 'blob',
        timeout: PDF_TIMEOUT_MS,
      });

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

export function generateLocalReportPdf(
  analysis: {
    topCareerMatches: unknown;
    sixMonthPathway: unknown;
    threeYearPathway: unknown;
    strengthsSummary: unknown;
    developmentAreas: unknown;
    confidenceScore: unknown;
  },
  fullData: {
    astrology: unknown;
    palmistry: unknown;
    face: unknown;
  },
  userName?: string
) {
  generatePDFReport(
    {
      topCareerMatches: analysis.topCareerMatches as never,
      sixMonthPathway: analysis.sixMonthPathway as never,
      threeYearPathway: analysis.threeYearPathway as never,
      strengthsSummary: analysis.strengthsSummary as never,
      developmentAreas: analysis.developmentAreas as never,
      confidenceScore: analysis.confidenceScore as number,
      astrologyData: fullData.astrology,
      palmistryData: fullData.palmistry,
      faceReadingData: fullData.face,
    },
    'en',
    userName
  );
}

export async function formatDownloadError(error: unknown): Promise<{ title: string; detail: string }> {
  const axiosError = error as AxiosError<{ message?: string; error?: string }>;

  if (axiosError.response) {
    let detail = 'PDF generation failed on the server.';

    if (axiosError.response.data instanceof Blob) {
      try {
        const text = await axiosError.response.data.text();
        const data = JSON.parse(text);
        detail = data.message || data.error || detail;
      } catch {
        // Keep default detail.
      }
    } else if (axiosError.response.data) {
      detail =
        axiosError.response.data.message ||
        axiosError.response.data.error ||
        detail;
    }

    return {
      title: `Server Error (${axiosError.response.status})`,
      detail,
    };
  }

  if (axiosError.request) {
    if (axiosError.code === 'ECONNABORTED') {
      return {
        title: 'Request Timed Out',
        detail:
          'The report server took too long to respond. A local copy of your report will be downloaded instead.',
      };
    }

    return {
      title: 'Connection Error',
      detail:
        'Could not reach the report server. A local copy of your report will be downloaded instead.',
    };
  }

  if (error instanceof Error) {
    return {
      title: 'Report Generation Error',
      detail: error.message,
    };
  }

  return {
    title: 'Report Generation Error',
    detail: 'An unexpected error occurred while generating your PDF.',
  };
}
