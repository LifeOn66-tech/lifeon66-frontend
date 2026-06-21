import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { Logo } from './Logo';

export function GoogleAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    if (!token) {
      navigate('/login?error=google_no_token', { replace: true });
      return;
    }

    const completeSignIn = async () => {
      try {
        localStorage.setItem('token', token);
        const response = await apiClient.get('auth/me');
        if (response.data.success) {
          localStorage.setItem('user', JSON.stringify(response.data.data));
          window.location.replace('/');
          return;
        }
        throw new Error('Failed to load user profile');
      } catch {
        localStorage.removeItem('token');
        navigate('/login?error=google_failed', { replace: true });
      }
    };

    completeSignIn();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-mystic-900 to-cosmic-800 flex items-center justify-center">
      <div className="text-center">
        <Logo size="xl" className="justify-center mb-4" />
        <div className="w-16 h-16 border-4 border-cosmic-400/30 border-t-cosmic-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/70">Completing Google sign-in...</p>
      </div>
    </div>
  );
}
