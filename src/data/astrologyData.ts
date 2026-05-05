export interface SignCareerProfile {
  primaryCareers: string[];
  avoidCareers: string[];
  naturalTalents: string[];
  workStyle: string;
  leadershipStyle: string;
  financialTendency: string;
  idealEnvironment: string;
  careerChallenges: string[];
  gemstone: string;
  luckyNumbers: number[];
  bestBusinessPartners: string[];
  careerPeakYears: string;
}

export const VEDIC_SIGN_PROFILES: Record<string, SignCareerProfile> = {
  Aries: {
    primaryCareers: ['Military Officer', 'Entrepreneur', 'Surgeon', 'Athlete/Sports Coach', 'Police Officer', 'Civil Engineer', 'Investment Banker', 'Emergency Medicine Doctor', 'Mechanical Engineer', 'CEO/Executive Director'],
    avoidCareers: ['Librarian', 'Archival Research', 'Routine Data Entry', 'Hospitality Service'],
    naturalTalents: ['Pioneer mindset', 'Fearlessness under pressure', 'Quick decision-making', 'Physical courage', 'Competitive drive', 'Raw ambition'],
    workStyle: 'You thrive in high-pressure, fast-paced environments where immediate results are required. You lead from the front, prefer action over analysis, and excel when given complete autonomy.',
    leadershipStyle: 'Commanding and decisive — you make bold calls and inspire through action, not words. Your team follows because of your confidence and willingness to take personal risk.',
    financialTendency: 'You earn aggressively and spend impulsively. Building disciplined savings requires conscious effort. Entrepreneurship suits you better than salaried roles.',
    idealEnvironment: 'Competitive industries with clear performance metrics, minimal bureaucracy, and rapid feedback loops.',
    careerChallenges: ['Impatience with slow-moving systems', 'Conflict with authority figures', 'Burning out team members', 'Starting many projects but finishing few'],
    gemstone: 'Red Coral (Moonga)',
    luckyNumbers: [1, 9],
    bestBusinessPartners: ['Leo', 'Sagittarius', 'Aquarius'],
    careerPeakYears: 'Ages 28–35 and 42–49 — fueled by Mars Mahadasha periods'
  },
  Taurus: {
    primaryCareers: ['Financial Analyst', 'Real Estate Developer', 'Chef/Culinary Artist', 'Luxury Brand Manager', 'Banker', 'Agricultural Entrepreneur', 'Interior Designer', 'Land Surveyor', 'Music Composer', 'Investment Manager'],
    avoidCareers: ['Crisis Management', 'Rapid-change Startups', 'Political Campaigning', 'High-risk Trading'],
    naturalTalents: ['Financial acumen', 'Patience and persistence', 'Aesthetic sensibility', 'Practical problem-solving', 'Reliability under pressure', 'Building lasting value'],
    workStyle: 'Methodical, thorough, and deeply reliable. You prefer building systems that endure over decades. You are at your best when you have security, routine, and clear ownership of your domain.',
    leadershipStyle: 'Steady and resource-focused — you build institutions, not just teams. Your leadership is about creating lasting structures and financial security for everyone involved.',
    financialTendency: 'Natural wealth-builder. You understand compound growth and long-term investment better than almost any other sign. Real estate and stable equities suit your temperament.',
    idealEnvironment: 'Stable industries with tangible outcomes — finance, agriculture, real estate, arts, or luxury goods.',
    careerChallenges: ['Resistance to necessary change', 'Stubbornness when challenged', 'Missing opportunities due to over-caution', 'Difficulty working in chaotic environments'],
    gemstone: 'Diamond or White Sapphire (Heera)',
    luckyNumbers: [2, 6],
    bestBusinessPartners: ['Virgo', 'Capricorn', 'Cancer'],
    careerPeakYears: 'Ages 32–40 — Venus Mahadasha brings material prosperity and professional recognition'
  },
  Gemini: {
    primaryCareers: ['Journalist', 'Digital Marketing Director', 'Software Architect', 'Author/Content Creator', 'Sales Director', 'Public Relations Specialist', 'Linguist/Translator', 'TV/Radio Anchor', 'Startup Founder (Tech)', 'Professor/Educator'],
    avoidCareers: ['Highly repetitive manual work', 'Long-term solitary research', 'Traditional bureaucratic roles'],
    naturalTalents: ['Exceptional communication', 'Rapid learning and adaptation', 'Multitasking across domains', 'Networking and relationship-building', 'Innovative thinking', 'Persuasion and negotiation'],
    workStyle: 'You thrive in intellectually stimulating, multi-threaded environments. You are most productive when juggling 2–3 major projects simultaneously. Monotony is your greatest enemy.',
    leadershipStyle: 'Idea-driven and energizing — you create vision and excitement around new concepts. You lead best in the innovation phase and need strong executors to handle implementation.',
    financialTendency: 'Variable income from multiple sources is your natural pattern. You may have several income streams simultaneously. Financial discipline requires building systems that work automatically.',
    idealEnvironment: 'Media, technology, education, or any industry experiencing rapid transformation.',
    careerChallenges: ['Scattered energy across too many interests', 'Inconsistency in follow-through', 'Difficulty with long-term commitment to a single path', 'Emotional detachment from team dynamics'],
    gemstone: 'Emerald (Panna)',
    luckyNumbers: [3, 5],
    bestBusinessPartners: ['Libra', 'Aquarius', 'Aries'],
    careerPeakYears: 'Ages 24–32 and 38–44 — Mercury Mahadasha delivers peak communicative and commercial success'
  },
  Cancer: {
    primaryCareers: ['Psychologist/Therapist', 'Nursing/Healthcare Administrator', 'Real Estate Agent', 'Hotel/Hospitality Manager', 'Child Development Specialist', 'Food & Beverage Entrepreneur', 'Social Worker', 'Marine Biologist', 'Family Lawyer', 'HR Director'],
    avoidCareers: ['Cutthroat sales environments', 'Investment banking', 'High-conflict legal litigation', 'Military combat roles'],
    naturalTalents: ['Emotional intelligence', 'Nurturing and mentoring others', 'Memory and pattern recognition', 'Intuitive business sense', 'Creating community and belonging', 'Long-term relationship management'],
    workStyle: 'You need emotionally safe and personally meaningful work. You excel in roles where human connection is central. Your memory for detail and your loyalty make you irreplaceable in team settings.',
    leadershipStyle: 'Protective and empathetic — you create teams that feel like families. Your leadership is about deep loyalty, emotional support, and building cultures of belonging.',
    financialTendency: 'Financially cautious and protective of resources. You tend toward savings and security-focused investments. Real estate and family businesses align with your long-term orientation.',
    idealEnvironment: 'Healthcare, education, real estate, hospitality — environments where serving others has tangible emotional meaning.',
    careerChallenges: ['Over-sensitivity to criticism', 'Difficulty separating personal feelings from professional decisions', 'Moodiness affecting consistency', 'Over-protectiveness of team members'],
    gemstone: 'Pearl (Moti)',
    luckyNumbers: [2, 7],
    bestBusinessPartners: ['Scorpio', 'Pisces', 'Taurus'],
    careerPeakYears: 'Ages 30–38 — Moon Mahadasha brings deep public recognition and career expansion'
  },
  Leo: {
    primaryCareers: ['CEO/Managing Director', 'Film Director/Producer', 'Politician/Statesman', 'Brand Ambassador', 'Fashion Designer', 'Theater/Stage Director', 'Life Coach/Motivational Speaker', 'Education Administrator', 'Luxury Hospitality Director', 'Creative Agency Founder'],
    avoidCareers: ['Background support roles', 'Anonymous research positions', 'Low-visibility technical work', 'Subordinate positions without growth'],
    naturalTalents: ['Natural stage presence and charisma', 'Inspiring and motivating others', 'Brand building and storytelling', 'Creative vision and aesthetics', 'Strategic network cultivation', 'Leading transformational change'],
    workStyle: 'You need work that is visible, significant, and recognized. You perform at peak levels when appreciated and acknowledged. You build legendary teams through personal inspiration.',
    leadershipStyle: 'Visionary and magnetic — you are a born figurehead. You excel at embodying the culture and values of an organization. People follow you because they believe in who you are.',
    financialTendency: 'Generous spender with high earning capacity. You attract wealth through personal branding and executive compensation. Must guard against extravagance.',
    idealEnvironment: 'Entertainment, luxury brands, politics, education, or any arena where personal presence creates value.',
    careerChallenges: ['Need for constant validation', 'Difficulty sharing the spotlight', 'Pride preventing necessary course-corrections', 'Delegating vs. controlling tensions'],
    gemstone: 'Ruby (Manik)',
    luckyNumbers: [1, 4],
    bestBusinessPartners: ['Sagittarius', 'Aries', 'Gemini'],
    careerPeakYears: 'Ages 35–44 — Sun Mahadasha delivers peak authority, recognition, and lasting career monuments'
  },
  Virgo: {
    primaryCareers: ['Data Scientist', 'Medical Specialist', 'Quality Assurance Director', 'Financial Auditor', 'Research Scientist', 'Technical Writer', 'Software QA Engineer', 'Nutritionist/Dietitian', 'Forensic Accountant', 'Operations Manager'],
    avoidCareers: ['Imprecise creative roles', 'Public performance', 'High-uncertainty environments', 'Leadership without clear metrics'],
    naturalTalents: ['Extraordinary attention to detail', 'Systems thinking and optimization', 'Analytical depth and precision', 'Problem diagnosis and correction', 'Practical innovation', 'Service-oriented reliability'],
    workStyle: 'You bring systematic rigor to everything. You excel in roles where precision, accuracy, and thoroughness are rewarded. You improve every system you touch.',
    leadershipStyle: 'Process-driven and efficiency-focused — you lead through building better systems. Your teams are precise, productive, and well-organized.',
    financialTendency: 'Careful, analytical investor. You research thoroughly before committing capital. Healthcare, tech, and financial instruments suit your analytical approach.',
    idealEnvironment: 'Healthcare, technology, research, finance, or quality-critical industries where errors carry consequences.',
    careerChallenges: ['Perfectionism causing delays', 'Over-criticism of self and others', 'Difficulty with big-picture thinking', 'Analysis paralysis under ambiguity'],
    gemstone: 'Emerald (Panna)',
    luckyNumbers: [3, 6],
    bestBusinessPartners: ['Capricorn', 'Taurus', 'Scorpio'],
    careerPeakYears: 'Ages 28–38 — Mercury Mahadasha brings expert recognition and professional mastery'
  },
  Libra: {
    primaryCareers: ['Corporate Lawyer', 'Diplomat/Ambassador', 'Fashion Designer', 'Art Director/Curator', 'Marriage Counselor', 'Human Rights Advocate', 'Talent Agent', 'Public Policy Analyst', 'Brand Strategist', 'Interior Architect'],
    avoidCareers: ['Conflict-heavy enforcement roles', 'Solitary technical work', 'High-pressure trading', 'Physical labor industries'],
    naturalTalents: ['Exceptional negotiation skills', 'Aesthetic intelligence', 'Creating harmony and consensus', 'Balancing competing interests', 'Diplomatic communication', 'Long-term strategic relationship-building'],
    workStyle: 'You thrive in collaborative, aesthetically designed environments. You excel at creating win-win solutions and building partnerships. You need beautiful surroundings to perform at your best.',
    leadershipStyle: 'Consensus-building and fair-minded — you lead through inclusion, transparency, and democratic decision-making. Teams trust you because of your objectivity.',
    financialTendency: 'Partnership-oriented wealth building. Joint ventures, profit-sharing models, and relationship-based businesses suit you naturally.',
    idealEnvironment: 'Law, diplomacy, arts, luxury, fashion, or any field where beauty, fairness, and human relationships are central.',
    careerChallenges: ['Indecisiveness at critical junctures', 'People-pleasing to the point of self-sabotage', 'Avoiding necessary confrontations', 'Difficulty making unpopular decisions'],
    gemstone: 'Diamond or White Sapphire (Heera)',
    luckyNumbers: [2, 7],
    bestBusinessPartners: ['Gemini', 'Aquarius', 'Leo'],
    careerPeakYears: 'Ages 30–40 — Venus Mahadasha brings artistic recognition, partnership successes, and social influence'
  },
  Scorpio: {
    primaryCareers: ['Intelligence Analyst', 'Forensic Investigator', 'Psychoanalyst/Psychiatrist', 'Hedge Fund Manager', 'Oncologist/Surgeon', 'Criminologist', 'Crisis Management Consultant', 'Mergers & Acquisitions Specialist', 'Research Scientist (Deep Research)', 'Strategic Intelligence Consultant'],
    avoidCareers: ['Superficial sales roles', 'Light entertainment', 'Pure administrative work', 'Routine HR positions'],
    naturalTalents: ['Penetrating analytical insight', 'Strategic patience and planning', 'Reading hidden motivations', 'Managing crises with calm authority', 'Transformational leadership', 'Uncovering deep truths'],
    workStyle: 'You work best alone or in small, trusted teams on complex, high-stakes problems. You never do anything superficially. Your standards are exceptionally high.',
    leadershipStyle: 'Strategic and psychologically insightful — you understand what drives people at the deepest level. Your leadership is transformational and demands absolute loyalty.',
    financialTendency: 'Other people\'s money (OPM) is your natural domain — banking, investment, insurance, and institutional capital. You build wealth through strategic deployment of resources.',
    idealEnvironment: 'Finance, intelligence, medicine, law, research, or any domain where depth, secrecy, and transformation are valued.',
    careerChallenges: ['Excessive secrecy and withholding', 'Power struggles with authority', 'Tendency toward revenge in conflicts', 'Difficulty trusting others with critical work'],
    gemstone: 'Red Coral (Moonga)',
    luckyNumbers: [1, 8],
    bestBusinessPartners: ['Cancer', 'Pisces', 'Virgo'],
    careerPeakYears: 'Ages 36–46 — Mars and Ketu Mahadasha bring peak investigative and transformational power'
  },
  Sagittarius: {
    primaryCareers: ['University Professor', 'International Business Development Manager', 'Publishing Director', 'Travel Content Creator/Guide', 'Philosopher/Author', 'Spiritual Teacher', 'Human Rights Lawyer', 'Sports Management', 'Immigration Consultant', 'Broadcast Journalist'],
    avoidCareers: ['Micro-managing detail work', 'Confined office environments', 'Highly repetitive processes', 'Short-sighted corporate bureaucracies'],
    naturalTalents: ['Big-picture visionary thinking', 'Cross-cultural communication', 'Inspiring through storytelling', 'Philosophical and ethical clarity', 'International market insights', 'Teaching complex ideas simply'],
    workStyle: 'You need freedom, movement, and meaning in your work. You excel when you can see the bigger purpose and when your work connects to something larger than immediate profit.',
    leadershipStyle: 'Visionary and philosophical — you lead through inspiration, meaning-making, and connecting work to higher purpose. Your teams believe in the mission, not just the metrics.',
    financialTendency: 'International and diversified. You naturally expand into multiple markets and revenue streams. Philosophical alignment with your financial choices is essential.',
    idealEnvironment: 'Academia, publishing, international business, travel, law, or any environment offering intellectual freedom and global perspective.',
    careerChallenges: ['Overcommitting to too many causes', 'Impatience with details and execution', 'Tactless honesty damaging relationships', 'Difficulty staying in one place long enough'],
    gemstone: 'Yellow Sapphire (Pukhraj)',
    luckyNumbers: [3, 9],
    bestBusinessPartners: ['Aries', 'Leo', 'Libra'],
    careerPeakYears: 'Ages 34–46 — Jupiter Mahadasha delivers peak wisdom, expansion, and international recognition'
  },
  Capricorn: {
    primaryCareers: ['Corporate Executive/CEO', 'Civil Servant/IAS Officer', 'Structural Engineer', 'Management Consultant', 'Banking & Finance Director', 'Political Administrator', 'Construction/Infrastructure Developer', 'Supply Chain Director', 'Academic Researcher', 'Government Policy Maker'],
    avoidCareers: ['High-risk speculative ventures', 'Unstructured creative roles', 'Emotional counseling work', 'Entertainment industry'],
    naturalTalents: ['Strategic long-range planning', 'Building institutions and systems', 'Disciplined, consistent execution', 'Authority management and governance', 'Creating organizational structures', 'Turning vision into enduring reality'],
    workStyle: 'You are the master builder of the zodiac. You work methodically, patiently, and with extraordinary discipline. You excel in environments that reward long-term commitment and steady progress.',
    leadershipStyle: 'Institutional and disciplined — you build lasting organizations with clear hierarchies, ethical foundations, and consistent performance standards.',
    financialTendency: 'Conservative but highly effective. You build wealth slowly and surely through disciplined saving, strategic investment, and long-term asset accumulation.',
    idealEnvironment: 'Government, banking, construction, corporate administration, or any institution where long-term thinking and structural integrity are paramount.',
    careerChallenges: ['Excessive caution blocking opportunities', 'Overly hierarchical thinking', 'Difficulty with innovation and disruption', 'Workaholism at the expense of personal life'],
    gemstone: 'Blue Sapphire (Neelam) — use with caution',
    luckyNumbers: [4, 8],
    bestBusinessPartners: ['Taurus', 'Virgo', 'Scorpio'],
    careerPeakYears: 'Ages 40–55 — Saturn Mahadasha delivers the peak harvest of lifelong discipline and institutional building'
  },
  Aquarius: {
    primaryCareers: ['Technology Entrepreneur', 'Social Entrepreneur/NGO Founder', 'AI/Machine Learning Engineer', 'Humanitarian Activist', 'Futurist/Innovation Consultant', 'Aerospace Engineer', 'Scientist (Cutting-edge Research)', 'Digital Rights Lawyer', 'Community Organizer', 'Blockchain Developer'],
    avoidCareers: ['Highly traditional bureaucratic roles', 'Industries causing societal harm', 'Fashion or luxury consumption', 'Routine service delivery'],
    naturalTalents: ['Systems-level thinking', 'Technological innovation', 'Humanitarian vision', 'Unconventional problem-solving', 'Building networks and movements', 'Future-oriented strategic planning'],
    workStyle: 'You need to work on problems that matter at scale. Individual transactions bore you — you are building systems and movements. Collaborative, open-source environments energize you.',
    leadershipStyle: 'Movement-builder and systems-thinker — you lead coalitions, not just teams. You inspire through vision of a better future and the belief that collective intelligence creates better outcomes.',
    financialTendency: 'Technology and innovation-focused investments. You are an early adopter who often profits from being ahead of market trends. Social impact and financial return coexist in your investments.',
    idealEnvironment: 'Technology, social innovation, science, or any arena where you can work on systemic change at scale.',
    careerChallenges: ['Disconnection from emotional realities of team members', 'Stubbornness about unconventional approaches', 'Difficulty sustaining focus on execution', 'Alienating traditionalists in established institutions'],
    gemstone: 'Blue Sapphire (Neelam) or Amethyst',
    luckyNumbers: [4, 7],
    bestBusinessPartners: ['Gemini', 'Libra', 'Sagittarius'],
    careerPeakYears: 'Ages 32–44 — Saturn and Rahu Mahadasha bring technological breakthroughs and social leadership recognition'
  },
  Pisces: {
    primaryCareers: ['Film Director/Cinematographer', 'Musician/Composer', 'Spiritual Healer/Yoga Teacher', 'Marine/Environmental Scientist', 'Psychiatrist/Psychologist', 'Creative Writer/Novelist', 'Philanthropist/Foundation Director', 'Dancer/Choreographer', 'Art Therapist', 'Hospice/Palliative Care Specialist'],
    avoidCareers: ['High-pressure corporate finance', 'Aggressive sales', 'Military combat roles', 'Cutthroat political environments'],
    naturalTalents: ['Extraordinary empathy and compassion', 'Creative imagination without limits', 'Spiritual intelligence', 'Artistic and aesthetic sensitivity', 'Healing presence', 'Synthesizing diverse wisdom traditions'],
    workStyle: 'You work best when the work feeds your soul. Meaning, beauty, and service are your primary work motivators. You absorb the emotional environment deeply and need positive, supportive surroundings.',
    leadershipStyle: 'Inspirational and compassionate — you lead through the quality of your presence and the depth of your caring. Your teams feel seen, heard, and deeply supported.',
    financialTendency: 'Intuitive and spiritually-guided investing. You often receive unexpected financial windfalls. Guard against impractical idealism and over-generosity to the point of financial vulnerability.',
    idealEnvironment: 'Arts, healing professions, spirituality, ocean-related sciences, or any domain where imagination and compassion are central.',
    careerChallenges: ['Boundaries — others taking advantage of generosity', 'Escaping rather than confronting problems', 'Financial impracticality', 'Difficulty with structure and deadlines'],
    gemstone: 'Yellow Sapphire (Pukhraj) or Aquamarine',
    luckyNumbers: [3, 7],
    bestBusinessPartners: ['Cancer', 'Scorpio', 'Capricorn'],
    careerPeakYears: 'Ages 28–42 — Jupiter and Ketu Mahadasha bring spiritual awakening, artistic recognition, and healing impact'
  }
};

