export interface LineProfile {
  name: string;
  sanskritName?: string;
  location: string;
  meaning: string;
  careerSignificance: string;
  strongIndicators: string[];
  weakIndicators: string[];
  absenceIndicators: string;
  branchesUpMeaning: string;
  branchesDownMeaning: string;
  islandMeaning: string;
  chainMeaning: string;
}

export interface MountProfile {
  name: string;
  planet: string;
  location: string;
  welldevelopedMeaning: string;
  overdevelopedMeaning: string;
  flatMeaning: string;
  careerFields: string[];
}

export interface HandTypeProfile {
  type: string;
  element: string;
  shape: string;
  dominantTraits: string[];
  careerSuggestions: string[];
  workStyle: string;
  leadershipStyle: string;
  strengths: string[];
  challenges: string[];
}

export const PALM_LINES: Record<string, LineProfile> = {
  lifeLine: {
    name: 'Life Line',
    sanskritName: 'Ayu Rekha',
    location: 'Curves around the base of the thumb',
    meaning: 'Represents vitality, physical energy, quality of life, and significant life events — NOT length of life',
    careerSignificance: 'Shows physical stamina for career pursuits, energy reserves for ambition, and resilience through professional challenges',
    strongIndicators: [
      'Deep, clear, unbroken curve: Strong constitution and sustained career energy',
      'Wide arc away from thumb: Adventurous spirit, entrepreneurial boldness, loves travel and risk',
      'Long line reaching wrist: Sustained vitality and lifelong career engagement',
      'Rising branches toward Jupiter mount: Ambitious career aspirations fulfilled through determination'
    ],
    weakIndicators: [
      'Pale or thin: Low physical energy requiring careful career selection — avoid exhausting roles',
      'Short line: Need for work-life integration, not necessarily short life',
      'Chained: Fluctuating health requiring flexible, non-physically demanding careers'
    ],
    absenceIndicators: 'Rare — when faint, indicates a person who lives primarily in mental/spiritual rather than physical realms',
    branchesUpMeaning: 'Career advancement and financial improvement at the point of the branch',
    branchesDownMeaning: 'Energy drains or career setbacks requiring recovery time',
    islandMeaning: 'Period of health challenges affecting career — illness, burnout, or significant life disruption',
    chainMeaning: 'Inconsistent energy levels requiring career structures that accommodate natural rhythms'
  },
  headLine: {
    name: 'Head Line',
    sanskritName: 'Mastishk Rekha',
    location: 'Runs horizontally across the middle of the palm',
    meaning: 'Represents intellectual capacity, thinking style, concentration, mental approach, and communication',
    careerSignificance: 'The single most important line for career success — reveals how you process information, make decisions, and apply intelligence professionally',
    strongIndicators: [
      'Long, deep line: Exceptional intellectual capacity and sustained mental focus — suited for complex, high-level work',
      'Straight across palm: Practical, realistic thinker — business, engineering, law, finance',
      'Gently curving downward: Creative imagination balanced with practicality — writer, designer, strategist',
      'Deeply curved toward Luna mount: Exceptional creative and intuitive ability — arts, healing, spiritual work',
      'Forked end (Writers Fork): Dual career track ability — analytical AND creative simultaneously',
      'Starting on Jupiter mount: Ambitious, self-driven intellectual who leads naturally'
    ],
    weakIndicators: [
      'Short or faint: Limited concentration span — requires structured, focus-supporting environments',
      'Broken: Mental shifts or career pivots — multiple distinct career phases',
      'Sloping too steeply: Fantasy over reality — needs grounding in practical application'
    ],
    absenceIndicators: 'Extremely rare — indicates primal instinct dominates rational thought',
    branchesUpMeaning: 'Intellectual achievements and career recognition — education, promotion, or academic success',
    branchesDownMeaning: 'Mental stress, depression, or decision regret at that life period',
    islandMeaning: 'Mental confusion, stress, or difficulty making clear decisions in the career',
    chainMeaning: 'Scattered thinking and difficulty concentrating — requires meditation and focus development'
  },
  heartLine: {
    name: 'Heart Line',
    sanskritName: 'Hridaya Rekha',
    location: 'Runs across the top of the palm under the fingers',
    meaning: 'Represents emotional nature, relationship style, empathy capacity, and how emotions influence decisions',
    careerSignificance: 'Reveals emotional intelligence, team dynamics, motivation style, and work relationship patterns',
    strongIndicators: [
      'Long, clear line reaching Jupiter: Deep empathy, loyal, highly emotionally intelligent — HR, counseling, teaching, leadership',
      'Curves upward toward Jupiter: Idealistic in relationships — seeks meaningful, purpose-driven work',
      'Straight line: Pragmatic emotional expression — business-like in professional relationships',
      'Multiple fine lines (emotional richness): High emotional bandwidth — excellent in team leadership and service',
      'Ending under Saturn: Balanced between emotional and rational — excellent for medicine, law, and finance'
    ],
    weakIndicators: [
      'Short or faint: Emotional detachment — excellent for technical work, research, and solitary professions',
      'Broken: Emotional vulnerability that needs healing before professional peak performance',
      'Chained: Over-emotional responses affecting professional judgment'
    ],
    absenceIndicators: 'Very rare — indicates someone who operates primarily through logic with minimal emotional consideration',
    branchesUpMeaning: 'Positive emotional relationships supporting career success — mentors, partners, and allies',
    branchesDownMeaning: 'Emotional disappointments or relationship losses affecting professional trajectory',
    islandMeaning: 'Emotional crisis period significantly affecting professional performance',
    chainMeaning: 'Chronic emotional sensitivity requiring deliberate emotional management for career effectiveness'
  },
  fateLine: {
    name: 'Fate Line (Saturn Line)',
    sanskritName: 'Bhagya Rekha',
    location: 'Runs vertically from base of palm toward Saturn (middle) finger',
    meaning: 'Represents career destiny, life direction, external influences on career, and the role of effort vs. fate in professional success',
    careerSignificance: 'The definitive career indicator — reveals whether your career follows a clear destiny line or requires self-construction',
    strongIndicators: [
      'Deep, clear line from wrist to Saturn: Very strong career destiny — professional success virtually assured through consistent effort',
      'Starting from Life Line: Career is entirely self-made — no inherited advantages, pure personal achievement',
      'Starting from Luna mount: Career success comes through public recognition, creativity, or the help of strangers',
      'Starting from base of palm (Terra): Career direction clear from early childhood — consistent professional trajectory',
      'Double fate line: Parallel career or dual professional identity (e.g., doctor and researcher simultaneously)',
      'Ending on Jupiter mount: Career culminates in leadership, authority, or institutional recognition'
    ],
    weakIndicators: [
      'Absent or faint: Career must be built through extraordinary personal will — nothing comes automatically, but achievements are deeply personal',
      'Starting late (mid-palm): Career direction found after age 30 — late bloomers who accelerate powerfully once aligned',
      'Broken and restarting: Significant career pivot — major industry or role change at the break point'
    ],
    absenceIndicators: 'Not a weakness — indicates someone who forges their own unique path outside conventional career tracks. Many successful entrepreneurs have faint fate lines.',
    branchesUpMeaning: 'Career advancement, promotion, or significant professional opportunity at that life stage',
    branchesDownMeaning: 'Career challenges, setbacks, or redirections requiring adaptation',
    islandMeaning: 'Career stagnation, confusion, or professional obstacle requiring resolution',
    chainMeaning: 'Inconsistent career progress — periods of advancement alternating with plateaus'
  },
  sunLine: {
    name: 'Sun Line (Apollo Line)',
    sanskritName: 'Surya Rekha',
    location: 'Runs vertically toward ring (Sun/Apollo) finger',
    meaning: 'Represents fame, creativity, success, public recognition, and personal brilliance',
    careerSignificance: 'The creativity and recognition indicator — shows potential for public success, artistic achievement, and professional brilliance',
    strongIndicators: [
      'Deep, clear line: Outstanding creative and public success potential — brilliance in chosen field',
      'Long line reaching Apollo mount: Lifelong creative recognition and public success',
      'Multiple sun lines: Multiple sources of creative recognition — talent expressed across several domains',
      'Starting from upper palm: Fame and recognition that comes in mature career (mid-life)',
      'Starting from Heart Line: Recognition through emotional work — arts, healing, or counseling',
      'Starting from Fate Line: Career success directly feeds public recognition'
    ],
    weakIndicators: [
      'Absent: Does not indicate lack of success — indicates success comes through discipline and effort (Saturn) rather than natural talent (Sun)',
      'Short or faint: Recognition is local rather than widespread — respected in immediate professional circle',
      'Broken: Periods of recognition interrupted by obstacles or personal reinvention'
    ],
    absenceIndicators: 'Many exceptionally successful people lack a clear sun line — their success comes through Saturn-ruled discipline rather than Sun-ruled brilliance',
    branchesUpMeaning: 'Creative breakthrough or public recognition milestone',
    branchesDownMeaning: 'Creative setback or criticism damaging professional reputation',
    islandMeaning: 'Temporary creative block or reputation crisis',
    chainMeaning: 'Inconsistent creative output — brilliant in bursts but difficult to maintain consistently'
  },
  mercuryLine: {
    name: 'Mercury Line (Health/Business Line)',
    sanskritName: 'Budh Rekha',
    location: 'Diagonal line from lower palm toward Mercury (little) finger',
    meaning: 'Represents business acumen, health, communication, and commercial success',
    careerSignificance: 'The business and health indicator — shows commercial instincts, communication effectiveness, and physical foundation for career',
    strongIndicators: [
      'Clear, unbroken line: Excellent business instincts and commercial success capacity',
      'Long clear line: Strong health foundation supporting career longevity',
      'Starting from Life Line: Business acumen tied to physical vitality',
      'Absence: Actually good — no health concerns affecting career when line is absent'
    ],
    weakIndicators: [
      'Broken: Health disruptions affecting career — requires attentiveness to physical wellbeing',
      'Wavy: Communication inconsistencies in professional settings',
      'Islands: Business setbacks at island points'
    ],
    absenceIndicators: 'Positive indicator — absence of Mercury line often means excellent health and no major health obstacles to career success',
    branchesUpMeaning: 'Business or financial breakthrough',
    branchesDownMeaning: 'Health or business setback',
    islandMeaning: 'Health or business crisis period',
    chainMeaning: 'Ongoing health management issues requiring lifestyle adjustments'
  },
  marriageLine: {
    name: 'Relationship Lines',
    sanskritName: 'Vivah Rekha',
    location: 'Horizontal lines on the outer edge of the palm under Mercury finger',
    meaning: 'Represents significant emotional relationships and their influence on career and life direction',
    careerSignificance: 'Partnership influence on career — shows whether relationships support or challenge professional development',
    strongIndicators: [
      'Single deep line: One dominant relationship that significantly shapes career trajectory',
      'Long line touching Sun Line: Partnership directly contributing to professional success and recognition',
      'Rising branch toward Sun: Spouse or partner enhances professional status'
    ],
    weakIndicators: [
      'Multiple faint lines: Multiple significant relationships with less permanent career impact',
      'Curved downward: Relationship ending affecting career stability'
    ],
    absenceIndicators: 'Career is primarily self-directed — professional success independent of relationship status',
    branchesUpMeaning: 'Partnership enhancing career and financial status',
    branchesDownMeaning: 'Partnership creating career or financial challenges',
    islandMeaning: 'Relationship crisis affecting professional performance',
    chainMeaning: 'Complex relationship history with ongoing impacts on professional life'
  }
};

