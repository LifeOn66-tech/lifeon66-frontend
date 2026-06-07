import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
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
import { Logo } from './components/Logo'
import { Profile } from './components/Profile'

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-mystic-900 to-cosmic-800 flex items-center justify-center">
      <div className="text-center">
        <Logo size="xl" className="justify-center mb-4" />
        <div className="w-16 h-16 border-4 border-cosmic-400/30 border-t-cosmic-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/70">Loading LifeOn66...</p>
      </div>
    </div>
  )
}

function LoginPage() {
  const { user } = useAuth()
  if (user) {
    return <Navigate to="/" replace />
  }
  return <AuthForm />
}

function ProtectedLayout() {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

function App() {
  const { loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <ErrorBoundary>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pricing" element={<PricingPlans />} />
            <Route path="/astrology" element={<AstrologyChart />} />
            <Route path="/palmistry" element={<PalmReading />} />
            <Route path="/face-reading" element={<FaceReading />} />
            <Route path="/comprehensive" element={<ComprehensiveAnalysis />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