export const PLANET_CAREER_INFLUENCES: Record<string, { career: string; strengths: string[]; challenges: string[] }> = {
  Sun: {
    career: 'Government, administration, politics, leadership roles, medicine, and any position requiring personal authority',
    strengths: ['Natural authority', 'Confidence under pressure', 'Government and official recognition', 'Leadership magnetism'],
    challenges: ['Ego conflicts with peers', 'Difficulty accepting direction', 'Pride blocking collaboration']
  },
  Moon: {
    career: 'Healthcare, hospitality, public relations, food industry, real estate, and nurturing professions',
    strengths: ['Emotional intelligence', 'Public appeal and popularity', 'Memory for human details', 'Intuitive market sense'],
    challenges: ['Emotional fluctuations affecting performance', 'Over-sensitivity to criticism', 'Inconsistency in output']
  },
  Mercury: {
    career: 'Communication, technology, writing, teaching, commerce, accounting, and analytical work',
    strengths: ['Rapid learning', 'Exceptional communication', 'Business acumen', 'Analytical precision'],
    challenges: ['Scattered focus across too many projects', 'Over-intellectualizing decisions', 'Anxiety and nervous exhaustion']
  },
  Venus: {
    career: 'Arts, design, fashion, luxury goods, beauty, entertainment, finance, and diplomatic roles',
    strengths: ['Aesthetic intelligence', 'Negotiation and diplomacy', 'Attracting resources and partnerships', 'Creative refinement'],
    challenges: ['Comfort-seeking over ambition', 'Over-reliance on charm', 'Difficulty with harsh realities']
  },
  Mars: {
    career: 'Engineering, military, surgery, entrepreneurship, law enforcement, real estate, and competitive sports',
    strengths: ['Drive and ambition', 'Physical and technical capability', 'Competitive advantage', 'Crisis leadership'],
    challenges: ['Aggression in team settings', 'Impatience with slow progress', 'Conflict escalation']
  },
  Jupiter: {
    career: 'Education, law, finance, religion, philosophy, counseling, international business, and advisory roles',
    strengths: ['Wisdom and sound judgment', 'Ethical leadership', 'Abundance attraction', 'Expansive thinking'],
    challenges: ['Over-expansion beyond capacity', 'Complacency from early success', 'Moralizing with colleagues']
  },
  Saturn: {
    career: 'Government, civil service, engineering, mining, construction, research, and long-term institutional work',
    strengths: ['Extraordinary discipline', 'Long-term strategic thinking', 'Mastery through persistence', 'Institutional authority'],
    challenges: ['Slowness to advance in early career', 'Pessimism and self-doubt', 'Rigid adherence to rules over pragmatism']
  },
  Rahu: {
    career: 'Technology, foreign markets, unconventional business, media, research, and disruption of traditional industries',
    strengths: ['Innovative boundary-breaking', 'Foreign market expertise', 'Risk appetite for transformative ventures', 'Strategic ambiguity navigation'],
    challenges: ['Ethical ambiguity', 'Obsession consuming other life areas', 'Sudden reversals of fortune']
  },
  Ketu: {
    career: 'Spirituality, research, occult sciences, healing, philosophy, and roles requiring deep solitary expertise',
    strengths: ['Mystical insight', 'Detachment enabling clear perspective', 'Past-life expertise surfacing as unusual talent', 'Spiritual authority'],
    challenges: ['Sudden career separations', 'Difficulty finding worldly motivation', 'Unpredictable departures from established paths']
  }
};

