// Simplified astronomical calculations for astrocartography
// These are approximations for educational purposes

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

function toJulianDay(year, month, day, hour = 12) {
  if (month <= 2) { year -= 1; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) +
         Math.floor(30.6001 * (month + 1)) + day + hour / 24 + B - 1524.5;
}

function sunLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const M = (357.5291 + 35999.0503 * T) % 360;
  const C = 1.9146 * Math.sin(M * DEG) + 0.0200 * Math.sin(2 * M * DEG);
  return (280.4665 + 36000.7698 * T + C) % 360;
}

function moonLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  return (218.3165 + 481267.8813 * T) % 360;
}

function planetLongitude(jd, planet) {
  const T = (jd - 2451545.0) / 36525;
  switch (planet) {
    case 'mercury': return (252.2509 + 149472.6746 * T) % 360;
    case 'venus':   return (181.9798 + 58517.8156 * T) % 360;
    case 'mars':    return (355.4330 + 19140.2993 * T) % 360;
    case 'jupiter': return (34.3515 + 3034.9057 * T) % 360;
    case 'saturn':  return (50.0774 + 1222.1138 * T) % 360;
    case 'uranus':  return (314.0550 + 428.4882 * T) % 360;
    case 'neptune': return (304.3487 + 218.4862 * T) % 360;
    default: return 0;
  }
}

function obliquity(jd) {
  const T = (jd - 2451545.0) / 36525;
  return 23.4392911 - 0.013004 * T;
}

// Convert ecliptic longitude to equatorial coordinates
function eclipticToEquatorial(lon, lat, eps) {
  const sinRa = Math.cos(lat * DEG) * Math.sin(lon * DEG) * Math.cos(eps * DEG) -
                Math.sin(lat * DEG) * Math.sin(eps * DEG);
  const cosRa = Math.cos(lat * DEG) * Math.cos(lon * DEG);
  const ra = Math.atan2(sinRa, cosRa) * RAD;
  const dec = Math.asin(Math.sin(lat * DEG) * Math.cos(eps * DEG) +
              Math.cos(lat * DEG) * Math.sin(eps * DEG) * Math.sin(lon * DEG)) * RAD;
  return { ra: (ra + 360) % 360, dec };
}

// Calculate Local Sidereal Time
function localSiderealTime(jd, longitude) {
  const T = (jd - 2451545.0) / 36525;
  const gst = (280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T) % 360;
  return (gst + longitude + 360) % 360;
}

// Calculate house cusps using Placidus approximation
function calculateASC(jd, lat, lon) {
  const lst = localSiderealTime(jd, lon);
  const eps = obliquity(jd);
  const ramc = lst;
  // Simplified ASC calculation
  const tanAsc = Math.cos(ramc * DEG) / (-Math.sin(ramc * DEG) * Math.cos(eps * DEG) - Math.tan(lat * DEG) * Math.sin(eps * DEG));
  let asc = Math.atan(tanAsc) * RAD;
  if (Math.cos(ramc * DEG) < 0) asc += 180;
  return (asc + 360) % 360;
}

// Calculate MC (Midheaven)
function calculateMC(jd, lon) {
  const lst = localSiderealTime(jd, lon);
  const eps = obliquity(jd);
  const mc = Math.atan2(Math.tan(lst * DEG), Math.cos(eps * DEG)) * RAD;
  return (mc + 360) % 360;
}

