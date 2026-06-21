import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Logo } from './Logo'
import { loadGoogleScript, mountHiddenGoogleButton, triggerGoogleSignIn } from '../utils/googleAuth'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const googleButtonRef = useRef<HTMLDivElement>(null)

  const { signIn, signUp, signInWithGoogle } = useAuth()
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  const handleGoogleCredential = useCallback(async (credential: string) => {
    setGoogleLoading(true)
    setError('')
    try {
      const { error: authError } = await signInWithGoogle(credential)
      if (authError) throw new Error(authError)
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed')
    } finally {
      setGoogleLoading(false)
    }
  }, [signInWithGoogle])

  useEffect(() => {
    const authError = searchParams.get('error')
    if (!authError) return

    const messages: Record<string, string> = {
      google_denied: 'Google sign-in was cancelled.',
      google_not_configured: 'Google sign-in is not configured on the server.',
      google_no_code: 'Google sign-in did not complete. Please try again.',
      google_no_token: 'Google sign-in did not return a session. Please try again.',
      google_failed: 'Google sign-in failed. Please try again.',
    }

    setError(messages[authError] || 'Google sign-in failed. Please try again.')
    setSearchParams({}, { replace: true })
  }, [searchParams, setSearchParams])

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) return

    let active = true

    loadGoogleScript()
      .then(() => {
        if (active && googleButtonRef.current) {
          mountHiddenGoogleButton(googleClientId, googleButtonRef.current, handleGoogleCredential)
        }
      })
      .catch(() => {
        if (active) {
          setError('Could not load Google Sign-In. Please use email and password.')
        }
      })

    return () => {
      active = false
    }
  }, [googleClientId, handleGoogleCredential])

  const handleGoogleClick = () => {
    if (googleLoading) return
    triggerGoogleSignIn(googleButtonRef.current)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName)
        if (error) throw new Error(error)
      } else {
        const { error } = await signIn(email, password)
        if (error) throw new Error(error)
      }
    } catch (err: any) {
      if (err.message.includes('E11000') || err.message.includes('duplicate key')) {
        setError('An account with this email already exists. Please sign in instead.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page-bg flex items-center justify-center px-4 py-10">
      <motion.div
        className="auth-card max-w-[420px] w-full"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="flex justify-center mb-5"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <Logo size="xl" showText={false} />
          </motion.div>
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">
            LifeOn66
          </h1>
          <p className="text-amber-400/80 text-xs font-medium uppercase tracking-[0.2em] mb-3">
            Hol Life Coaching
          </p>
          <p className="text-white/55 text-sm leading-relaxed">
            {isSignUp
              ? 'Create your account to begin your career insights journey'
              : 'Sign in to access your personalized readings and reports'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                className="flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/8 p-3.5 text-red-200 text-sm"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="leading-snug">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="auth-input pl-10"
                    placeholder="John Doe"
                    required={isSignUp}
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="auth-button-primary"
            whileTap={{ scale: loading ? 1 : 0.99 }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isSignUp ? 'Creating account…' : 'Signing in…'}
              </span>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </motion.button>

          <div className="auth-divider flex justify-center">
            <span>or</span>
          </div>

          {googleClientId ? (
            <div className="relative">
              <div ref={googleButtonRef} aria-hidden="true" />
              <button
                type="button"
                onClick={handleGoogleClick}
                disabled={googleLoading}
                className="auth-button-google"
              >
                {googleLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                    <span>Signing in with Google…</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled
              className="auth-button-google opacity-40 cursor-not-allowed"
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>
          )}

          <p className="text-center text-sm text-white/45 pt-1">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
              className="text-amber-400/90 hover:text-amber-300 font-medium transition-colors"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  )
}
