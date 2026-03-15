import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { calculateBirthChart, PLANET_MEANINGS } from '../utils/astroCalculations';
import { ZODIAC_SIGNS, getSignFromDate } from '../data/zodiacData';
import './BirthChartPage.css';

const PLANET_ICONS = {
  Sun: '☀️', Moon: '🌙', Mercury: '☿', Venus: '♀',
  Mars: '♂', Jupiter: '♃', Saturn: '♄', Uranus: '⛢',
  Neptune: '♆', ASC: '↑', MC: '⊕',
};

const SIGN_SYMBOLS = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

export default function BirthChartPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date: '', time: '12:00', city: '', lat: '', lon: '',
  });
  const [chart, setChart] = useState(null);
  const [sunSign, setSunSign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('form'); // 'form' | 'result'
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleGeolocate() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        setForm(f => ({
          ...f,
          lat: pos.coords.latitude.toFixed(4),
          lon: pos.coords.longitude.toFixed(4),
        }));
      });
    }
  }

  function handleCalculate(e) {
    e.preventDefault();
    if (!form.date || !form.lat || !form.lon) return;

    setLoading(true);
    setTimeout(() => {
      const result = calculateBirthChart(form.date, form.time, parseFloat(form.lon), parseFloat(form.lat));
      setChart(result);

      const [, month, day] = form.date.split('-').map(Number);
      setSunSign(getSignFromDate(month, day));
      setStep('result');
      setLoading(false);
    }, 800);
  }

  function handleViewMap() {
    navigate('/astro-map', { state: { birthData: form } });
  }

  if (step === 'result' && chart) {
    return <ChartResult chart={chart} sunSign={sunSign} form={form} onBack={() => setStep('form')} onViewMap={handleViewMap} selectedPlanet={selectedPlanet} setSelectedPlanet={setSelectedPlanet} />;
  }

  return (
    <div className="birth-page">
      <div className="birth-header">
        <div className="birth-title-area">
          <div className="birth-icon">🔮</div>
          <div>
            <h1>Birth Chart</h1>
            <p>Discover your natal chart & planetary positions</p>
          </div>
        </div>
      </div>

      <form className="birth-form" onSubmit={handleCalculate}>
        <div className="form-section">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="form-input"
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-section">
          <label className="form-label">Time of Birth</label>
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="form-input"
          />
          <p className="form-hint">Exact birth time provides the most accurate rising sign calculation</p>
        </div>

        <div className="form-section">
          <label className="form-label">Birth Location</label>
          <div className="location-inputs">
            <div className="coord-row">
              <input
                type="number"
                name="lat"
                placeholder="Latitude (e.g. 41.0082)"
                value={form.lat}
                onChange={handleChange}
                required
                className="form-input"
                step="0.0001"
                min="-90"
                max="90"
              />
              <input
                type="number"
                name="lon"
                placeholder="Longitude (e.g. 28.9784)"
                value={form.lon}
                onChange={handleChange}
                required
                className="form-input"
                step="0.0001"
                min="-180"
                max="180"
              />
            </div>
            <button type="button" className="geo-btn" onClick={handleGeolocate}>
              📍 Use My Location
            </button>
          </div>
          <p className="form-hint">You can find your city coordinates at latlong.net or similar sites</p>
        </div>

        <div className="common-cities">
          <p className="form-label">Quick Select City</p>
          <div className="city-grid">
            {CITIES.map(city => (
              <button
                key={city.name}
                type="button"
                className="city-btn"
                onClick={() => setForm(f => ({ ...f, lat: city.lat, lon: city.lon, city: city.name }))}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="calculate-btn" disabled={loading}>
          {loading ? <span className="loading-spinner">✦ Calculating...</span> : '✨ Calculate My Chart'}
        </button>
      </form>
    </div>
  );
}

function ChartResult({ chart, sunSign, form, onBack, onViewMap, selectedPlanet, setSelectedPlanet }) {
  const signData = ZODIAC_SIGNS.find(s => s.id === sunSign);
  const ascSign = chart.ASC?.sign?.toLowerCase();
  const ascData = ZODIAC_SIGNS.find(s => s.name === chart.ASC?.sign);

  return (
    <div className="birth-page">
      <div className="result-header">
        <button onClick={onBack} className="back-btn">← Recalculate</button>
        <div className="result-title">
          <h2>Your Birth Chart</h2>
          <p className="result-date">{new Date(form.date + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="sun-moon-asc">
        <div className="big-three-item">
          <span className="big-three-label">☀️ Sun</span>
          <span className="big-three-sign">{SIGN_SYMBOLS[chart.Sun.sign]} {chart.Sun.sign}</span>
          <span className="big-three-degree">{chart.Sun.degree}°</span>
        </div>
        <div className="big-three-item">
          <span className="big-three-label">🌙 Moon</span>
          <span className="big-three-sign">{SIGN_SYMBOLS[chart.Moon.sign]} {chart.Moon.sign}</span>
          <span className="big-three-degree">{chart.Moon.degree}°</span>
        </div>
        <div className="big-three-item">
          <span className="big-three-label">↑ Rising</span>
          <span className="big-three-sign">{SIGN_SYMBOLS[chart.ASC.sign]} {chart.ASC.sign}</span>
          <span className="big-three-degree">{chart.ASC.degree}°</span>
        </div>
      </div>

      <div className="chart-wheel">
        <ChartWheel chart={chart} onSelectPlanet={setSelectedPlanet} selectedPlanet={selectedPlanet} />
      </div>

      {selectedPlanet && (
        <div className="planet-detail">
          <div className="planet-detail-header">
            <span className="planet-icon">{PLANET_ICONS[selectedPlanet]}</span>
            <div>
              <h3>{selectedPlanet} in {chart[selectedPlanet].sign}</h3>
              <p>{chart[selectedPlanet].degree}° {chart[selectedPlanet].sign}</p>
            </div>
            <button onClick={() => setSelectedPlanet(null)} className="close-btn">✕</button>
          </div>
          <p className="planet-meaning">{PLANET_MEANINGS[selectedPlanet]}</p>
          <p className="planet-sign-meaning">{getPlanetSignMeaning(selectedPlanet, chart[selectedPlanet].sign)}</p>
        </div>
      )}

      <div className="planet-list">
        <h3>All Planetary Positions</h3>
        <div className="planet-grid">
          {Object.entries(chart).map(([planet, data]) => (
            <button
              key={planet}
              className={`planet-row ${selectedPlanet === planet ? 'selected' : ''}`}
              onClick={() => setSelectedPlanet(selectedPlanet === planet ? null : planet)}
            >
              <span className="planet-icon-sm">{PLANET_ICONS[planet] || '●'}</span>
              <span className="planet-name">{planet}</span>
              <span className="planet-sign">
                {SIGN_SYMBOLS[data.sign]} {data.sign}
              </span>
              <span className="planet-deg">{data.degree}°</span>
            </button>
          ))}
        </div>
      </div>

      <div className="map-cta">
        <button className="view-map-btn" onClick={onViewMap}>
          🗺️ See Your Astrocartography Map
          <span>Discover where in the world your chart is strongest</span>
        </button>
      </div>
    </div>
  );
}

function ChartWheel({ chart, onSelectPlanet, selectedPlanet }) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 120;
  const innerR = 85;
  const labelR = 100;
  const planetR = 60;

  const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
  const signColors = ['#e74c3c','#27ae60','#f39c12','#3498db','#e67e22','#1abc9c','#9b59b6','#8e44ad','#e74c3c','#2c3e50','#3498db','#16a085'];
  const signSymbols = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

  function lonToXY(lon, r) {
    const angle = (lon - 90) * Math.PI / 180;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="chart-svg">
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={innerR} fill="rgba(0,0,20,0.6)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

      {/* Zodiac segments */}
      {signs.map((sign, i) => {
        const startAngle = (i * 30 - 90) * Math.PI / 180;
        const endAngle = ((i + 1) * 30 - 90) * Math.PI / 180;
        const x1 = cx + outerR * Math.cos(startAngle);
        const y1 = cy + outerR * Math.sin(startAngle);
        const x2 = cx + innerR * Math.cos(startAngle);
        const y2 = cy + innerR * Math.sin(startAngle);
        const midAngle = ((i + 0.5) * 30 - 90) * Math.PI / 180;
        const sx = cx + labelR * Math.cos(midAngle);
        const sy = cy + labelR * Math.sin(midAngle);

        return (
          <g key={sign}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <text x={sx} y={sy} textAnchor="middle" dominantBaseline="middle"
              fontSize="10" fill={signColors[i]} opacity="0.8">
              {signSymbols[i]}
            </text>
          </g>
        );
      })}

      {/* Planet points */}
      {Object.entries(chart).map(([planet, data]) => {
        const [px, py] = lonToXY(data.longitude, planetR);
        const isSelected = selectedPlanet === planet;
        return (
          <g key={planet} onClick={() => onSelectPlanet(planet)} style={{ cursor: 'pointer' }}>
            <circle cx={px} cy={py} r={isSelected ? 10 : 7}
              fill={isSelected ? 'rgba(240, 192, 64, 0.9)' : 'rgba(155, 89, 182, 0.8)'}
              stroke={isSelected ? '#f0c040' : 'rgba(255,255,255,0.4)'}
              strokeWidth="1.5"
            />
            <text x={px} y={py + 1} textAnchor="middle" dominantBaseline="middle"
              fontSize="7" fill="#fff" style={{ pointerEvents: 'none' }}>
              {PLANET_ICONS[planet]?.replace(/[🌙☀️💫🔭]/g, '') || planet[0]}
            </text>
          </g>
        );
      })}

      {/* Center */}
      <circle cx={cx} cy={cy} r={30} fill="rgba(155,89,182,0.1)" stroke="rgba(155,89,182,0.3)" strokeWidth="1" />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="16" fill="rgba(255,255,255,0.4)">✦</text>
    </svg>
  );
}

function getPlanetSignMeaning(planet, sign) {
  const meanings = {
    'Sun': {
      'Aries': 'You are bold, pioneering, and lead with fearless confidence.',
      'Taurus': 'You are grounded, sensual, and build with patient determination.',
      'Gemini': 'You are curious, versatile, and communicate with brilliant wit.',
      'Cancer': 'You are nurturing, intuitive, and deeply connected to home.',
      'Leo': 'You are creative, generous, and radiate magnetic charisma.',
      'Virgo': 'You are analytical, devoted, and excel through precise craft.',
      'Libra': 'You are diplomatic, charming, and seek perfect harmony.',
      'Scorpio': 'You are intense, transformative, and probe life\'s deepest mysteries.',
      'Sagittarius': 'You are adventurous, philosophical, and eternally optimistic.',
      'Capricorn': 'You are ambitious, disciplined, and build lasting empires.',
      'Aquarius': 'You are visionary, humanitarian, and march to your own rhythm.',
      'Pisces': 'You are compassionate, intuitive, and touched by the divine.',
    },
    'Moon': {
      'Aries': 'Your emotions ignite quickly and you need independence to feel safe.',
      'Taurus': 'You find emotional security through comfort, beauty, and stability.',
      'Gemini': 'Your emotions are expressed through communication and mental exploration.',
      'Cancer': 'Your emotions run deep and you are highly sensitive and nurturing.',
      'Leo': 'You need recognition and warmth to feel emotionally fulfilled.',
      'Virgo': 'You feel secure when organized, helpful, and in service to others.',
      'Libra': 'You seek emotional harmony and are deeply moved by beauty.',
      'Scorpio': 'Your emotional depth is oceanic — you feel everything intensely.',
      'Sagittarius': 'Freedom and adventure nourish your emotional wellbeing.',
      'Capricorn': 'Emotional security comes through achievement and structure.',
      'Aquarius': 'Your emotions are channeled through intellect and idealism.',
      'Pisces': 'You are emotionally boundless, empathic, and deeply spiritual.',
    },
  };
  return meanings[planet]?.[sign] || `Your ${planet} in ${sign} brings unique qualities to this area of life.`;
}

const CITIES = [
  { name: 'New York', lat: '40.7128', lon: '-74.0060' },
  { name: 'London', lat: '51.5074', lon: '-0.1278' },
  { name: 'Paris', lat: '48.8566', lon: '2.3522' },
  { name: 'Tokyo', lat: '35.6762', lon: '139.6503' },
  { name: 'Sydney', lat: '-33.8688', lon: '151.2093' },
  { name: 'Mumbai', lat: '19.0760', lon: '72.8777' },
  { name: 'São Paulo', lat: '-23.5558', lon: '-46.6396' },
  { name: 'Dubai', lat: '25.2048', lon: '55.2708' },
];
