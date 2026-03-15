export const ZODIAC_SIGNS = [
  {
    id: 'aries',
    name: 'Aries',
    symbol: '♈',
    emoji: '🐏',
    dates: 'Mar 21 – Apr 19',
    element: 'Fire',
    ruling: 'Mars',
    color: '#e74c3c',
    traits: ['Bold', 'Ambitious', 'Direct'],
    svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8l-2 2-1.41-1.41L9.5 4.67l1.5 1.5V16zm4.5 0h-2V8l-2 2-1.41-1.41L14 4.67l1.5 1.5V16z',
  },
  {
    id: 'taurus',
    name: 'Taurus',
    symbol: '♉',
    emoji: '🐂',
    dates: 'Apr 20 – May 20',
    element: 'Earth',
    ruling: 'Venus',
    color: '#27ae60',
    traits: ['Reliable', 'Patient', 'Devoted'],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    symbol: '♊',
    emoji: '👯',
    dates: 'May 21 – Jun 20',
    element: 'Air',
    ruling: 'Mercury',
    color: '#f39c12',
    traits: ['Adaptable', 'Outgoing', 'Curious'],
  },
  {
    id: 'cancer',
    name: 'Cancer',
    symbol: '♋',
    emoji: '🦀',
    dates: 'Jun 21 – Jul 22',
    element: 'Water',
    ruling: 'Moon',
    color: '#3498db',
    traits: ['Tenacious', 'Intuitive', 'Loyal'],
  },
  {
    id: 'leo',
    name: 'Leo',
    symbol: '♌',
    emoji: '🦁',
    dates: 'Jul 23 – Aug 22',
    element: 'Fire',
    ruling: 'Sun',
    color: '#e67e22',
    traits: ['Creative', 'Passionate', 'Generous'],
  },
  {
    id: 'virgo',
    name: 'Virgo',
    symbol: '♍',
    emoji: '👩',
    dates: 'Aug 23 – Sep 22',
    element: 'Earth',
    ruling: 'Mercury',
    color: '#1abc9c',
    traits: ['Loyal', 'Analytical', 'Kind'],
  },
  {
    id: 'libra',
    name: 'Libra',
    symbol: '♎',
    emoji: '⚖️',
    dates: 'Sep 23 – Oct 22',
    element: 'Air',
    ruling: 'Venus',
    color: '#9b59b6',
    traits: ['Diplomatic', 'Gracious', 'Fair'],
  },
  {
    id: 'scorpio',
    name: 'Scorpio',
    symbol: '♏',
    emoji: '🦂',
    dates: 'Oct 23 – Nov 21',
    element: 'Water',
    ruling: 'Pluto',
    color: '#8e44ad',
    traits: ['Brave', 'Resourceful', 'Focused'],
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    symbol: '♐',
    emoji: '🏹',
    dates: 'Nov 22 – Dec 21',
    element: 'Fire',
    ruling: 'Jupiter',
    color: '#e74c3c',
    traits: ['Generous', 'Idealistic', 'Humorous'],
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    symbol: '♑',
    emoji: '🐐',
    dates: 'Dec 22 – Jan 19',
    element: 'Earth',
    ruling: 'Saturn',
    color: '#2c3e50',
    traits: ['Responsible', 'Disciplined', 'Self-control'],
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    symbol: '♒',
    emoji: '🏺',
    dates: 'Jan 20 – Feb 18',
    element: 'Air',
    ruling: 'Uranus',
    color: '#3498db',
    traits: ['Progressive', 'Original', 'Independent'],
  },
  {
    id: 'pisces',
    name: 'Pisces',
    symbol: '♓',
    emoji: '🐟',
    dates: 'Feb 19 – Mar 20',
    element: 'Water',
    ruling: 'Neptune',
    color: '#16a085',
    traits: ['Compassionate', 'Artistic', 'Intuitive'],
  },
];

export const ZODIAC_SYMBOLS = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
  leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
  sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓',
};

export function getSignFromDate(month, day) {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces';
}
