export interface FacialFeatureProfile {
  feature: string;
  region: string;
  primaryMeaning: string;
  careerIndications: string[];
  personalityTraits: string[];
  leadershipIndicators: string;
  challenges: string[];
}

export interface FaceShapeProfile {
  shape: string;
  chineseElement?: string;
  dominantTraits: string[];
  naturalCareers: string[];
  workStyle: string;
  leadershipStyle: string;
  financialPattern: string;
  challenges: string[];
}

export const FACE_SHAPES: Record<string, FaceShapeProfile> = {
  oval: {
    shape: 'Oval Face',
    chineseElement: 'Wood',
    dominantTraits: ['Diplomatic balance', 'Adaptability', 'Emotional intelligence', 'Social grace', 'Versatility'],
    naturalCareers: ['Diplomacy and international relations', 'Human resources leadership', 'Sales and business development', 'Counseling and mediation', 'Public relations', 'Management consulting', 'Marketing direction'],
    workStyle: 'Balanced between task and relationship orientation. Naturally diplomatic and able to work effectively with diverse personality types. You create harmony in complex team environments.',
    leadershipStyle: 'Inclusive and consensus-building. You lead by creating shared vision and ensuring everyone feels heard. Your teams are highly cohesive.',
    financialPattern: 'Steady, consistent earner who builds wealth through relationships and partnerships. Long-term financial planning comes naturally.',
    challenges: ['Avoiding difficult decisions to preserve harmony', 'Being too diplomatic when clarity is needed', 'Over-extending in too many social obligations']
  },
  round: {
    shape: 'Round Face',
    chineseElement: 'Metal',
    dominantTraits: ['Warmth and generosity', 'People-focus', 'Emotional depth', 'Social magnetism', 'Community orientation'],
    naturalCareers: ['Healthcare administration', 'Social work and NGO leadership', 'Hospitality management', 'Community development', 'Public service', 'Customer experience management', 'Early childhood education'],
    workStyle: 'Deeply people-centered and community-focused. You bring warmth and humanity to organizational culture. You are the person others turn to for emotional support in the workplace.',
    leadershipStyle: 'Servant leadership — your focus is on the wellbeing and growth of the people you lead. You create extraordinary team loyalty through genuine care.',
    financialPattern: 'Money flows through service to others. Generous with resources — must consciously build financial discipline.',
    challenges: ['Over-giving to the point of self-neglect', 'Difficulty making hard decisions affecting people negatively', 'Setting boundaries with emotionally demanding colleagues']
  },
  square: {
    shape: 'Square Face',
    chineseElement: 'Earth',
    dominantTraits: ['Determination', 'Practicality', 'Physical courage', 'Straightforwardness', 'Reliability'],
    naturalCareers: ['Military and law enforcement leadership', 'Construction and real estate', 'Athletic coaching', 'Engineering management', 'Political administration', 'Sports and fitness industry', 'Manufacturing operations'],
    workStyle: 'Direct, decisive, and action-oriented. You prefer clear objectives and measurable outcomes over abstract concepts. You build with your hands — whether literal construction or organizational architecture.',
    leadershipStyle: 'Command-and-control with a strong sense of personal responsibility. Your word is your bond. Teams know exactly where they stand with you.',
    financialPattern: 'Builds material wealth through sustained physical or structural effort. Real estate and tangible assets are natural wealth stores.',
    challenges: ['Inflexibility when circumstances require adaptation', 'Difficulty with emotional nuance in team management', 'Aggressiveness perceived as overbearing']
  },
  rectangular: {
    shape: 'Rectangular/Oblong Face',
    chineseElement: 'Wood',
    dominantTraits: ['Intellectual dominance', 'Strategic thinking', 'Authority and control', 'High standards', 'Organizational mastery'],
    naturalCareers: ['Corporate executive leadership', 'Government administration', 'Legal practice', 'Academic research direction', 'Financial management', 'Political strategy', 'Organizational consulting'],
    workStyle: 'Systematic, goal-driven, and authority-focused. You are highly organized and expect the same from others. You think in frameworks and structures.',
    leadershipStyle: 'Strategic and organizational. You build systems that outlast your personal tenure. Leadership is about creating institutional excellence.',
    financialPattern: 'Strong financial management and wealth preservation instincts. Income from institutional roles and long-term strategic investments.',
    challenges: ['Over-controlling tendencies stifling team creativity', 'Difficulty connecting emotionally with team members', 'Workaholism at personal cost']
  },
  triangular: {
    shape: 'Triangular (Narrow Forehead, Wide Jaw)',
    chineseElement: 'Fire',
    dominantTraits: ['Physical determination', 'Practical ambition', 'Material drive', 'Stubbornness', 'Ground-level wisdom'],
    naturalCareers: ['Trade businesses and skilled work', 'Physical industries', 'Sports management', 'Small business ownership', 'Real estate investment', 'Agricultural enterprise'],
    workStyle: 'Highly practical and materially motivated. You understand ground-level realities better than most executives. You build from the foundation up.',
    leadershipStyle: 'Lead from the front with personal example. You respect those who work hard and have little patience for theoretical managers.',
    financialPattern: 'Strong at building wealth from scratch through personal effort and practical business sense.',
    challenges: ['Limited long-range vision', 'Difficulty with abstract strategy', 'Resistance to formal education or credential requirements']
  },
  heartShaped: {
    shape: 'Heart/Inverted Triangle (Wide Forehead, Narrow Chin)',
    chineseElement: 'Fire',
    dominantTraits: ['Creative genius', 'Intuitive intelligence', 'Emotional sensitivity', 'Analytical depth', 'Visionary capacity'],
    naturalCareers: ['Scientific research and discovery', 'Creative direction', 'Technology innovation', 'Writing and philosophy', 'Spiritual leadership', 'Artistic mastery', 'Psychological research'],
    workStyle: 'Driven by ideas and creative vision. Your mind works at a higher level of abstraction than most. You need intellectual freedom and creative autonomy.',
    leadershipStyle: 'Thought leadership — you lead through the power of ideas and vision. People follow your thinking, not just your authority.',
    financialPattern: 'Income tied to intellectual property, creative output, and innovative solutions. Must pair vision with execution-focused partners.',
    challenges: ['Physical stamina and health requiring attention', 'Difficulty with routine execution', 'Emotional sensitivity to criticism of creative work', 'Perfectionism creating completion delays']
  },
  diamond: {
    shape: 'Diamond Face',
    chineseElement: 'Metal',
    dominantTraits: ['Analytical precision', 'Independent thinking', 'High standards', 'Intensity of focus', 'Perfectionism'],
    naturalCareers: ['Scientific research', 'Medical specialization', 'Forensic investigation', 'Technology architecture', 'Financial analysis', 'Quality assurance direction', 'Academic specialization'],
    workStyle: 'Highly independent and analytically driven. You go deep on problems rather than wide. You prefer to be the acknowledged expert in a narrow domain of excellence.',
    leadershipStyle: 'Expert authority — people follow your specialized knowledge and analytical depth. You lead through demonstrated mastery.',
    financialPattern: 'Income through specialized expertise. High earning potential in niche domains of deep competence.',
    challenges: ['Interpersonal communication difficulties', 'Impatience with less analytical colleagues', 'Isolation from rejecting collaborative approaches']
  }
};

