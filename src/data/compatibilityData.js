// Element compatibility rules and per-pair overrides
const ELEMENT = {
  aries: 'Fire', taurus: 'Earth', gemini: 'Air', cancer: 'Water',
  leo: 'Fire', virgo: 'Earth', libra: 'Air', scorpio: 'Water',
  sagittarius: 'Fire', capricorn: 'Earth', aquarius: 'Air', pisces: 'Water',
};

const ELEMENT_BASE_SCORE = {
  'Fire-Fire': 85, 'Earth-Earth': 82, 'Air-Air': 80, 'Water-Water': 83,
  'Fire-Air': 88, 'Air-Fire': 88,
  'Earth-Water': 86, 'Water-Earth': 86,
  'Fire-Earth': 55, 'Earth-Fire': 55,
  'Fire-Water': 50, 'Water-Fire': 50,
  'Air-Water': 58, 'Water-Air': 58,
  'Air-Earth': 52, 'Earth-Air': 52,
};

// Specific pair overrides (sorted alphabetically for lookup)
const PAIR_OVERRIDES = {
  'aries-libra':       { score: 78, dynamic: 'Opposites Attract', summary: 'Aries and Libra are opposite signs who balance each other beautifully. Aries provides decisive action while Libra brings grace and diplomacy. The tension between independence and partnership creates magnetic attraction.' },
  'taurus-scorpio':    { score: 80, dynamic: 'Intense Polarity', summary: 'Taurus and Scorpio share a magnetic, sometimes obsessive pull. Both are fixed signs with enormous staying power. Their shared sensuality and depth of feeling create bonds that last a lifetime — though power struggles require navigation.' },
  'gemini-sagittarius':{ score: 82, dynamic: 'Adventure Seekers', summary: 'Gemini and Sagittarius share an insatiable curiosity and love of freedom. Both crave mental stimulation and new experiences. Their axis of knowledge — Gemini collecting details, Sagittarius seeking the big picture — creates endlessly stimulating connection.' },
  'cancer-capricorn':  { score: 76, dynamic: 'Building Together', summary: 'Cancer and Capricorn are opposing signs who build something lasting together. Cancer provides emotional warmth and nurturing while Capricorn offers stability and ambition. Together they create a secure, loving home and successful life.' },
  'leo-aquarius':      { score: 74, dynamic: 'Individual vs. Collective', summary: 'Leo and Aquarius create a fascinating tension between personal expression and collective vision. Leo wants to be the star; Aquarius wants to change the world. When they align their considerable powers, they inspire entire communities.' },
  'virgo-pisces':      { score: 77, dynamic: 'Dream Meets Reality', summary: 'Virgo and Pisces are opposites who complete each other. Virgo grounds Pisces dreams in practical reality; Pisces expands Virgo beyond rigid analysis into imagination and compassion. Their union blends the mystical and the mundane.' },
  'aries-aries':       { score: 72, dynamic: 'Twin Flames', summary: 'Two Aries together create explosive passion and fierce competition in equal measure. The attraction is immediate and intense, but two leaders must learn to take turns. When they channel their shared fire toward common goals, they are unstoppable.' },
  'taurus-taurus':     { score: 88, dynamic: 'Earthly Paradise', summary: 'Two Taureans create a sensual, stable, deeply comfortable partnership. Shared values of loyalty, beauty, and material security make this a natural match. The main challenge is both being too stubborn — but their patience and devotion usually prevail.' },
  'gemini-gemini':     { score: 78, dynamic: 'Twin Minds', summary: 'Two Geminis create a relationship of constant mental excitement, laughter, and variety. Life together is never boring. The challenge is both partners needing stimulation from outside — but their shared wit and adaptability keep things fresh.' },
  'cancer-cancer':     { score: 85, dynamic: 'Safe Harbor', summary: 'Two Cancers create the most nurturing, emotionally safe partnership in the zodiac. Shared sensitivity means they understand each other intuitively. The risk is both becoming too insular — their shared home must remain open to the world.' },
  'leo-leo':           { score: 75, dynamic: 'Royal Court', summary: 'Two Leos bring extraordinary warmth, creativity, and generosity to their union. The challenge is two suns needing to share the spotlight. When each Leo becomes the other\'s most devoted admirer, their relationship becomes a magnificent mutual celebration.' },
  'virgo-virgo':       { score: 80, dynamic: 'Perfectionists in Love', summary: 'Two Virgos create an exceptionally organized, thoughtful, and devoted partnership. Their shared attention to detail and desire for improvement create a well-functioning life. The challenge is over-criticism — they must balance high standards with loving acceptance.' },
  'libra-libra':       { score: 82, dynamic: 'Perfect Harmony', summary: 'Two Libras create exquisite aesthetic harmony and social grace. Both value beauty, balance, and fairness above all. The challenge is decision paralysis — two people who see all sides may struggle to choose a direction. Their shared values of love and justice guide them through.' },
  'scorpio-scorpio':   { score: 78, dynamic: 'Profound Depths', summary: 'Two Scorpios create a relationship of extraordinary intensity, loyalty, and transformation. They understand each other\'s need for depth and privacy implicitly. Power dynamics must be consciously managed, but the bond of two Scorpios who fully trust each other is unbreakable.' },
  'sagittarius-sagittarius': { score: 84, dynamic: 'Fellow Adventurers', summary: 'Two Sagittarians create an expansive, joyful, philosophically rich partnership. Their shared love of freedom, adventure, and truth makes for an exciting life. Commitment may require explicit discussion, but when they agree to explore the world together, no pair is more inspiring.' },
  'capricorn-capricorn': { score: 83, dynamic: 'Empire Builders', summary: 'Two Capricorns create a formidably ambitious, stable, and achievement-oriented partnership. Their shared work ethic and long-term thinking builds something genuinely lasting. They must remember to balance building their empire with savoring the present together.' },
  'aquarius-aquarius': { score: 80, dynamic: 'Fellow Visionaries', summary: 'Two Aquarians create a brilliantly innovative, socially conscious, and intellectually electric partnership. Their shared vision for a better world and delight in each other\'s eccentricity creates genuine mutual acceptance. Emotional intimacy may require intentional cultivation.' },
  'pisces-pisces':     { score: 82, dynamic: 'Mystical Union', summary: 'Two Pisces create a deeply spiritual, creative, and compassionate partnership. Their intuitive understanding of each other borders on telepathic. The challenge is maintaining practical function amid their dreaming — but their shared imagination creates a love story of rare beauty.' },
};

