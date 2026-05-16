// v1.0.3 - Explicit cleanup of old logic
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown, ArrowRight, Loader2, Share2, CheckCircle, Lock, Unlock, MessageCircle, Send, Mail, Twitter, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../api/apiClient';

interface PaymentSuccessData {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  tier: string;
  receiptUrl: string | null;
}

export default function PricingPlans() {
  const { user, syncUser } = useAuth();
  const navigate = useNavigate();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [paymentSuccessData, setPaymentSuccessData] = useState<PaymentSuccessData | null>(null);
  const [downloadingTier, setDownloadingTier] = useState<string | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);


  const handleDownloadPdf = async (tier: string) => {
    setDownloadingTier(tier);
    try {
      const [readingsRes, insightRes] = await Promise.all([
        apiClient.get('/readings'),
        apiClient.get('/readings/insight')
      ]);

      if (!readingsRes.data.success || !insightRes.data.success) {
        alert("Career analysis data not found. Please complete your readings first.");
        navigate('/comprehensive');
        return;
      }

      const { astrology, palmistry, face } = readingsRes.data.data;
      const insight = insightRes.data.data;

      const analysis = {
        topCareerMatches: insight.topCareerPaths,
        sixMonthPathway: insight.sixMonthPathway,
        threeYearPathway: insight.threeYearPathway,
        strengthsSummary: insight.strengths,
        developmentAreas: insight.challenges,
        confidenceScore: insight.confidenceScore
      };

      const fullData = {
        astrology: astrology[0],
        palmistry: palmistry[0],
        face: face[0]
      };

      const response = await apiClient.post('/reports/generate', {
        language: 'en',
        analysis,
        fullData,
        tier
      }, {
        responseType: 'blob'
      });

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `LifeOn66_Report_${tier}_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate report.');
    } finally {
      setDownloadingTier(null);
    }
  };

  const handleSubscribe = async (tier: string) => {
    if (!user) {
      alert("Please login first.");
      navigate('/login');
      return;
    }

    if (syncUser) await syncUser();
    setErrorMsg(null);

    try {
      setLoadingTier(tier);
      
      try {
        const syncRes = await apiClient.get('/auth/me');
        if (syncRes.data.success) {
          const freshUser = syncRes.data.data;
          if (freshUser.subscriptionTier !== user?.subscriptionTier) {
            if (tier === 'free') {
              sessionStorage.setItem('pendingPdfTier', tier);
              navigate('/comprehensive');
              return;
            }
          }
        }
      } catch (syncErr) {
        console.warn('[Pricing] Sync failed');
      }

      const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SmtdodyyixI88i';
      
      // Load Razorpay script on-demand if not already present
      if (!(window as any).Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
          document.body.appendChild(script);
        });
      }

      const response = await apiClient.post('/payments/create-order', { tier });

      if (response.data.success) {
        const { orderId, amount, currency, paymentLink } = response.data;

        if (!(window as any).Razorpay) {
          if (paymentLink) {
            if (confirm("Razorpay script not loaded. Use direct payment link?")) {
              window.open(paymentLink, '_blank');
              setLoadingTier(null);
              return;
            }
          } else {
            alert("Razorpay not available.");
            setLoadingTier(null);
            return;
          }
        }

        const options = {
          key: rzpKey,
          amount: amount,
          currency: currency,
          name: 'LifeOn66',
          description: `Unlock ${tier.charAt(0).toUpperCase() + tier.slice(1)} Report`,
          order_id: orderId,
          handler: async (response: any) => {
            try {
              setLoadingTier(tier);
              const verifyRes = await apiClient.post('/payments/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyRes.data.success) {
                setPaymentSuccessData({
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  amount: amount / 100,
                  currency: currency,
                  tier: tier,
                  receiptUrl: verifyRes.data.receiptUrl || null
                });
              }
            } catch (err: any) {
              alert("Verification failed.");
            } finally {
              setLoadingTier(null);
            }
          },
          prefill: { name: user?.fullName || '', email: user?.email || '' },
          theme: { color: '#8b5cf6' },
          modal: { ondismiss: () => setLoadingTier(null) }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (response: any) => {
          setErrorMsg(`Payment failed: ${response.error.description}`);
          setLoadingTier(null);
        });
        rzp.open();
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setErrorMsg(err.response?.data?.message || "Failed to initiate payment.");
    } finally {
      setLoadingTier(null);
    }
  };

  const handleSocialShare = (platform: string) => {
    const receiptUrl = paymentSuccessData?.receiptUrl;
    
    // Clean the API URL and ensure it has the /api prefix for the share route
    const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const cleanApiUrl = rawApiUrl.replace(/\/$/, '');
    const apiBase = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;
    
    const shareUrl = `${apiBase}/payments/share/${paymentSuccessData?.paymentId}`;

    const tierLabels: Record<string, string> = {
      free: 'Cosmic Explorer', premium: 'Astral', professional: 'Cosmic Master'
    };
    const tierLabel = tierLabels[paymentSuccessData?.tier || 'free'] || paymentSuccessData?.tier || '';

    const message = receiptUrl
      ? `🧾 *LifeOn66 Payment Receipt*\n\n*Plan:* ${tierLabel}\n*Amount:* ${paymentSuccessData?.currency} ${paymentSuccessData?.amount}\n*Payment ID:* ${paymentSuccessData?.paymentId}\n*Date:* ${new Date().toLocaleDateString()}\n\n🖼️ *View Receipt Image:*\n${shareUrl}`
      : `🧾 *LifeOn66 Payment Receipt*\n\n*Plan:* ${tierLabel}\n*Amount:* ${paymentSuccessData?.currency} ${paymentSuccessData?.amount}\n*Payment ID:* ${paymentSuccessData?.paymentId}\n*Date:* ${new Date().toLocaleDateString()}`;

    const text = encodeURIComponent(message);

    switch (platform) {
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
        setToastMsg("✅ Opening WhatsApp...");
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(receiptUrl || 'https://lifeon66.com')}&text=${text}`, '_blank');
        setToastMsg("✅ Opening Telegram...");
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
        setToastMsg("✅ Opening Twitter...");
        break;
      case 'email': {
        const emailBody = encodeURIComponent(
          `LifeOn66 Payment Receipt\n\nPlan: ${tierLabel}\nAmount: ${paymentSuccessData?.currency} ${paymentSuccessData?.amount}\nPayment ID: ${paymentSuccessData?.paymentId}\nDate: ${new Date().toLocaleDateString()}` +
          (receiptUrl ? `\n\nView Receipt Image:\n${shareUrl}` : '')
        );
        window.open(`mailto:?subject=LifeOn66 Payment Receipt&body=${emailBody}`, '_blank');
        setToastMsg("✅ Opening Email...");
        break;
      }
    }
    setShowShareOptions(false);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const tiers = [
    {
      id: 'free',
      name: 'Cosmic Explorer',
      icon: <Star className="w-6 h-6 text-blue-400" />,
      price: 'Free',
      description: 'Basic insights into your cosmic blueprint.',
      features: [
        '10-Page Report',
        'Basic Astrology Overview',
        'Palmistry Base Analysis',
        'Face Reading Summary',
        'All Uploaded Images Included',
        'Standard PDF Generation',
      ],
      buttonText: 'Download Free Report',
      color: 'from-blue-500 to-cyan-500',
      borderClass: 'border-blue-500/30',
    },
    {
      id: 'premium',
      name: 'Astral',
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      price: '$5.00',
      description: 'Deep insights with comprehensive pathway planning.',
      features: [
        '15-Page Detailed Report',
        'Full Astrological Houses',
        'Detailed Palmistry Line Analysis',
        'Face Reading Trait Matching',
        'All Uploaded Images Included',
        '3-Year Career Roadmap',
        'High-Resolution PDF',
      ],
      buttonText: 'Unlock Astral Report',
      color: 'from-yellow-500 via-orange-500 to-red-500',
      borderClass: 'border-yellow-500/50 shadow-[0_0_40px_rgba(234,179,8,0.3)]',
      popular: true,
    },
    {
      id: 'professional',
      name: 'Cosmic Master',
      icon: <Crown className="w-6 h-6 text-purple-400" />,
      price: '$10.00',
      description: 'The ultimate detailed analysis with full reading explanations.',
      features: [
        '25-Page Exhaustive Report',
        'Full Planetary Dosha/Yoga',
        'Day-by-Day Action Plans',
        'All Uploaded Images Included',
        'Deep Palm & Face Interpretations',
        'Micro-Milestones Roadmap',
        'Priority Generation',
      ],
      buttonText: 'Unlock Cosmic Master Report',
      color: 'from-purple-500 to-pink-500',
      borderClass: 'border-purple-500/30',
    },
  ];

  if (paymentSuccessData) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center min-h-[60vh] flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/40 backdrop-blur-xl border border-green-500/50 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(34,197,94,0.15)]"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
          <p className="text-white/70 mb-8">Your transaction has been processed.</p>
          
          <div className="bg-white/5 rounded-xl p-6 text-left border border-white/10 mb-8">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
              <span className="text-white/60 text-sm">Receipt Amount</span>
              <span className="text-2xl font-bold text-white">{paymentSuccessData.currency} {paymentSuccessData.amount}</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Plan</span>
                <span className="text-white font-medium capitalize">{paymentSuccessData.tier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Payment ID</span>
                <span className="text-white/80 font-mono text-xs">{paymentSuccessData.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Date</span>
                <span className="text-white/80">{new Date().toLocaleDateString()}</span>
              </div>
              {paymentSuccessData.receiptUrl && (
                <div className="pt-3 border-t border-white/10">
                  <a
                    href={paymentSuccessData.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    View Receipt Image
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => setShowShareOptions(v => !v)}
                className="flex-1 px-6 py-3 rounded-xl font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share Receipt
              </button>
              <button
                onClick={() => handleDownloadPdf(paymentSuccessData.tier)}
                disabled={downloadingTier !== null}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {downloadingTier ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                Download Report
              </button>
            </div>

            {showShareOptions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <p className="text-white/40 text-xs mb-3">
                  {paymentSuccessData.receiptUrl
                    ? '🖼️ Your receipt image will be sent as a link — it will preview beautifully in WhatsApp'
                    : '⚠️ Receipt image is still generating. Try again in a moment.'}
                </p>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-center gap-4">
                  <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center gap-1 group">
                    <div className="p-3 bg-green-500/20 hover:bg-green-500/40 text-green-400 rounded-full transition-colors group-hover:scale-110 duration-200">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <span className="text-white/40 text-xs">WhatsApp</span>
                  </button>
                  <button onClick={() => handleSocialShare('telegram')} className="flex flex-col items-center gap-1 group">
                    <div className="p-3 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded-full transition-colors group-hover:scale-110 duration-200">
                      <Send className="w-6 h-6" />
                    </div>
                    <span className="text-white/40 text-xs">Telegram</span>
                  </button>
                  <button onClick={() => handleSocialShare('twitter')} className="flex flex-col items-center gap-1 group">
                    <div className="p-3 bg-sky-500/20 hover:bg-sky-500/40 text-sky-400 rounded-full transition-colors group-hover:scale-110 duration-200">
                      <Twitter className="w-6 h-6" />
                    </div>
                    <span className="text-white/40 text-xs">Twitter</span>
                  </button>
                  <button onClick={() => handleSocialShare('email')} className="flex flex-col items-center gap-1 group">
                    <div className="p-3 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-full transition-colors group-hover:scale-110 duration-200">
                      <Mail className="w-6 h-6" />
                    </div>
                    <span className="text-white/40 text-xs">Email</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {toastMsg && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#1e293b]/90 backdrop-blur-md border border-green-500/50 text-white px-6 py-4 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.2)] flex items-center gap-3 font-medium tracking-wide whitespace-nowrap"
        >
          {toastMsg}
        </motion.div>
      )}

      <div className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          Choose Your Cosmic Journey
        </motion.h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Select the depth of analysis you need to uncover your true potential and optimal career pathway.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-8 max-w-2xl mx-auto bg-red-500/10 border border-red-500/40 rounded-xl p-4 text-red-300 text-sm text-center">
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className={`relative rounded-2xl bg-black/40 backdrop-blur-xl border ${tier.borderClass} p-8 flex flex-col h-full transition-all duration-300 group`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg">
                Most Popular
              </div>
            )}

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-white/60 text-sm">{tier.description}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">{tier.icon}</div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-white">{tier.price}</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className={`w-5 h-5 mr-3 flex-shrink-0 ${tier.id === 'premium' ? 'text-yellow-400' : tier.id === 'professional' ? 'text-purple-400' : 'text-blue-400'}`} />
                  <span className="text-white/80">{feature}</span>
                </li>
              ))}
            </ul>

            <motion.button
              onClick={() => {
                if (tier.id === 'free') {
                  handleDownloadPdf(tier.id);
                } else {
                  handleSubscribe(tier.id);
                }
              }}
              disabled={loadingTier !== null || downloadingTier !== null}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r ${tier.color} hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loadingTier === tier.id || downloadingTier === tier.id ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="tracking-wide">
                    {tier.id === 'free' ? 'Download Free Report' : tier.buttonText}
                  </span>
                  {tier.id === 'free' ? <Unlock className="w-4 h-4 opacity-70" /> : <Lock className="w-4 h-4 opacity-70" />}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-white/40 text-sm mt-10">
        Free tier generates your report immediately. Paid tiers unlock deeper analysis sections.
      </p>
    </div>
  );
}