export const FOREHEAD_ANALYSIS: FacialFeatureProfile = {
  feature: 'Forehead',
  region: 'Upper Third of Face — Heaven Region',
  primaryMeaning: 'Intelligence, intellectual capacity, early career fortune, and relationship with authority figures',
  careerIndications: [
    'High and broad forehead: Exceptional intellectual capacity — suited for leadership, research, academia, and high-complexity analysis',
    'Narrow forehead: Practical intelligence over theoretical — excels in hands-on, practical domains',
    'Straight forehead: Direct, logical thinking style — engineering, law, mathematics',
    'Rounded forehead: Creative and imaginative intelligence — arts, creative direction, innovation',
    'Forehead with prominent ridges: Intense mental concentration — research, philosophy, deep technical work'
  ],
  personalityTraits: ['Intelligence level', 'Learning capacity', 'Early career trajectory', 'Relationship with father figures and authority'],
  leadershipIndicators: 'Broad, high forehead with clear complexion indicates intellectual leadership capacity and ability to command authority through intelligence.',
  challenges: ['Very high forehead with poor career grounding: Brilliant but impractical', 'Very low forehead: Strong practical skills but may struggle in intellectual environments']
};

export const EYE_ANALYSIS: FacialFeatureProfile = {
  feature: 'Eyes',
  region: 'Middle Third of Face',
  primaryMeaning: 'Intelligence, emotional depth, trust capacity, and professional vision',
  careerIndications: [
    'Large, bright eyes: Openness, creativity, and magnetic presence — ideal for leadership, arts, and public-facing roles',
    'Small, piercing eyes: Intense concentration and analytical depth — research, surgery, finance, investigation',
    'Deep-set eyes: Observational intelligence and reserve — strategy, analysis, behind-the-scenes leadership',
    'Prominent/Protruding eyes: Memory excellence and social awareness — sales, politics, public relations',
    'Almond-shaped eyes: Balance of intelligence and emotional sensitivity — counseling, HR, diplomatic roles',
    'Single eyelid eyes (Eastern): Intense focus and practical intelligence — technology, business, meticulous work',
    'Eyes set wide apart: Broad perspective and patience — diplomacy, management, long-term planning',
    'Eyes set close together: Intense focus and concentration — research, specialist work, technical mastery'
  ],
  personalityTraits: ['Depth of intelligence', 'Emotional capacity', 'Trust and transparency', 'Observation and awareness'],
  leadershipIndicators: 'Clear, bright, direct gaze indicates confidence and trustworthiness — critical leadership qualities. The ability to hold steady eye contact signals authority.',
  challenges: ['Shifty eyes: Difficulty being trusted in leadership positions', 'Very small eyes with poor complexion: Narrowness of perspective limiting career growth']
};

