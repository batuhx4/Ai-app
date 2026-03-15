import { Link } from 'react-router-dom';
import { ZODIAC_SIGNS } from '../data/zodiacData';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="home-header">
        <h1 className="home-title">DailyHoroscope</h1>
        <div className="home-tabs">
          <span className="home-tab">Characteristics</span>
          <span className="home-tab active">Horoscopes</span>
          <span className="home-tab">Birth Chart</span>
        </div>
      </div>

      <div className="zodiac-grid">
        {ZODIAC_SIGNS.map(sign => (
          <Link key={sign.id} to={`/horoscope/${sign.id}`} className="zodiac-card">
            <div className="zodiac-circle" style={{ '--sign-color': sign.color }}>
              <span className="zodiac-symbol">{sign.symbol}</span>
            </div>
            <span className="zodiac-name">{sign.name}</span>
          </Link>
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