export const HOUSE_INTERPRETATIONS: Record<number, { title: string; career: string; financial: string }> = {
  1: { title: 'Ascendant (Lagna) — Self & Identity', career: 'Your physical appearance, personality projection, and first impression define your brand. Careers where you ARE the product — acting, modeling, politics, coaching — are naturally aligned.', financial: 'Your earning capacity is directly tied to your personal brand and physical vitality.' },
  2: { title: '2nd House — Wealth & Speech', career: 'Financial management, banking, oratory, singing, food industry, and family business. Your voice is a career instrument.', financial: 'Primary house of accumulated wealth. Strong planets here create natural wealth-building ability.' },
  3: { title: '3rd House — Communication & Courage', career: 'Writing, media, marketing, sales, short-distance travel, and roles requiring bold initiative.', financial: 'Sibling-related finances and self-made income through effort and communication.' },
  4: { title: '4th House — Home & Security', career: 'Real estate, education, counseling, hospitality, automotive, and environmental management.', financial: 'Property and fixed assets as wealth stores. Maternal family financial support.' },
  5: { title: '5th House — Creativity & Intelligence', career: 'Entertainment, speculation (stock market), children\'s education, arts, gaming, and creative direction.', financial: 'Speculative gains, investment returns, and creative income streams.' },
  6: { title: '6th House — Service & Health', career: 'Healthcare, military, law, competitive sports, animal care, and service industries.', financial: 'Income through service, competition, and health-related fields.' },
  7: { title: '7th House — Partnerships & Business', career: 'Business partnerships, marriage law, international trade, and customer-facing roles.', financial: 'Business partnership income and spouse\'s financial contribution.' },
  8: { title: '8th House — Transformation & Research', career: 'Insurance, research, occult sciences, surgery, investigation, and crisis management.', financial: 'Inherited wealth, insurance payouts, and income through other people\'s resources.' },
  9: { title: '9th House — Higher Knowledge & Fortune', career: 'Law, religion, higher education, publishing, international business, and philosophy.', financial: 'Long-distance trade, father\'s wealth, and fortune through ethical right action.' },
  10: { title: '10th House — Career & Authority (Karma Bhava)', career: 'The primary career house — your professional identity, reputation, and social authority.', financial: 'Professional income and career-related financial rewards.' },
  11: { title: '11th House — Gains & Social Network', career: 'Community leadership, large organizations, elder sibling-related businesses, and social enterprise.', financial: 'The house of gains, profits, and fulfillment of desires.' },
  12: { title: '12th House — Liberation & Foreign Lands', career: 'Hospitals, prisons, NGOs, foreign service, spiritual institutions, and behind-the-scenes work.', financial: 'Foreign income, expenses, and donations. Wealth through spiritual or hidden sources.' }
};