// Generate astrocartography lines for a planet
// Returns array of {type, coordinates} for map polylines
export function generateAstroLines(birthDate, birthTime, birthLon, birthLat) {
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour, minute] = birthTime.split(':').map(Number);
  const jd = toJulianDay(year, month, day, hour + minute / 60);
  const eps = obliquity(jd);

  const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
  const lines = [];

  for (const planet of planets) {
    const lon = planet === 'sun' ? sunLongitude(jd) :
                planet === 'moon' ? moonLongitude(jd) :
                planetLongitude(jd, planet);

    const { ra, dec } = eclipticToEquatorial(lon, 0, eps);

    // MC line: longitude where planet is on the midheaven
    // Planet is on MC when LST = RA
    const mcLongitudes = [];
    for (let mapLon = -180; mapLon <= 180; mapLon += 2) {
      const lst = localSiderealTime(jd, mapLon);
      if (Math.abs(((lst - ra + 540) % 360) - 180) < 5) {
        mcLongitudes.push(mapLon);
      }
    }

    // ASC line: latitude where planet is on the ascendant at each longitude
    const ascLine = [];
    for (let mapLon = -180; mapLon <= 180; mapLon += 3) {
      const lst = localSiderealTime(jd, mapLon);
      const ramc = lst;
      // Find latitude where planet is on ASC
      // tan(lat) = (cos(ra - ramc) * cos(eps) * tan(dec) - sin(dec) * sin(eps) * sin(ra - ramc)) /
      //             (sin(ra - ramc))
      const diff = (ra - ramc) * DEG;
      if (Math.abs(Math.sin(diff)) > 0.01) {
        const tanLat = (Math.cos(diff) * Math.cos(eps * DEG) * Math.tan(dec * DEG) -
                        Math.sin(dec * DEG) * Math.sin(eps * DEG) * Math.sin(diff)) /
                       Math.sin(diff);
        const lat = Math.atan(tanLat) * RAD;
        if (lat >= -85 && lat <= 85) {
          ascLine.push([lat, mapLon]);
        }
      }
    }

    // MC line as vertical line at calculated longitude
    const mcLon = ((ra - localSiderealTime(jd, 0) + 360) % 360) - 360;
    const adjustedMcLon = ((mcLon % 360) + 540) % 360 - 180;

    lines.push({
      planet,
      type: 'MC',
      color: getPlanetColor(planet),
      coordinates: [
        [-85, adjustedMcLon],
        [85, adjustedMcLon],
      ],
      description: getMCDescription(planet),
    });

    // IC line (opposite of MC)
    const icLon = ((adjustedMcLon + 180 + 360) % 360) - 180;
    lines.push({
      planet,
      type: 'IC',
      color: getPlanetColor(planet),
      coordinates: [[-85, icLon], [85, icLon]],
      description: getICDescription(planet),
      dashed: true,
    });

    if (ascLine.length > 5) {
      lines.push({
        planet,
        type: 'ASC',
        color: getPlanetColor(planet),
        coordinates: ascLine,
        description: getASCDescription(planet),
      });

      // DSC line (mirrored)
      const dscLine = ascLine.map(([lat, lon]) => [lat, ((lon + 180 + 360) % 360) - 180]);
      lines.push({
        planet,
        type: 'DSC',
        color: getPlanetColor(planet),
        coordinates: dscLine,
        description: getDSCDescription(planet),
        dashed: true,
      });
    }
  }

  return lines;
}

function getPlanetColor(planet) {
  const colors = {
    sun: '#FFD700', moon: '#C0C0C0', mercury: '#FFA500',
    venus: '#90EE90', mars: '#FF4500', jupiter: '#4169E1', saturn: '#DAA520',
  };
  return colors[planet] || '#FFFFFF';
}

function getMCDescription(planet) {
  const desc = {
    sun: 'Career success & public recognition — your authentic self shines',
    moon: 'Emotional fulfillment through career & public life',
    mercury: 'Communication excellence & intellectual achievements',
    venus: 'Fame, artistic success & harmonious public life',
    mars: 'Ambitious career drive & competitive achievement',
    jupiter: 'Great fortune, expansion & professional success',
    saturn: 'Disciplined achievement & lasting reputation',
  };
  return desc[planet] || '';
}

