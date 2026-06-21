import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import './index.css'

/** Suppress known harmless third-party console noise (Razorpay, Google Sign-In). */
if (typeof window !== 'undefined') {
  const shouldSuppressThirdPartyNoise = (value: unknown) => {
    if (typeof value !== 'string') return false;
    return (
      value.includes('preloaded with link preload') ||
      value.includes('razorpay.com') ||
      value.includes('checkout-static-next.razorpay.com') ||
      value.includes('[GSI_LOGGER]') ||
      value.includes('Cross-Origin-Opener-Policy policy would block') ||
      value.includes('-ms-high-contrast') ||
      value.includes('Self-XSS') ||
      value.includes('Using this console may allow attackers')
    );
  };

  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (shouldSuppressThirdPartyNoise(args[0])) return;
    originalWarn.apply(console, args);
  };

  const originalError = console.error;
  console.error = (...args) => {
    if (shouldSuppressThirdPartyNoise(args[0])) return;
    originalError.apply(console, args);
  };
}


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)