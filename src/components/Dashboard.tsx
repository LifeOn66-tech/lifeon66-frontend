import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import apiClient from '../api/apiClient'
import {
  Star,
  Hand,
  User,
  TrendingUp,
  Calendar,
  Award,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle
} from 'lucide-react'

export function Dashboard() {
  const navigate = useNavigate()
  const [hasAstrology, setHasAstrology] = useState(false)
  const [hasPalm, setHasPalm] = useState(false)
  const [hasFace, setHasFace] = useState(false)

  useEffect(() => {
    checkCompletedReadings()
    const interval = setInterval(() => {
      checkCompletedReadings()
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleFocus = () => checkCompletedReadings()
    const handleVisibilityChange = () => {
      if (!document.hidden) checkCompletedReadings()
    }
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const checkCompletedReadings = async () => {
    try {
      const response = await apiClient.get('/readings');
      if (response.data.success) {
        const { astrology, palmistry, face } = response.data.data;
        setHasAstrology(astrology.length > 0);
        setHasPalm(palmistry.length > 0);
        setHasFace(face.length > 0);
      }
    } catch (error) {
      console.error('Error fetching readings:', error);
    }
  }

  const completedCount = [hasAstrology, hasPalm, hasFace].filter(Boolean).length
  const allComplete = completedCount === 3

  const readingTypes = [
    {
      id: 'astrology',
      title: 'Vedic Astrology',
      subtitle: 'Jyotisha — Light of God',
      description: 'Uncover your dharmic career path through planetary alignments, Mahadasha periods, and sacred birth chart analysis',
      icon: Star,
      cardClass: 'dash-card-astrology',
      iconGrad: 'linear-gradient(135deg, #0361a0 0%, #b65d08 100%)',
      iconGlow: 'rgba(56, 181, 248, 0.5)',
      accentColor: 'rgba(56, 181, 248, 0.7)',
      subtitleColor: '#7dceff',
      featureDot: '#38b5f8',
      btnBg: 'rgba(3, 97, 160, 0.6)',
      btnBorder: 'rgba(56, 181, 248, 0.4)',
      features: ['10th House Analysis', 'Mahadasha Career Periods', 'Sacred Yoga Combinations'],
      isCompleted: hasAstrology,
    },
    {
      id: 'palmistry',
      title: 'Palm Reading',
      subtitle: 'Hasta Samudrika Shastra',
      description: 'Decode the ancient lines etched in your palms — fate, destiny, and career potential revealed through fire and parchment wisdom',
      icon: Hand,
      cardClass: 'dash-card-palmistry',
      iconGrad: 'linear-gradient(135deg, #c24c09 0%, #9a3c10 100%)',
      iconGlow: 'rgba(249, 115, 22, 0.5)',
      accentColor: 'rgba(249, 115, 22, 0.8)',
      subtitleColor: '#ffbf82',
      featureDot: '#f97316',
      btnBg: 'rgba(154, 60, 16, 0.6)',
      btnBorder: 'rgba(249, 115, 22, 0.4)',
      features: ['Fate Line Analysis', 'Head & Heart Lines', 'Mount & Finger Profiles'],
      isCompleted: hasPalm,
    },
    {
      id: 'face-reading',
      title: 'Face Reading',
      subtitle: 'Saamudraka Shastra',
      description: 'Map the geometric precision of your facial features to reveal leadership capacity, authority zones, and career destiny',
      icon: User,
      cardClass: 'dash-card-face',
      iconGrad: 'linear-gradient(135deg, #0f766e 0%, #0369a1 100%)',
      iconGlow: 'rgba(45, 212, 191, 0.5)',
      accentColor: 'rgba(45, 212, 191, 0.8)',
      subtitleColor: '#5eead8',
      featureDot: '#2dd4bf',
      btnBg: 'rgba(15, 118, 110, 0.6)',
      btnBorder: 'rgba(45, 212, 191, 0.4)',
      features: ['7 Face Shape Archetypes', 'Feature-by-Feature Mapping', 'Three-Region Age System'],
      isCompleted: hasFace,
    },
    {
      id: 'comprehensive',
      title: 'Career Blueprint',
      subtitle: 'Unified Cosmic Analysis',
      description: 'All three ancient sciences converge — a complete 360° career roadmap with 6-month and 3-year cosmic guidance',
      icon: TrendingUp,
      cardClass: 'dash-card-blueprint',
      iconGrad: 'linear-gradient(135deg, #b65d08 0%, #875500 100%)',
      iconGlow: 'rgba(240, 184, 0, 0.5)',
      accentColor: 'rgba(240, 184, 0, 0.8)',
      subtitleColor: '#fddd76',
      featureDot: '#f0b800',
      btnBg: 'rgba(135, 85, 0, 0.5)',
      btnBorder: 'rgba(240, 184, 0, 0.4)',
      features: ['All 3 Readings Combined', '6-Month Action Plan', '3-Year Cosmic Roadmap'],
      isCompleted: allComplete,
    },
  ]

  const quickStats = [
    { label: 'Readings Completed', value: completedCount.toString(), icon: Award, color: '#38b5f8' },
    { label: 'Career Insights', value: allComplete ? '1' : '0', icon: TrendingUp, color: '#f0b800' },
    { label: 'Credits Remaining', value: (3 - completedCount).toString(), icon: Sparkles, color: '#2dd4bf' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-white/10"
          style={{ background: 'rgba(255,255,255,0.05)' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Sparkles className="w-4 h-4" style={{ color: '#f0b800' }} />
          <span className="text-sm text-white/65">Ancient Wisdom Meets Modern Clarity</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Your Cosmic Career
          <span
            className="block bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(to right, #38b5f8, #f0b800, #2dd4bf)' }}
          >
            Journey Begins
          </span>
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
          Three sacred sciences. One profound truth about your professional destiny.
          Unlock the wisdom hidden in the stars, your palms, and your face.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {quickStats.map((stat) => (
          <motion.div
            key={stat.label}
            className="cosmic-card text-center"
            whileHover={{ scale: 1.04, y: -2 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <stat.icon className="w-8 h-8 mx-auto mb-3" style={{ color: stat.color }} />
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-white/55 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Choose Your Reading</h2>
        <p className="text-white/45 text-center text-sm mb-8">Each discipline reveals a different dimension of your career destiny</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {readingTypes.map((reading, index) => {
            const isComprehensive = reading.id === 'comprehensive'
            const isLocked = isComprehensive && !allComplete

            return (
              <motion.div
                key={reading.id}
                className={`${reading.cardClass} group relative`}
                style={{ opacity: isLocked ? 0.7 : 1 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLocked ? 0.7 : 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
                  style={{ background: `linear-gradient(to right, transparent, ${reading.accentColor}, transparent)` }}
                />

                {isLocked && (
                  <div
                    className="absolute top-4 right-4 px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold border"
                    style={{ background: 'rgba(0,0,0,0.4)', borderColor: reading.btnBorder, color: reading.subtitleColor }}
                  >
                    <Lock className="w-3 h-3" />
                    {completedCount}/3 Complete
                  </div>
                )}
                {reading.isCompleted && !isComprehensive && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold bg-green-900/50 text-green-300 border border-green-600/40">
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </div>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${!isLocked ? 'group-hover:scale-110' : ''}`}
                    style={{ background: reading.iconGrad, boxShadow: `0 4px 16px ${reading.iconGlow}` }}
                  >
                    <reading.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white leading-tight">{reading.title}</h3>
                    <p className="text-xs font-medium mt-0.5" style={{ color: reading.subtitleColor }}>{reading.subtitle}</p>
                  </div>
                </div>

                <p className="text-white/55 text-sm mb-5 leading-relaxed">{reading.description}</p>

                <div className="space-y-2 mb-6">
                  {reading.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-white/50">
                      <div className="w-1.5 h-1.5 rounded-full mr-3 flex-shrink-0" style={{ background: reading.featureDot }} />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {isLocked ? (
                  <div
                    className="w-full py-3 px-5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium cursor-not-allowed border"
                    style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)', borderColor: 'rgba(255,255,255,0.08)' }}
                  >
                    <Lock className="w-4 h-4" />
                    Complete All Readings First
                  </div>
                ) : (
                  <motion.button
                    onClick={() => navigate(`/${reading.id}`)}
                    className="w-full text-white font-semibold py-3 px-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn text-sm border"
                    style={{ background: reading.btnBg, borderColor: reading.btnBorder }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{reading.isCompleted && !isComprehensive ? 'View Reading' : 'Begin Reading'}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </motion.button>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <motion.div
        className="cosmic-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Recent Activity</h3>
          <Calendar className="w-5 h-5 text-white/35" />
        </div>
        <div className="text-center py-10">
          <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
            <Sparkles className="w-7 h-7 text-white/25" />
          </div>
          <p className="text-white/45 mb-2">No readings yet</p>
          <p className="text-white/30 text-sm">Begin a reading above to start your cosmic career journey</p>
        </div>
      </motion.div>
    </div>
  )
}