export const PALM_MOUNTS: Record<string, MountProfile> = {
  jupiter: {
    name: 'Mount of Jupiter',
    planet: 'Jupiter',
    location: 'Below index finger',
    welldevelopedMeaning: 'Strong leadership ambition, self-confidence, love of authority, and executive potential. Natural leader who commands respect.',
    overdevelopedMeaning: 'Excessive pride, domineering behavior, and overreaching ambition that creates enemies.',
    flatMeaning: 'Lack of ambition or leadership drive — suits supporting roles rather than leadership positions.',
    careerFields: ['Executive leadership', 'Politics', 'Law', 'Religion', 'Education', 'International business', 'Judiciary']
  },
  saturn: {
    name: 'Mount of Saturn',
    planet: 'Saturn',
    location: 'Below middle finger',
    welldevelopedMeaning: 'Deep seriousness, profound wisdom, love of solitude, and disciplined persistence. The scholar, researcher, and philosopher.',
    overdevelopedMeaning: 'Morbid pessimism, isolation, and excessive caution that blocks opportunity.',
    flatMeaning: 'Difficulty with discipline and long-term planning.',
    careerFields: ['Research', 'Philosophy', 'Agriculture', 'Mining', 'Engineering', 'Mathematics', 'History', 'Occult sciences']
  },
  apollo: {
    name: 'Mount of Apollo (Sun)',
    planet: 'Sun',
    location: 'Below ring finger',
    welldevelopedMeaning: 'Brilliance, creativity, artistic talent, love of beauty, and desire for fame. The artist, performer, and creator.',
    overdevelopedMeaning: 'Vanity, superficiality, and gambling tendencies.',
    flatMeaning: 'Lack of creative drive or aesthetic sensitivity.',
    careerFields: ['Fine arts', 'Entertainment', 'Fashion', 'Architecture', 'Interior design', 'Creative entrepreneurship', 'Public performance']
  },
  mercury: {
    name: 'Mount of Mercury',
    planet: 'Mercury',
    location: 'Below little finger',
    welldevelopedMeaning: 'Exceptional intelligence, commercial acumen, eloquence, and adaptability. The natural businessman and communicator.',
    overdevelopedMeaning: 'Cunning, deception, and manipulation in business dealings.',
    flatMeaning: 'Difficulty in business and communication roles.',
    careerFields: ['Business', 'Commerce', 'Science', 'Writing', 'Sales', 'Technology', 'Medicine', 'Astrology']
  },
  mars_upper: {
    name: 'Upper Mount of Mars',
    planet: 'Mars (Upper)',
    location: 'Below Mercury mount, above Moon mount',
    welldevelopedMeaning: 'Moral courage, resistance in adversity, and determined persistence in the face of opposition.',
    overdevelopedMeaning: 'Cruelty, argumentativeness, and aggressive conflict-seeking.',
    flatMeaning: 'Cowardice or avoidance of necessary confrontations.',
    careerFields: ['Military (resilience)', 'Crisis leadership', 'Emergency medicine', 'Debating', 'Legal advocacy']
  },
  mars_lower: {
    name: 'Lower Mount of Mars',
    planet: 'Mars (Lower)',
    location: 'Between thumb and Jupiter mount',
    welldevelopedMeaning: 'Physical courage, aggression, and fighting spirit. The warrior and athlete.',
    overdevelopedMeaning: 'Explosive temper and physical aggression.',
    flatMeaning: 'Timidity and avoidance of physical challenge.',
    careerFields: ['Entrepreneurship', 'Military', 'Sports', 'Emergency services', 'Surgery']
  },
  venus: {
    name: 'Mount of Venus',
    planet: 'Venus',
    location: 'Base of thumb, enclosed by Life Line',
    welldevelopedMeaning: 'Passion, warmth, generosity, love of beauty, and powerful creative and sexual energy. Magnetic personal appeal.',
    overdevelopedMeaning: 'Sensuality overriding professional discipline, over-spending on pleasure.',
    flatMeaning: 'Coldness, lack of passion, and difficulty forming warm professional relationships.',
    careerFields: ['Arts', 'Music', 'Fashion', 'Entertainment', 'Beauty industry', 'Luxury brands', 'Romantic writing', 'Dance']
  },
  luna: {
    name: 'Mount of Luna (Moon)',
    planet: 'Moon',
    location: 'Lower outer edge of palm',
    welldevelopedMeaning: 'Rich imagination, psychic sensitivity, creative inspiration, and romantic nature. The poet, dreamer, and visionary.',
    overdevelopedMeaning: 'Restlessness, fantasy addiction, and difficulty distinguishing imagination from reality.',
    flatMeaning: 'Lack of imagination and difficulty with creative or intuitive work.',
    careerFields: ['Writing', 'Spirituality', 'Travel', 'Marine work', 'Psychology', 'Art', 'Nursing', 'Photography']
  }
};