export const NOSE_ANALYSIS: FacialFeatureProfile = {
  feature: 'Nose',
  region: 'Middle Third of Face — Financial Center',
  primaryMeaning: 'Financial fortune, ambition, self-confidence, and earning power',
  careerIndications: [
    'Large, well-shaped nose: Strong financial instincts and wealth-building capacity — business, finance, entrepreneurship',
    'Prominent, fleshy tip (Bulbous): Exceptional wealth accumulation ability — finance, real estate, commerce',
    'Thin, refined nose: Financial sensitivity and appreciation of quality — arts, luxury, fashion',
    'Aquiline/Hooked nose: Powerful, authoritative financial figure — finance, law, leadership',
    'Straight nose: Balanced ambition and reliable financial management',
    'Upturned nose: Generous with money but may overspend — needs financial management systems',
    'Wide nostrils: Generous financial nature and broad earning from multiple sources',
    'Narrow nostrils: Conservative with money and resources — strong saving capacity'
  ],
  personalityTraits: ['Financial ambition', 'Wealth accumulation capacity', 'Self-confidence level', 'Earning and spending patterns'],
  leadershipIndicators: 'Strong, prominent nose with fleshy, well-developed tip indicates financial authority and natural business leadership.',
  challenges: ['Very large nose with poor shape: Ambition exceeding capacity creating overreach', 'Flat or very small nose: Financial management challenges requiring professional guidance']
};

export const MOUTH_ANALYSIS: FacialFeatureProfile = {
  feature: 'Mouth and Lips',
  region: 'Lower Third of Face',
  primaryMeaning: 'Communication power, generosity, sensuality, and authority in expression',
  careerIndications: [
    'Wide mouth: Strong communication presence — leadership, oratory, sales, broadcasting',
    'Narrow mouth: Private and selective communication — research, writing, analysis',
    'Full, well-defined lips: Generous nature and strong communication — HR, counseling, public speaking',
    'Thin lips: Precision in communication — legal, technical, and analytical roles',
    'Well-defined Cupid\'s bow upper lip: Excellent communication intelligence — writing, language, media',
    'Large upper lip: Strong communication and expressive capacity — arts, politics, media',
    'Strong lower lip: Material desires and practical execution ability — business, operations'
  ],
  personalityTraits: ['Communication style and power', 'Generosity and sharing nature', 'Sensuality and life enjoyment', 'Authority in expression'],
  leadershipIndicators: 'Wide, well-defined mouth with good upper-lower lip balance indicates commanding communication ability — a fundamental leadership quality.',
  challenges: ['Very thin lips: Communication coldness creating difficulty in relationship-dependent careers', 'Downturned corners: Pessimism affecting team morale and leadership effectiveness']
};

export const CHIN_ANALYSIS: FacialFeatureProfile = {
  feature: 'Chin and Jaw',
  region: 'Lower Third of Face — Earth Region',
  primaryMeaning: 'Determination, later career fortune, financial security in old age, and will power',
  careerIndications: [
    'Strong, prominent chin: Exceptional determination, will power, and late-career success — executive roles, entrepreneurship',
    'Square chin: Physical courage and determination — military, athletics, construction, engineering',
    'Round chin: Emotional resilience and generosity — healthcare, counseling, service industries',
    'Pointed chin: Analytical intelligence and creative sensitivity — research, arts, writing',
    'Receding chin: Collaborative rather than dominant — support roles, partnership-based work',
    'Double chin: Material comfort and financial security orientation — business with stability focus',
    'Cleft chin: Dramatic flair and desire for recognition — entertainment, performance, media'
  ],
  personalityTraits: ['Determination and will power', 'Later career and retirement fortune', 'Material security orientation', 'Physical resilience'],
  leadershipIndicators: 'Strong, well-defined chin and jaw indicates sustained determination — the ability to persist through long-term career challenges that defeat others.',
  challenges: ['Weak chin: Difficulty maintaining career trajectory under pressure', 'Very jutting chin: Over-aggressive behavior creating professional conflicts']
};