// Element-based summary templates
const ELEMENT_SUMMARIES = {
  'Fire-Fire': (a, b) => `${capitalize(a)} and ${capitalize(b)} ignite with passionate energy and mutual inspiration. Both fire signs understand the need for independence, adventure, and bold action. Their shared enthusiasm creates extraordinary momentum, though two fires must be careful not to combust.`,
  'Earth-Earth': (a, b) => `${capitalize(a)} and ${capitalize(b)} build something enduring together. Both earth signs value stability, loyalty, and practical achievement. Their shared sensibility creates a secure, comfortable partnership that only deepens with time.`,
  'Air-Air': (a, b) => `${capitalize(a)} and ${capitalize(b)} create a relationship of brilliant mental chemistry. Both air signs delight in ideas, communication, and social connection. Their conversations are endlessly stimulating, and their shared need for freedom keeps the relationship dynamic and alive.`,
  'Water-Water': (a, b) => `${capitalize(a)} and ${capitalize(b)} dive into profound emotional depths together. Both water signs understand the language of feeling intuitively. Their empathic connection creates extraordinary intimacy, though both must guard against being overwhelmed by shared emotional intensity.`,
  'Fire-Air': (a, b) => `${capitalize(a)} and ${capitalize(b)} create sparkling, electric chemistry. Air feeds fire's passion while fire gives air's ideas momentum and excitement. This is one of the zodiac's most naturally harmonious combinations — lively, inspiring, and mutually energizing.`,
  'Earth-Water': (a, b) => `${capitalize(a)} and ${capitalize(b)} nurture each other into flourishing. Earth gives water's emotions a stable, secure container; water brings earth's practicality to life with feeling and imagination. Their complementary natures create a deeply nourishing partnership.`,
  'Fire-Earth': (a, b) => `${capitalize(a)} and ${capitalize(b)} face a fundamental difference in pace and approach. Fire seeks excitement and swift action; earth prefers careful, steady progress. With patience and appreciation for what each brings, their differences become complementary strengths.`,
  'Fire-Water': (a, b) => `${capitalize(a)} and ${capitalize(b)} experience a push-pull of intensity. Fire's passion can overwhelm water's sensitivity; water's emotional depth can douse fire's enthusiasm. Yet when they learn to work with rather than against each other, the result is deeply transformative.`,
  'Air-Water': (a, b) => `${capitalize(a)} and ${capitalize(b)} navigate the space between mind and heart. Air processes through thought; water processes through feeling. Understanding each other's emotional language requires genuine effort, but the blend of intellectual and emotional depth creates a rich partnership.`,
  'Air-Earth': (a, b) => `${capitalize(a)} and ${capitalize(b)} bring different orientations to life. Air lives in ideas and possibilities; earth prefers tangible reality. Their challenge is bridging the abstract and the concrete — but when they do, each makes the other more complete and capable.`,
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getPairKey(a, b) {
  return [a, b].sort().join('-');
}

export function getCompatibility(sign1, sign2) {
  const key = getPairKey(sign1, sign2);
  if (PAIR_OVERRIDES[key]) {
    return PAIR_OVERRIDES[key];
  }

  const el1 = ELEMENT[sign1];
  const el2 = ELEMENT[sign2];
  const elementKey = `${el1}-${el2}`;
  const score = ELEMENT_BASE_SCORE[elementKey] || 65;
  const summaryFn = ELEMENT_SUMMARIES[elementKey] || ELEMENT_SUMMARIES[`${el2}-${el1}`];
  const summary = summaryFn ? summaryFn(sign1, sign2) : `${capitalize(sign1)} and ${capitalize(sign2)} share a unique cosmic connection with lessons to offer each other.`;

  let dynamic = 'Complementary';
  if (score >= 85) dynamic = 'Natural Harmony';
  else if (score >= 80) dynamic = 'Strong Connection';
  else if (score >= 70) dynamic = 'Complementary';
  else if (score >= 60) dynamic = 'Growth Opportunity';
  else dynamic = 'Challenging Growth';

  return { score, dynamic, summary };
}

export const COMPATIBILITY_AREAS = {
  love: {
    label: 'Love & Romance',
    icon: '❤️',
    getScore: (base) => Math.min(100, base + Math.floor(Math.random() * 10 - 5)),
    getSummary: (sign1, sign2, score) => score >= 80
      ? `Romantic chemistry between ${capitalize(sign1)} and ${capitalize(sign2)} flows with beautiful naturalness. Their attractions align at a deep level.`
      : score >= 65
      ? `Love requires conscious effort but offers profound rewards. ${capitalize(sign1)} and ${capitalize(sign2)} grow through their differences.`
      : `The romantic path between ${capitalize(sign1)} and ${capitalize(sign2)} is challenging but not impossible — awareness transforms obstacles into depth.`,
  },
  friendship: {
    label: 'Friendship',
    icon: '🤝',
    getScore: (base) => Math.min(100, base + Math.floor(Math.random() * 8 - 3)),
    getSummary: (sign1, sign2, score) => score >= 80
      ? `${capitalize(sign1)} and ${capitalize(sign2)} make natural friends who bring out the best in each other.`
      : score >= 65
      ? `Friendship between ${capitalize(sign1)} and ${capitalize(sign2)} grows richer as they appreciate their different perspectives.`
      : `As friends, ${capitalize(sign1)} and ${capitalize(sign2)} must navigate different values, but loyalty can bridge any gap.`,
  },
  communication: {
    label: 'Communication',
    icon: '💬',
    getScore: (base) => Math.min(100, base + Math.floor(Math.random() * 12 - 6)),
    getSummary: (sign1, sign2, score) => score >= 80
      ? `Conversations between ${capitalize(sign1)} and ${capitalize(sign2)} flow with remarkable ease and mutual understanding.`
      : score >= 65
      ? `${capitalize(sign1)} and ${capitalize(sign2)} communicate differently but can build a shared language with patience.`
      : `Communication styles differ significantly — what ${capitalize(sign1)} needs to hear and how ${capitalize(sign2)} expresses may require conscious bridging.`,
  },
  trust: {
    label: 'Trust & Loyalty',
    icon: '🛡️',
    getScore: (base) => Math.min(100, base + Math.floor(Math.random() * 10 - 4)),
    getSummary: (sign1, sign2, score) => score >= 80
      ? `Trust builds naturally and deeply between ${capitalize(sign1)} and ${capitalize(sign2)}. Their loyalty to each other is a defining feature of this bond.`
      : score >= 65
      ? `Trust develops steadily as ${capitalize(sign1)} and ${capitalize(sign2)} demonstrate reliability and follow-through over time.`
      : `Building trust requires patience — both signs have different definitions of loyalty that must be made explicit.`,
  },
};