export const HAND_TYPES: Record<string, HandTypeProfile> = {
  earth: {
    type: 'Earth Hand',
    element: 'Earth',
    shape: 'Square palm, short fingers',
    dominantTraits: ['Practicality', 'Reliability', 'Physical endurance', 'Common sense', 'Stubbornness', 'Material focus'],
    careerSuggestions: ['Farming and agriculture', 'Construction and engineering', 'Finance and banking', 'Environmental management', 'Physical therapy', 'Craft and trade work'],
    workStyle: 'Steady, methodical, and reliable. Prefers tangible results over abstract concepts. Best in careers with clear, measurable outputs.',
    leadershipStyle: 'Leads by example through consistent, reliable performance. Teams trust Earth hands because they deliver — always.',
    strengths: ['Extraordinary reliability', 'Physical capability', 'Practical problem-solving', 'Financial sense', 'Patient persistence'],
    challenges: ['Resistance to change', 'Difficulty with abstract concepts', 'Inflexibility', 'Struggle in rapid-change environments']
  },
  air: {
    type: 'Air Hand',
    element: 'Air',
    shape: 'Square palm, long fingers',
    dominantTraits: ['Intellectualism', 'Communication excellence', 'Social intelligence', 'Curiosity', 'Inconsistency', 'Multi-tasking'],
    careerSuggestions: ['Journalism and writing', 'Technology and programming', 'Sales and marketing', 'Education and training', 'Law and advocacy', 'Public relations'],
    workStyle: 'Intellectually driven and socially active. Thrives in environments requiring constant communication, rapid learning, and intellectual stimulation.',
    leadershipStyle: 'Leads through communication, vision-sharing, and intellectual inspiration. Teams follow Air hands because of their ideas and network.',
    strengths: ['Outstanding communication', 'Intellectual agility', 'Social networking', 'Multi-domain expertise', 'Innovation mindset'],
    challenges: ['Scattered focus', 'Superficiality in deep work', 'Inconsistency', 'Anxiety in rigid structures']
  },
  water: {
    type: 'Water Hand',
    element: 'Water',
    shape: 'Long palm, long fingers',
    dominantTraits: ['Emotional sensitivity', 'Creativity', 'Intuition', 'Empathy', 'Over-sensitivity', 'Artistic nature'],
    careerSuggestions: ['Psychology and counseling', 'Creative arts and writing', 'Healing and nursing', 'Social work', 'Spiritual guidance', 'Music and performance'],
    workStyle: 'Emotionally and intuitively driven. Needs meaningful, compassionate work environments. Creates deep, lasting bonds with colleagues and clients.',
    leadershipStyle: 'Leads through compassion, genuine care, and emotional attunement. Teams of Water hands feel deeply seen and supported.',
    strengths: ['Exceptional empathy', 'Creative imagination', 'Healing presence', 'Intuitive insight', 'Deep human connection'],
    challenges: ['Emotional vulnerability', 'Difficulty with structure', 'Over-absorption of others\' emotions', 'Boundary challenges']
  },
  fire: {
    type: 'Fire Hand',
    element: 'Fire',
    shape: 'Long palm, short fingers',
    dominantTraits: ['Enthusiasm', 'Charisma', 'Risk-taking', 'Impulsiveness', 'Creative energy', 'Leadership magnetism'],
    careerSuggestions: ['Entrepreneurship', 'Sales and business development', 'Entertainment and performance', 'Emergency services', 'Sports and fitness', 'Political campaigning'],
    workStyle: 'Energetic, charismatic, and results-driven. Thrives in high-energy, high-stakes environments. Natural salespeople and inspirational leaders.',
    leadershipStyle: 'Leads through charisma, passion, and infectious enthusiasm. Teams follow Fire hands because they make work exciting and meaningful.',
    strengths: ['Natural charisma', 'Entrepreneurial drive', 'Risk appetite', 'Inspirational leadership', 'Creative problem-solving'],
    challenges: ['Impulsiveness causing errors', 'Burning out quickly', 'Difficulty with long-term follow-through', 'Impatience with detail work']
  }
};