export const EAR_ANALYSIS: FacialFeatureProfile = {
  feature: 'Ears',
  region: 'Side of Head',
  primaryMeaning: 'Intelligence type, learning style, and fate or divine protection',
  careerIndications: [
    'Large ears with well-defined rims: High intelligence and good fortune — education, research, philosophy',
    'Ears set high on head: Quick thinking and sharp intelligence — technology, medicine, law',
    'Ears set low on head: Practical intelligence and physical capability — trades, engineering, physical work',
    'Close to head: Conventional and disciplined approach — corporate, institutional roles',
    'Prominent/protruding ears: Independent thinking and willingness to diverge from convention — entrepreneurship, innovation',
    'Thick, fleshy lobes: Wealth and material fortune indication — business, finance',
    'Attached earlobes: Community orientation and connection to tradition — teaching, community service'
  ],
  personalityTraits: ['Intelligence type and learning style', 'Relationship to fate and fortune', 'Conventional vs. unconventional orientation'],
  leadershipIndicators: 'Large, well-shaped ears positioned high on the head indicate high intelligence and the capacity to hear subtleties others miss — a key leadership advantage.',
  challenges: ['Very small ears: Limited learning capacity or resistance to feedback', 'Malformed ears: Life challenges requiring extraordinary resilience']
};

export const EYEBROW_ANALYSIS: FacialFeatureProfile = {
  feature: 'Eyebrows',
  region: 'Upper Middle Face',
  primaryMeaning: 'Character, relationship with siblings and peers, career authority, and emotional control',
  careerIndications: [
    'Thick, well-defined eyebrows: Strong character, authority, and professional presence — leadership, management',
    'High-arching eyebrows: Creative and aesthetic sensitivity — arts, design, entertainment',
    'Straight eyebrows: Logical, analytical approach — engineering, science, research, finance',
    'Connected eyebrows (unibrow): Intense concentration and independence — deep research, solitary creative work',
    'Thin eyebrows: Sensitive and refined nature — counseling, healing, arts, aesthetics',
    'Short eyebrows: Independent and sometimes isolated nature — individual contributor roles',
    'Long eyebrows extending past eye: Long-lasting career relationships and network building capacity'
  ],
  personalityTraits: ['Character strength', 'Relationship with authority and peers', 'Emotional control', 'Career authority level'],
  leadershipIndicators: 'Thick, well-defined, well-shaped eyebrows signal strong character and authority — people naturally defer to individuals with commanding eyebrows.',
  challenges: ['Very thin eyebrows: Weak character projection limiting leadership authority', 'Chaotic or poorly defined eyebrows: Inconsistent character creating trust issues in leadership']
};

export const CAREER_READING_BY_FACE_AGE = {
  youth: {
    ageRange: '0-30',
    region: 'Forehead (Heaven Region)',
    interpretation: 'The forehead predicts early career opportunities, educational success, and relationship with father/authority figures. High, clear forehead = strong early career foundation.'
  },
  middle: {
    ageRange: '30-50',
    region: 'Eyes, Nose, Cheekbones (Human Region)',
    interpretation: 'The middle face predicts peak career years, financial accumulation, and social authority. Strong cheekbones with a prominent nose = peak career power and financial success.'
  },
  later: {
    ageRange: '50+',
    region: 'Mouth, Chin, Jaw (Earth Region)',
    interpretation: 'The lower face predicts late career success, retirement fortune, and lasting legacy. Strong jaw and full lower face = prosperity and comfort in later years.'
  }
};

export const CHEEKBONE_ANALYSIS = {
  prominent: {
    meaning: 'High cheekbones indicate authority, determination, and the power to influence others.',
    career: 'Natural authority figure — suited for executive leadership, military command, political office, and any position requiring sustained personal authority.',
    additional: 'In Chinese face reading, prominent cheekbones signal the capacity to hold and exercise power — the higher the cheekbones, the greater the natural authority.'
  },
  flat: {
    meaning: 'Flat cheekbones indicate a supportive, collaborative, and less authority-seeking nature.',
    career: 'Best in supportive leadership, collaborative team roles, and positions where influence comes through expertise rather than personal authority.',
    additional: 'Flat cheekbones with a strong chin indicate quiet determination — achieving goals through persistence rather than dominance.'
  },
  asymmetric: {
    meaning: 'Mild facial asymmetry is normal and indicates uniqueness of character.',
    career: 'Unique combination of dominant and supportive tendencies — ability to move between leadership and collaboration fluidly.',
    additional: 'Significant asymmetry may indicate multiple distinct life phases with different career orientations.'
  }
};
