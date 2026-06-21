export function getApiOrigin(): string {
  const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return envUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
}

/** Redirect-based Google sign-in (no GSI button / no frontend origin whitelist needed). */
export function startGoogleOAuthRedirect() {
  const apiOrigin = getApiOrigin();
  const frontendOrigin = encodeURIComponent(window.location.origin);
  window.location.href = `${apiOrigin}/api/auth/google/start?frontend_url=${frontendOrigin}`;
}