export const THUMB_ANALYSIS: Record<string, { meaning: string; career: string }> = {
  long: {
    meaning: 'Strong will and excellent judgment. Leadership potential is very high.',
    career: 'Executive leadership, entrepreneurship, strategic roles, and high-authority positions'
  },
  short: {
    meaning: 'Emotional and instinctive rather than rational in decision-making. Creative and artistic.',
    career: 'Creative industries, emotional intelligence roles, arts, and intuitive healing work'
  },
  flexible: {
    meaning: 'Adaptable, generous, and open to new ideas. Excellent in collaborative and consulting roles.',
    career: 'Consulting, HR, team leadership, creative direction, and advisory roles'
  },
  stiff: {
    meaning: 'Determined, focused, and reliable. Excellent at implementation and follow-through.',
    career: 'Engineering, research, finance, and roles requiring sustained focused effort'
  },
  waisted: {
    meaning: 'Diplomatic and tactful. Excellent negotiator with refined social intelligence.',
    career: 'Diplomacy, negotiation, law, HR, counseling, and relationship-management roles'
  }
};

export const FINGER_ANALYSIS: Record<string, { name: string; planet: string; careerMeaning: string; longMeaning: string; shortMeaning: string }> = {
  index: {
    name: 'Index Finger (Jupiter)',
    planet: 'Jupiter',
    careerMeaning: 'Ambition, leadership, authority, and the desire for power and recognition in career',
    longMeaning: 'Strong leadership ambition, confidence, and drive for authority. Natural leader.',
    shortMeaning: 'Humility and preference for supporting roles over leadership positions.'
  },
  middle: {
    name: 'Middle Finger (Saturn)',
    planet: 'Saturn',
    careerMeaning: 'Responsibility, discipline, and approach to professional obligations',
    longMeaning: 'Strong sense of duty, discipline, and responsibility. Excellent in authoritative professional roles.',
    shortMeaning: 'Free-spirited and unconventional approach to career responsibilities.'
  },
  ring: {
    name: 'Ring Finger (Apollo/Sun)',
    planet: 'Sun/Apollo',
    careerMeaning: 'Creative expression, fame-seeking, and artistic/aesthetic career orientation',
    longMeaning: 'Strong creative drive, aesthetic sensitivity, and desire for recognition. Creative career natural.',
    shortMeaning: 'Pragmatic orientation — success through practical achievement rather than creative expression.'
  },
  little: {
    name: 'Little Finger (Mercury)',
    planet: 'Mercury',
    careerMeaning: 'Communication, business acumen, and persuasion in professional contexts',
    longMeaning: 'Exceptional communication skills, business acumen, and persuasive ability. Natural in sales, law, and media.',
    shortMeaning: 'Directness and difficulty with subtle communication or complex negotiation.'
  }
};