function getICDescription(planet) {
  const desc = {
    sun: 'Deep roots, ancestral connection & inner strength',
    moon: 'Profound emotional security & family healing',
    mercury: 'Intellectual home environment & family communication',
    venus: 'Beautiful home life & domestic harmony',
    mars: 'Energetic home base & family passion',
    jupiter: 'Fortunate home life & family expansion',
    saturn: 'Stable foundations & family responsibility',
  };
  return desc[planet] || '';
}

function getASCDescription(planet) {
  const desc = {
    sun: 'Vitality, confidence & personal power',
    moon: 'Emotional receptivity & intuitive connections',
    mercury: 'Sharp wit, communication & youthful energy',
    venus: 'Magnetism, beauty & easy romantic connections',
    mars: 'Bold energy, passion & dynamic encounters',
    jupiter: 'Abundance, opportunity & personal growth',
    saturn: 'Discipline, longevity & karmic lessons',
  };
  return desc[planet] || '';
}

function getDSCDescription(planet) {
  const desc = {
    sun: 'Powerful partnerships & other people empower you',
    moon: 'Nurturing relationships & emotional bonds',
    mercury: 'Intellectual partnerships & mental stimulation',
    venus: 'Romantic partnerships & beautiful relationships',
    mars: 'Passionate partnerships & dynamic relationships',
    jupiter: 'Lucky partnerships & expansive relationships',
    saturn: 'Committed partnerships & long-term bonds',
  };
  return desc[planet] || '';
}

export function calculateBirthChart(birthDate, birthTime, birthLon, birthLat) {
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour, minute] = birthTime.split(':').map(Number);
  const jd = toJulianDay(year, month, day, hour + minute / 60);
  const eps = obliquity(jd);

  const planets = {
    Sun: { lon: sunLongitude(jd) },
    Moon: { lon: moonLongitude(jd) },
    Mercury: { lon: planetLongitude(jd, 'mercury') },
    Venus: { lon: planetLongitude(jd, 'venus') },
    Mars: { lon: planetLongitude(jd, 'mars') },
    Jupiter: { lon: planetLongitude(jd, 'jupiter') },
    Saturn: { lon: planetLongitude(jd, 'saturn') },
    Uranus: { lon: planetLongitude(jd, 'uranus') },
    Neptune: { lon: planetLongitude(jd, 'neptune') },
  };

  // Convert to zodiac signs
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

  const chart = {};
  for (const [name, data] of Object.entries(planets)) {
    const signIndex = Math.floor(((data.lon % 360) + 360) % 360 / 30);
    const degree = ((data.lon % 360) + 360) % 360 % 30;
    chart[name] = {
      sign: signs[signIndex],
      degree: degree.toFixed(1),
      longitude: ((data.lon % 360) + 360) % 360,
    };
  }

  // Calculate ASC and MC
  const asc = calculateASC(jd, birthLat, birthLon);
  const mc = calculateMC(jd, birthLon);
  const ascSignIndex = Math.floor(asc / 30);
  const mcSignIndex = Math.floor(mc / 30);

  chart['ASC'] = { sign: signs[ascSignIndex], degree: (asc % 30).toFixed(1), longitude: asc };
  chart['MC'] = { sign: signs[mcSignIndex], degree: (mc % 30).toFixed(1), longitude: mc };

  return chart;
}

export const PLANET_MEANINGS = {
  Sun: 'Your core identity, ego, and life purpose',
  Moon: 'Emotions, instincts, and subconscious patterns',
  Mercury: 'Communication, thinking, and learning style',
  Venus: 'Love, beauty, values, and attraction',
  Mars: 'Drive, ambition, and sexual energy',
  Jupiter: 'Expansion, abundance, and higher wisdom',
  Saturn: 'Discipline, structure, and life lessons',
  Uranus: 'Revolution, innovation, and sudden change',
  Neptune: 'Intuition, spirituality, and illusion',
  ASC: 'Rising Sign — your outer personality and appearance',
  MC: 'Midheaven — career, reputation, and life goals',
};
