import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Crown,
  Star,
  Hand,
  Sparkles,
  CheckCircle,
  ArrowRight,
  LogOut,
  CreditCard,
} from 'lucide-react';
import apiClient from '../api/apiClient';
import { useAuth } from '../hooks/useAuth';
import { Logo } from './Logo';

const tierLabels: Record<string, string> = {
  free: 'Cosmic Explorer',
  premium: 'Astral',
  professional: 'Cosmic Master',
};

export function Profile() {
  const { user, signOut, syncUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasAstrology, setHasAstrology] = useState(false);
  const [hasPalm, setHasPalm] = useState(false);
  const [hasFace, setHasFace] = useState(false);
  const [hasInsight, setHasInsight] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (syncUser) {
        await syncUser();
      }

      try {
        const response = await apiClient.get('readings');
        if (response.data.success) {
          const { astrology, palmistry, face, insights } = response.data.data;
          setHasAstrology(astrology.length > 0);
          setHasPalm(palmistry.length > 0);
          setHasFace(face.length > 0);
          setHasInsight(insights && insights.length > 0);
        }
      } catch (error) {
        console.error('Error loading profile readings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [syncUser]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const tier = user?.subscriptionTier || 'free';
  const completedCount = [hasAstrology, hasPalm, hasFace].filter(Boolean).length;

  const readingItems = [
    { label: 'Vedic Astrology', done: hasAstrology, icon: Star, path: '/astrology' },
    { label: 'Palm Reading', done: hasPalm, icon: Hand, path: '/palmistry' },
    { label: 'Face Reading', done: hasFace, icon: User, path: '/face-reading' },
    { label: 'Career Insight', done: hasInsight, icon: Sparkles, path: '/comprehensive' },
  ];

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 flex justify-center py-24">
        <div className="w-10 h-10 border-2 border-white/20 border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <Logo size="xl" showText={false} />
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-bold text-white mb-1">
              {user?.fullName || 'LifeOn66 Member'}
            </h1>
            <p className="text-white/60 flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-4 h-4" />
              {user?.email}
            </p>
          </div>
          <div className="px-4 py-2 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-200 text-sm font-semibold flex items-center gap-2">
            <Crown className="w-4 h-4" />
            {tierLabels[tier] || tier}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Readings Complete</p>
            <p className="text-2xl font-bold text-white">{completedCount} / 3</p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Career Report</p>
            <p className="text-2xl font-bold text-white">{hasInsight ? 'Ready' : 'Pending'}</p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-white mb-4">Your Reading Progress</h2>
        <div className="space-y-3 mb-8">
          {readingItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3 hover:bg-white/10 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-amber-300" />
                  <span className="text-white">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.done ? (
                    <span className="text-green-400 text-sm flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Done
                    </span>
                  ) : (
                    <span className="text-white/40 text-sm">Start</span>
                  )}
                  <ArrowRight className="w-4 h-4 text-white/40" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate('/pricing')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            <CreditCard className="w-5 h-5" />
            Manage Plans
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/15 transition-colors"
          >
            <Star className="w-5 h-5" />
            Go to Dashboard
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 font-semibold hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}
