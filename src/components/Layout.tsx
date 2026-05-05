import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star as Stars, User, LogOut, Menu, X, Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useLocation } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

interface OrbConfig {
  color: string
  size: string
  pos: string
  delay: number
}

interface ThemeConfig {
  bgClass: string
  bgStyle?: React.CSSProperties
  accentColor: string
  glowColor: string
  borderColor: string
  logoFrom: string
  logoTo: string
  orbs: OrbConfig[]
  stars: boolean
  gridOverlay: boolean
}

function getThemeConfig(pathname: string): ThemeConfig {
  if (pathname.startsWith('/astrology')) {
    return {
      bgClass: 'astrology-bg',
      accentColor: 'rgba(56, 181, 248, 0.9)',
      glowColor: 'rgba(56, 181, 248, 0.15)',
      borderColor: 'rgba(56, 181, 248, 0.25)',
      logoFrom: 'from-celestial-300',
      logoTo: 'to-starlight-400',
      orbs: [
        { color: 'rgba(14, 154, 232, 0.18)', size: 'w-64 h-64', pos: 'top-10 left-10', delay: 0 },
        { color: 'rgba(240, 184, 0, 0.1)', size: 'w-48 h-48', pos: 'top-32 right-20', delay: 1.5 },
        { color: 'rgba(7, 82, 132, 0.22)', size: 'w-80 h-80', pos: 'bottom-20 left-1/4', delay: 3 },
        { color: 'rgba(56, 181, 248, 0.12)', size: 'w-32 h-32', pos: 'bottom-40 right-1/3', delay: 2 },
      ],
      stars: true,
      gridOverlay: false,
    }
  }
  if (pathname.startsWith('/palmistry')) {
    return {
      bgClass: 'palmistry-bg',
      accentColor: 'rgba(249, 115, 22, 0.9)',
      glowColor: 'rgba(249, 115, 22, 0.15)',
      borderColor: 'rgba(249, 115, 22, 0.25)',
      logoFrom: 'from-palm-400',
      logoTo: 'to-parchment-300',
      orbs: [
        { color: 'rgba(234, 99, 7, 0.2)', size: 'w-56 h-56', pos: 'top-10 left-10', delay: 0 },
        { color: 'rgba(185, 28, 28, 0.15)', size: 'w-40 h-40', pos: 'top-40 right-16', delay: 1 },
        { color: 'rgba(249, 115, 22, 0.12)', size: 'w-72 h-72', pos: 'bottom-20 right-1/4', delay: 2.5 },
        { color: 'rgba(217, 133, 53, 0.14)', size: 'w-48 h-48', pos: 'bottom-32 left-1/3', delay: 1.8 },
      ],
      stars: false,
      gridOverlay: false,
    }
  }
  if (pathname.startsWith('/face-reading')) {
    return {
      bgClass: 'facereading-bg',
      accentColor: 'rgba(45, 212, 191, 0.9)',
      glowColor: 'rgba(45, 212, 191, 0.12)',
      borderColor: 'rgba(45, 212, 191, 0.25)',
      logoFrom: 'from-face-400',
      logoTo: 'to-sapphire-300',
      orbs: [
        { color: 'rgba(13, 148, 136, 0.18)', size: 'w-60 h-60', pos: 'top-10 left-10', delay: 0 },
        { color: 'rgba(2, 132, 199, 0.12)', size: 'w-44 h-44', pos: 'top-28 right-20', delay: 1.2 },
        { color: 'rgba(15, 118, 110, 0.2)', size: 'w-72 h-72', pos: 'bottom-16 left-1/3', delay: 2.8 },
        { color: 'rgba(45, 212, 191, 0.1)', size: 'w-36 h-36', pos: 'bottom-48 right-1/4', delay: 2 },
      ],
      stars: false,
      gridOverlay: true,
    }
  }
  return {
    bgClass: '',
    bgStyle: { background: 'linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 50%, #0a0a1a 100%)' },
    accentColor: 'rgba(129, 140, 248, 0.8)',
    glowColor: 'rgba(129, 140, 248, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    logoFrom: 'from-cosmic-400',
    logoTo: 'to-starlight-400',
    orbs: [
      { color: 'rgba(99, 102, 241, 0.15)', size: 'w-32 h-32', pos: 'top-20 left-20', delay: 0 },
      { color: 'rgba(249, 168, 37, 0.1)', size: 'w-24 h-24', pos: 'top-40 right-32', delay: 1 },
      { color: 'rgba(99, 102, 241, 0.08)', size: 'w-40 h-40', pos: 'bottom-32 left-1/3', delay: 2 },
    ],
    stars: false,
    gridOverlay: false,
  }
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const theme = getThemeConfig(location.pathname)

  const handleSignOut = async () => {
    await signOut()
    setMobileMenuOpen(false)
  }

  return (
    <div
      className={`min-h-screen ${theme.bgClass}`}
      style={theme.bgStyle}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {theme.orbs.map((orb, i) => (
          <motion.div
            key={i}
            className={`absolute ${orb.size} ${orb.pos} rounded-full blur-3xl`}
            style={{ background: orb.color }}
            animate={{ y: [0, -20, 0], opacity: [0.6, 1, 0.6], scale: [1, 1.05, 1] }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: orb.delay, ease: 'easeInOut' }}
          />
        ))}

        {theme.stars && (
          <>
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute rounded-full"
                style={{
                  width: i % 8 === 0 ? '2px' : '1px',
                  height: i % 8 === 0 ? '2px' : '1px',
                  left: `${(i * 17.3) % 100}%`,
                  top: `${(i * 13.7) % 100}%`,
                  background: i % 5 === 0 ? 'rgba(240,184,0,0.9)' : i % 3 === 0 ? 'rgba(56,181,248,0.9)' : 'rgba(255,255,255,0.7)',
                }}
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
                transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: (i % 5) * 0.8, ease: 'easeInOut' }}
              />
            ))}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <line x1="15%" y1="20%" x2="35%" y2="12%" stroke="rgba(56,181,248,0.15)" strokeWidth="0.5" strokeDasharray="4 6" />
              <line x1="35%" y1="12%" x2="55%" y2="25%" stroke="rgba(56,181,248,0.15)" strokeWidth="0.5" strokeDasharray="4 6" />
              <line x1="55%" y1="25%" x2="75%" y2="18%" stroke="rgba(240,184,0,0.12)" strokeWidth="0.5" strokeDasharray="4 6" />
              <line x1="20%" y1="55%" x2="40%" y2="65%" stroke="rgba(56,181,248,0.12)" strokeWidth="0.5" strokeDasharray="4 6" />
              <line x1="40%" y1="65%" x2="60%" y2="58%" stroke="rgba(240,184,0,0.1)" strokeWidth="0.5" strokeDasharray="4 6" />
              <line x1="60%" y1="58%" x2="80%" y2="70%" stroke="rgba(56,181,248,0.12)" strokeWidth="0.5" strokeDasharray="4 6" />
              <circle cx="15%" cy="20%" r="2" fill="rgba(240,184,0,0.6)" />
              <circle cx="35%" cy="12%" r="1.5" fill="rgba(56,181,248,0.6)" />
              <circle cx="55%" cy="25%" r="2" fill="rgba(255,255,255,0.5)" />
              <circle cx="75%" cy="18%" r="1.5" fill="rgba(240,184,0,0.5)" />
              <circle cx="20%" cy="55%" r="2" fill="rgba(56,181,248,0.5)" />
              <circle cx="60%" cy="58%" r="1.5" fill="rgba(255,255,255,0.4)" />
              <circle cx="80%" cy="70%" r="2" fill="rgba(240,184,0,0.5)" />
            </svg>
          </>
        )}

        {theme.gridOverlay && (
          <div className="absolute inset-0 grid-overlay" />
        )}
      </div>

      <header
        className="relative z-10 backdrop-blur-lg border-b"
        style={{
          background: 'rgba(0,0,0,0.35)',
          borderColor: theme.borderColor,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Stars className="w-8 h-8" style={{ color: theme.accentColor }} />
              </motion.div>
              <span className={`text-2xl font-bold bg-gradient-to-r ${theme.logoFrom} ${theme.logoTo} bg-clip-text text-transparent`}>
                LifeOn66
              </span>
            </motion.div>

            {user && (
              <div className="hidden md:flex items-center space-x-6">
                <motion.button
                  className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </motion.button>
                <motion.button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </motion.button>
              </div>
            )}

            {user && (
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {user && mobileMenuOpen && (
            <motion.div
              className="md:hidden backdrop-blur-lg border-t"
              style={{ background: 'rgba(0,0,0,0.5)', borderColor: theme.borderColor }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="px-4 py-4 space-y-3">
                <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors w-full">
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10">
        {children}
      </main>

      <div
        className="fixed bottom-0 left-0 right-0 h-px pointer-events-none z-50"
        style={{ background: `linear-gradient(to right, transparent, ${theme.accentColor}, transparent)`, opacity: 0.35 }}
      />

      <motion.div
        className="fixed bottom-6 right-6 w-8 h-8 rounded-full flex items-center justify-center pointer-events-none z-50"
        style={{ background: theme.glowColor, border: `1px solid ${theme.borderColor}` }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles className="w-4 h-4 text-white/50" />
      </motion.div>
    </div>
  )
}
