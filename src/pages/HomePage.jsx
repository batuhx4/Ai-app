import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ZODIAC_SIGNS } from '../data/zodiacData';
import './HomePage.css';

const ELEMENT_COLORS = { Fire: '#e74c3c', Earth: '#27ae60', Air: '#f39c12', Water: '#3498db' };

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('Horoscopes');
  const navigate = useNavigate();

  function handleTabClick(tab) {
    if (tab === 'Birth Chart') {
      navigate('/birth-chart');
    } else {
      setActiveTab(tab);
    }
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <h1 className="home-title">DailyHoroscope</h1>
        <div className="home-tabs">
          {['Characteristics', 'Horoscopes', 'Birth Chart'].map(tab => (
            <span
              key={tab}
              className={`home-tab ${tab === activeTab ? 'active' : ''}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      <div className="zodiac-grid">
        {ZODIAC_SIGNS.map(sign => (
          activeTab === 'Characteristics' ? (
            <Link key={sign.id} to={`/horoscope/${sign.id}`} className="zodiac-card">
              <div className="zodiac-circle" style={{ '--sign-color': sign.color }}>
                <span className="zodiac-symbol">{sign.symbol}</span>
              </div>
              <span className="zodiac-name">{sign.name}</span>
              <span className="zodiac-element" style={{ color: ELEMENT_COLORS[sign.element] }}>{sign.element}</span>
              <span className="zodiac-ruling">♟ {sign.ruling}</span>
            </Link>
          ) : (
            <Link key={sign.id} to={`/horoscope/${sign.id}`} className="zodiac-card">
              <div className="zodiac-circle" style={{ '--sign-color': sign.color }}>
                <span className="zodiac-symbol">{sign.symbol}</span>
              </div>
              <span className="zodiac-name">{sign.name}</span>
            </Link>
          )
        ))}
      </div>

      <div className="whats-my-sign">
        <Link to="/birth-chart" className="sign-btn">
          What's my sign?
        </Link>
      </div>

      <div className="home-features">
        <Link to="/birth-chart" className="feature-card">
          <div className="feature-icon">🔮</div>
          <div className="feature-text">
            <h3>Birth Chart</h3>
            <p>Calculate your complete natal chart with all planetary positions</p>
          </div>
          <span className="feature-arrow">→</span>
        </Link>
        <Link to="/compatibility" className="feature-card">
          <div className="feature-icon">💞</div>
          <div className="feature-text">
            <h3>Compatibility</h3>
            <p>Discover how the stars align between two signs</p>
          </div>
          <span className="feature-arrow">→</span>
        </Link>
        <Link to="/astro-map" className="feature-card">
          <div className="feature-icon">🗺️</div>
          <div className="feature-text">
            <h3>Astro Map</h3>
            <p>Discover the best places to live based on your chart</p>
          </div>
          <span className="feature-arrow">→</span>
        </Link>
      </div>
    </div>
  );
}
