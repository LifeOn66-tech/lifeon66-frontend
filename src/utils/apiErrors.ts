import type { AxiosError } from 'axios';

export interface ApiErrorInfo {
  title: string;
  message: string;
  status?: number;
}

export async function parseApiErrorAsync(error: unknown): Promise<ApiErrorInfo> {
  const axiosError = error as AxiosError<{ message?: string; error?: string }>;
  if (axiosError.response?.data instanceof Blob) {
    try {
      const text = await axiosError.response.data.text();
      const data = JSON.parse(text) as { message?: string; error?: string };
      return parseApiError({
        ...axiosError,
        response: { ...axiosError.response, data },
      });
    } catch {
      // Fall through to standard parsing.
    }
  }
  return parseApiError(error);
}

export function parseApiError(error: unknown): ApiErrorInfo {
  const axiosError = error as AxiosError<{ message?: string; error?: string }>;
  const status = axiosError.response?.status;
  const detail =
    axiosError.response?.data?.message ||
    axiosError.response?.data?.error ||
    (error instanceof Error ? error.message : 'Something went wrong. Please try again.');

  if (status === 400) {
    return {
      status,
      title: 'Missing Data',
      message: detail || 'Complete and save your birth chart before downloading a report.',
    };
  }

  if (status === 402) {
    return {
      status,
      title: 'Payment Required',
      message: detail || 'Upgrade your plan to download this report.',
    };
  }

  if (status === 503) {
    return {
      status,
      title: 'Service Temporarily Unavailable',
      message: detail || 'AI quota exceeded or the service is busy. Please try again later.',
    };
  }

  if (axiosError.response) {
    return {
      status,
      title: `Server Error (${status})`,
      message: detail,
    };
  }

  if (axiosError.code === 'ECONNABORTED') {
    return {
      title: 'Request Timed Out',
      message: 'The server took too long to respond. Please try again.',
    };
  }

  if (axiosError.request) {
    return {
      title: 'Connection Error',
      message: 'Could not reach the server. Check your connection and try again.',
    };
  }

  return {
    title: 'Error',
    message: detail,
  };
}
