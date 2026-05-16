import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthForm } from './components/AuthForm'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { AstrologyChart } from './components/AstrologyChart'
import { PalmReading } from './components/PalmReading'
import { FaceReading } from './components/FaceReading'
import ComprehensiveAnalysis from './components/ComprehensiveAnalysis'
import { useAuth } from './hooks/useAuth'
import PricingPlans from './components/PricingPlans'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-mystic-900 to-cosmic-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cosmic-400/30 border-t-cosmic-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading LifeOn66...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {!user ? (
          <AuthForm />
        ) : (
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pricing" element={<PricingPlans />} />
              <Route path="/astrology" element={<AstrologyChart />} />
              <Route path="/palmistry" element={<PalmReading />} />
              <Route path="/face-reading" element={<FaceReading />} />
              <Route path="/comprehensive" element={<ComprehensiveAnalysis />} />
            </Routes>
          </Layout>
        )}
      </Router>
    </ErrorBoundary>
  )
}

export default App;