export const DASHA_CAREER_EFFECTS: Record<string, { duration: number; careerEffect: string; opportunities: string[]; cautions: string[] }> = {
  Sun: {
    duration: 6,
    careerEffect: 'Government recognition, authority roles, and career establishment. Father-figure mentors appear. Official positions and public recognition peak.',
    opportunities: ['Government job offers', 'Senior management promotion', 'Public recognition and awards', 'Healthcare or administrative advancement'],
    cautions: ['Avoid conflicts with authority figures', 'Guard against ego-driven decisions', 'Health issues can interrupt career momentum']
  },
  Moon: {
    duration: 10,
    careerEffect: 'Public-facing career success, popularity, and emotional intelligence becomes professionally valuable. Real estate, food, and hospitality opportunities arise.',
    opportunities: ['Public recognition and popularity', 'Real estate transactions', 'Hospitality business expansion', 'Female mentors opening doors'],
    cautions: ['Emotional instability can undermine professional credibility', 'Guard against changing direction too frequently', 'Mental health requires active management']
  },
  Mars: {
    duration: 7,
    careerEffect: 'Aggressive career advancement, competitive success, and entrepreneurial breakthroughs. Technical skills and physical capabilities monetize well.',
    opportunities: ['Entrepreneurial launches', 'Technical expertise monetization', 'Real estate acquisition', 'Military or law enforcement advancement'],
    cautions: ['Conflicts with colleagues and superiors escalate', 'Legal issues possible', 'Accidents from rushing']
  },
  Rahu: {
    duration: 18,
    careerEffect: 'Unconventional career leaps, foreign opportunities, and technology-driven advancement. Breaking social norms to reach unconventional success.',
    opportunities: ['Foreign job placements', 'Technology entrepreneurship', 'Media and entertainment breakthroughs', 'Unexpected career pivots that accelerate trajectory'],
    cautions: ['Ethical shortcuts creating long-term problems', 'Confusion about true career direction', 'Relationships suffering from career obsession']
  },
  Jupiter: {
    duration: 16,
    careerEffect: 'Expansion, wisdom, and advisory roles come to the forefront. Financial abundance, higher education, and international recognition peak.',
    opportunities: ['Higher education credentials', 'International business expansion', 'Financial wealth accumulation', 'Teaching and advisory roles at senior levels'],
    cautions: ['Over-expansion and saying yes to too many opportunities', 'Complacency from success', 'Legal and ethical matters require careful attention']
  },
  Saturn: {
    duration: 19,
    careerEffect: 'Long, slow, disciplined climb to institutional authority. Results come through persistence, not shortcuts. Career legacy is built during this period.',
    opportunities: ['Long-term career establishment', 'Government and institutional authority', 'Real estate and structural investments', 'Mastery recognition in specialized field'],
    cautions: ['Career delays and obstacles require patience', 'Depression and isolation must be managed', 'Health issues from overwork']
  },
  Mercury: {
    duration: 17,
    careerEffect: 'Communication, commerce, and analytical skills drive career forward. Writing, technology, and business development opportunities peak.',
    opportunities: ['Business development breakthroughs', 'Writing and publishing opportunities', 'Technology career advancement', 'Multiple income streams activating simultaneously'],
    cautions: ['Over-commitment to too many projects', 'Nervous exhaustion from mental overload', 'Communication errors creating misunderstandings']
  },
  Ketu: {
    duration: 7,
    careerEffect: 'Sudden career separations or spiritual turning points. Past-life expertise surfaces unexpectedly. Research, healing, and spiritual work flourish.',
    opportunities: ['Spiritual or research breakthroughs', 'Liberation from unsatisfying career paths', 'Unexpected expertise recognition', 'Foreign spiritual or academic opportunities'],
    cautions: ['Unexpected job losses', 'Sudden departures from established paths', 'Isolation from professional networks']
  },
  Venus: {
    duration: 20,
    careerEffect: 'Arts, luxury, beauty, and relationship-based careers flourish. Creative recognition, artistic income, and diplomatic success peak.',
    opportunities: ['Creative industry recognition', 'Luxury brand partnerships', 'Marriage and partnership-based business growth', 'Artistic commissions and contracts'],
    cautions: ['Over-indulgence in comfort at the expense of ambition', 'Relationship entanglements in professional settings', 'Financial losses through luxury spending']
  }
};

