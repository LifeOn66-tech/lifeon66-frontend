import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import './index.css'

// Suppress noisy third-party Razorpay preload warnings in the browser console.
if (typeof window !== 'undefined') {
  const shouldSuppressRazorpayNoise = (value: unknown) =>
    typeof value === 'string' &&
    (value.includes('preloaded with link preload') ||
      value.includes('razorpay.com') ||
      value.includes('checkout-static-next.razorpay.com'));

  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (shouldSuppressRazorpayNoise(args[0])) return;
    originalWarn.apply(console, args);
  };

  const originalError = console.error;
  console.error = (...args) => {
    if (shouldSuppressRazorpayNoise(args[0])) return;
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