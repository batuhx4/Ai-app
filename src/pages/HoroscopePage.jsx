import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ZODIAC_SIGNS } from '../data/zodiacData';
import { DAILY_HOROSCOPES, TOMORROW_HOROSCOPES, WEEKLY_HOROSCOPES, MONTHLY_HOROSCOPES, SIGN_DESCRIPTIONS } from '../data/horoscopeData';
import './HoroscopePage.css';

const TABS = ['Today', 'Tomorrow', 'This Week', 'This Month'];

function getTabDate(tab) {
  const now = new Date();
  if (tab === 'Today') {
    return now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
  if (tab === 'Tomorrow') {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return tomorrow.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
  if (tab === 'This Week') {
    const end = new Date(now);
    end.setDate(now.getDate() + (6 - now.getDay()));
    return `Week of ${now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  }
  return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default function HoroscopePage() {
  const { sign } = useParams();
  const [activeTab, setActiveTab] = useState('Today');
  const signData = ZODIAC_SIGNS.find(s => s.id === sign);

  const horoscopeMap = {
    'Today': DAILY_HOROSCOPES[sign],
    'Tomorrow': TOMORROW_HOROSCOPES[sign],
    'This Week': WEEKLY_HOROSCOPES[sign],
    'This Month': MONTHLY_HOROSCOPES[sign],
  };
  const horoscope = horoscopeMap[activeTab];

  if (!signData || !DAILY_HOROSCOPES[sign]) {
    return (
      <div className="error-page">
        <p>Sign not found.</p>
        <Link to="/">← Back</Link>
      </div>
    );
  }

  const dateLabel = getTabDate(activeTab);

  return (
    <div className="horoscope-page">
      <div className="horo-header">
        <Link to="/" className="back-btn">← All Signs</Link>
        <div className="horo-sign-info">
          <div className="horo-symbol-circle" style={{ '--sign-color': signData.color }}>
            <span className="horo-symbol">{signData.symbol}</span>
          </div>
          <div>
            <h1 className="horo-sign-name">{signData.name}</h1>
            <p className="horo-dates">{signData.dates}</p>
            <div className="horo-meta">
              <span>🔥 {signData.element}</span>
              <span>♟ {signData.ruling}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="horo-tabs">
        {TABS.map(tab => (
          <span key={tab} className={`horo-tab ${tab === activeTab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</span>
        ))}
      </div>

      <div className="horo-content">
        <div className="horo-date">{dateLabel}</div>

        <div className="horo-rating">
          {'★'.repeat(horoscope.rating)}{'☆'.repeat(5 - horoscope.rating)}
        </div>

        <p className="horo-general">{horoscope.general}</p>

        <div className="horo-sections">
          {[
            { icon: '❤️', title: 'Love', text: horoscope.love },
            { icon: '💼', title: 'Career', text: horoscope.career },
            { icon: '🌿', title: 'Health', text: horoscope.health },
          ].map(s => (
            <div key={s.title} className="horo-section">
              <div className="section-header">
                <span className="section-icon">{s.icon}</span>
                <h3>{s.title}</h3>
              </div>
              <p>{s.text}</p>
            </div>
          ))}
        </div>

        <div className="horo-lucky">
          <h3>✨ Lucky Today</h3>
          <div className="lucky-items">
            <div className="lucky-item">
              <span className="lucky-label">Number</span>
              <span className="lucky-value">{horoscope.lucky.number}</span>
            </div>
            <div className="lucky-item">
              <span className="lucky-label">Color</span>
              <span className="lucky-value">{horoscope.lucky.color}</span>
            </div>
            <div className="lucky-item">
              <span className="lucky-label">Time</span>
              <span className="lucky-value">{horoscope.lucky.time}</span>
            </div>
          </div>
        </div>

        <div className="horo-traits">
          {signData.traits.map(t => (
            <span key={t} className="trait-pill">{t}</span>
          ))}
        </div>

        <div className="sign-description">
          <h3>About {signData.name}</h3>
          <p>{SIGN_DESCRIPTIONS[sign]}</p>
        </div>
      </div>

      <div className="sign-navigation">
        {ZODIAC_SIGNS.map(s => (
          <Link key={s.id} to={`/horoscope/${s.id}`} className={`sign-nav-item ${s.id === sign ? 'active' : ''}`}>
            <span>{s.symbol}</span>
            <span>{s.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
