import apiClient from '../api/apiClient';

export interface ReadingsList {
  astrology: Record<string, unknown>[];
  palmistry: Record<string, unknown>[];
  face: Record<string, unknown>[];
  insights: Record<string, unknown>[];
}

export function parseReadingsList(data: unknown): ReadingsList {
  const payload = (data ?? {}) as Record<string, unknown>;
  return {
    astrology: Array.isArray(payload.astrology) ? payload.astrology : [],
    palmistry: Array.isArray(payload.palmistry) ? payload.palmistry : [],
    face: Array.isArray(payload.face) ? payload.face : [],
    insights: Array.isArray(payload.insights) ? payload.insights : [],
  };
}

export async function fetchReadingsList(): Promise<ReadingsList | null> {
  try {
    const response = await apiClient.get('readings', { timeout: 120000 });
    if (!response.data?.success) return null;
    return parseReadingsList(response.data.data);
  } catch (error) {
    console.error('Error fetching readings:', error);
    return null;
  }
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }
  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }
  return [];
}

export interface NormalizedCareerMatch {
  title: string;
  matchScore: number;
  reasoning: string;
  salaryRange: string;
  growthPotential: string;
}

export interface PathwayStep {
  month: string;
  title: string;
  description: string;
  actions: string[];
  milestones: string[];
}

function normalizePathwaySteps(value: unknown): PathwayStep[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((step) => {
      const item = (step ?? {}) as Record<string, unknown>;
      return {
        month: String(item.month || ''),
        title: String(item.title || ''),
        description: String(item.description || ''),
        actions: asStringArray(item.actions),
        milestones: asStringArray(item.milestones),
      };
    })
    .filter((step) => step.title || step.description);
}

export interface NormalizedInsightAnalysis {
  topCareerMatches: NormalizedCareerMatch[];
  sixMonthPathway: PathwayStep[];
  threeYearPathway: PathwayStep[];
  strengthsSummary: string[];
  developmentAreas: string[];
  confidenceScore: number;
}

export function normalizeInsightAnalysis(
  insight: Record<string, unknown>,
  fallbackReason = 'Based on your combined astrology, palmistry, and face readings.'
): NormalizedInsightAnalysis {
  const topCareerPaths = (insight.topCareerPaths || insight.topCareerMatches || []) as unknown;
  const rawMatches = Array.isArray(topCareerPaths) ? topCareerPaths : [];

  const topCareerMatches = rawMatches
    .map((career) => {
      const item = (career ?? {}) as Record<string, unknown>;
      return {
        title: String(item.title || item.name || '').trim(),
        matchScore: Number(item.matchScore ?? item.score ?? 0),
        reasoning: String(item.reasoning || item.description || insight.synthesizedRecommendation || fallbackReason),
        salaryRange: String(item.salaryRange || 'Varies by region'),
        growthPotential: String(item.growthPotential || 'High'),
      };
    })
    .filter((career) => career.title);

  if (topCareerMatches.length === 0) {
    topCareerMatches.push({
      title: 'Recommended Career Path',
      matchScore: Number(insight.confidenceScore ?? 75) || 75,
      reasoning: String(insight.synthesizedRecommendation || insight.summary || fallbackReason),
      salaryRange: 'Varies by region',
      growthPotential: 'High',
    });
  }

  return {
    topCareerMatches,
    sixMonthPathway: normalizePathwaySteps(insight.sixMonthPathway),
    threeYearPathway: normalizePathwaySteps(insight.threeYearPathway),
    strengthsSummary: asStringArray(insight.strengths || insight.strengthsSummary),
    developmentAreas: asStringArray(insight.challenges || insight.developmentAreas),
    confidenceScore: Number(insight.confidenceScore ?? 75) || 75,
  };
}
