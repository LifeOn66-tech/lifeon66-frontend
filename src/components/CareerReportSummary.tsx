import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, Zap, AlertCircle, CheckCircle, Target, DollarSign } from 'lucide-react';

interface CareerMatch {
  title: string;
  matchScore: number;
  reasoning: string;
  salaryRange: string;
  growthPotential: string;
}

interface Analysis {
  topCareerMatches: CareerMatch[];
  strengthsSummary: string[];
  developmentAreas: string[];
  confidenceScore: number;
}

interface Props {
  analysis: Analysis;
}

export default function CareerReportSummary({ analysis }: Props) {
  const top = analysis.topCareerMatches[0];
  const topStrengths = analysis.strengthsSummary.slice(0, 3);
  const topGaps = analysis.developmentAreas.slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600/40 to-teal-600/40 px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-teal-300" />
          <h2 className="text-white font-bold text-lg">Career Report Summary</h2>
        </div>
        <span className="text-sm font-semibold text-teal-300 bg-teal-400/10 px-3 py-1 rounded-full border border-teal-400/30">
          {analysis.confidenceScore}% confidence
        </span>
      </div>

      <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="sm:col-span-2 lg:col-span-2 bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-start gap-3 mb-3">
            <Briefcase className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-blue-200 uppercase tracking-wide font-semibold mb-0.5">Best Career Fit</p>
              <p className="text-white font-bold text-base leading-tight">{top.title}</p>
            </div>
            <span className="ml-auto text-2xl font-bold text-green-400">{top.matchScore}%</span>
          </div>
          <p className="text-blue-100 text-sm leading-relaxed">{top.reasoning}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            <span className="flex items-center gap-1 text-green-300">
              <DollarSign className="w-3.5 h-3.5" />
              {top.salaryRange}
            </span>
            <span className="flex items-center gap-1 text-sky-300">
              <TrendingUp className="w-3.5 h-3.5" />
              {top.growthPotential}
            </span>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-yellow-400" />
            <p className="text-xs text-yellow-200 uppercase tracking-wide font-semibold">Top Strengths</p>
          </div>
          <ul className="space-y-2">
            {topStrengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-blue-100">
                <CheckCircle className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <p className="text-xs text-amber-200 uppercase tracking-wide font-semibold">Focus Areas</p>
          </div>
          <ul className="space-y-2">
            {topGaps.map((g, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-blue-100">
                <span className="text-amber-400 mt-0.5 flex-shrink-0">›</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-xs text-blue-300 font-semibold uppercase tracking-wide mb-1">Other Top Matches</p>
            {analysis.topCareerMatches.slice(1).map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs mt-1">
                <span className="text-blue-100 truncate">{c.title}</span>
                <span className="text-green-400 font-bold ml-2">{c.matchScore}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