export const YOGA_COMBINATIONS: Array<{ name: string; sanskrit: string; planets: string[]; effect: string; career: string }> = [
  {
    name: 'Raj Yoga',
    sanskrit: 'राज योग',
    planets: ['Sun', 'Moon', 'Jupiter'],
    effect: 'Exceptional authority, political power, and social prestige. Career reaches heights of institutional recognition.',
    career: 'Government leadership, judicial authority, executive corporate roles, or political power'
  },
  {
    name: 'Dhana Yoga',
    sanskrit: 'धन योग',
    planets: ['Jupiter', 'Venus', 'Mercury'],
    effect: 'Significant wealth accumulation through career. Financial success comes naturally and sustainably.',
    career: 'Banking, finance, investment management, business ownership, or high-value consulting'
  },
  {
    name: 'Budha-Aditya Yoga',
    sanskrit: 'बुध-आदित्य योग',
    planets: ['Sun', 'Mercury'],
    effect: 'Extraordinary intelligence, communication skills, and analytical ability. Recognized as an expert in chosen field.',
    career: 'Academic excellence, research, writing, technology leadership, or expert advisory roles'
  },
  {
    name: 'Gajakesari Yoga',
    sanskrit: 'गजकेसरी योग',
    planets: ['Jupiter', 'Moon'],
    effect: 'Fame, wisdom, and public respect. Career marked by wisdom-based leadership and public trust.',
    career: 'Teaching, counseling, public service, spiritual guidance, or community leadership'
  },
  {
    name: 'Pancha Mahapurusha Yoga',
    sanskrit: 'पञ्च महापुरुष योग',
    planets: ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'],
    effect: 'Rare exceptional ability in the planet\'s domain. Creates outstanding achievers in their respective fields.',
    career: 'Field mastery corresponding to the specific planet involved — military for Mars, commerce for Mercury, etc.'
  },
  {
    name: 'Viparita Raja Yoga',
    sanskrit: 'विपरीत राज योग',
    planets: ['Saturn', 'Rahu', 'Ketu'],
    effect: 'Success through adversity and unconventional paths. Career rises dramatically after overcoming significant obstacles.',
    career: 'Crisis management, turnaround leadership, unconventional entrepreneurship, or social reform'
  }
];
