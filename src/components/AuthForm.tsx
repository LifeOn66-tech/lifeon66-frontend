import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star as Stars, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn, signUp } = useAuth()

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
      // Handle the duplicate key error message specifically
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="cosmic-card max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="flex justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="p-3 bg-gradient-to-r from-cosmic-500 to-mystic-500 rounded-full">
              <Stars className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cosmic-400 to-mystic-400 bg-clip-text text-transparent mb-2">
            LifeOn66
          </h1>
          <p className="text-white/70">
            {isSignUp ? 'Create your cosmic career journey' : 'Welcome back to your cosmic journey'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-200 text-sm shadow-lg shadow-red-900/20"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-red-300 mb-0.5">Authentication Error</p>
                  <p className="opacity-90">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <Stars className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="cosmic-input pl-10 w-full"
                    placeholder="Enter your full name"
                    required={isSignUp}
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="cosmic-input pl-10 w-full"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="cosmic-input pl-10 pr-10 w-full"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="cosmic-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
              </div>
            ) : (
              <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
            )}
          </motion.button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-cosmic-400 hover:text-cosmic-300 transition-colors text-sm"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}