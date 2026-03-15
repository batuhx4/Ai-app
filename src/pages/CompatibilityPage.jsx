import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ZODIAC_SIGNS } from '../data/zodiacData';
import { getCompatibility, COMPATIBILITY_AREAS } from '../data/compatibilityData';
import './CompatibilityPage.css';

export default function CompatibilityPage() {
  const [sign1, setSign1] = useState('');
  const [sign2, setSign2] = useState('');
  const [result, setResult] = useState(null);

  // Stable per-render area scores so they don't flicker on re-render
  const areaScores = useMemo(() => {
    if (!result) return null;
    return Object.fromEntries(
      Object.entries(COMPATIBILITY_AREAS).map(([key, area]) => [
        key,
        area.getScore(result.score),
      ])
    );
  }, [result]);

  function handleCalculate(e) {
    e.preventDefault();
    if (!sign1 || !sign2) return;
    setResult(getCompatibility(sign1, sign2));
  }

  function handleReset() {
    setSign1('');
    setSign2('');
    setResult(null);
  }

  const s1Data = ZODIAC_SIGNS.find(s => s.id === sign1);
  const s2Data = ZODIAC_SIGNS.find(s => s.id === sign2);

  return (
    <div className="compat-page">
      <div className="compat-header">
        <Link to="/" className="back-btn">← Home</Link>
        <div className="compat-title-area">
          <div className="compat-icon">💞</div>
          <div>
            <h1>Compatibility</h1>
            <p>Discover your cosmic connection</p>
          </div>
        </div>
      </div>

      {!result ? (
        <form className="compat-form" onSubmit={handleCalculate}>
          <p className="compat-subtitle">Select two signs to reveal what the stars say about your connection</p>

          <div className="sign-selectors">
            <div className="sign-selector-group">
              <label className="selector-label">First Sign</label>
              <div className="sign-selector-grid">
                {ZODIAC_SIGNS.map(sign => (
                  <button
                    key={sign.id}
                    type="button"
                    className={`sign-selector-btn ${sign1 === sign.id ? 'selected' : ''}`}
                    style={sign1 === sign.id ? { borderColor: sign.color, background: `${sign.color}22` } : {}}
                    onClick={() => setSign1(sign.id)}
                  >
                    <span className="sel-symbol">{sign.symbol}</span>
                    <span className="sel-name">{sign.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="compat-divider">
              <span className="compat-heart">💫</span>
            </div>

            <div className="sign-selector-group">
              <label className="selector-label">Second Sign</label>
              <div className="sign-selector-grid">
                {ZODIAC_SIGNS.map(sign => (
                  <button
                    key={sign.id}
                    type="button"
                    className={`sign-selector-btn ${sign2 === sign.id ? 'selected' : ''}`}
                    style={sign2 === sign.id ? { borderColor: sign.color, background: `${sign.color}22` } : {}}
                    onClick={() => setSign2(sign.id)}
                  >
                    <span className="sel-symbol">{sign.symbol}</span>
                    <span className="sel-name">{sign.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="compat-calc-btn"
            disabled={!sign1 || !sign2}
          >
            ✨ Reveal Compatibility
          </button>
        </form>
      ) : (
        <div className="compat-result">
          <div className="result-pair">
            <div className="result-sign" style={{ '--sign-color': s1Data?.color }}>
              <div className="result-circle">
                <span>{s1Data?.symbol}</span>
              </div>
              <span className="result-sign-name">{s1Data?.name}</span>
            </div>

            <div className="result-center">
              <div className="score-ring">
                <svg viewBox="0 0 100 100" className="score-svg">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke={getScoreColor(result.score)}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${result.score * 2.64} 264`}
                    strokeDashoffset="66"
                    style={{ transition: 'stroke-dasharray 1s ease' }}
                  />
                </svg>
                <div className="score-text">
                  <span className="score-num">{result.score}%</span>
                  <span className="score-label">Match</span>
                </div>
              </div>
              <div className="result-dynamic">{result.dynamic}</div>
            </div>

            <div className="result-sign" style={{ '--sign-color': s2Data?.color }}>
              <div className="result-circle">
                <span>{s2Data?.symbol}</span>
              </div>
              <span className="result-sign-name">{s2Data?.name}</span>
            </div>
          </div>

          <div className="result-summary">
            <p>{result.summary}</p>
          </div>

          <div className="compat-areas">
            {Object.entries(COMPATIBILITY_AREAS).map(([key, area]) => {
              const aScore = areaScores[key];
              return (
                <div key={key} className="compat-area-card">
                  <div className="area-header">
                    <span className="area-icon">{area.icon}</span>
                    <span className="area-label">{area.label}</span>
                    <span className="area-score" style={{ color: getScoreColor(aScore) }}>{aScore}%</span>
                  </div>
                  <div className="area-bar-bg">
                    <div
                      className="area-bar-fill"
                      style={{ width: `${aScore}%`, background: getScoreColor(aScore) }}
                    />
                  </div>
                  <p className="area-summary">{area.getSummary(sign1, sign2, aScore)}</p>
                </div>
              );
            })}
          </div>

          <div className="compat-tips">
            <h3>✨ Cosmic Advice</h3>
            <p>{getCosmicAdvice(result.score, s1Data?.name, s2Data?.name)}</p>
          </div>

          <button className="compat-reset-btn" onClick={handleReset}>
            ← Try Another Pairing
          </button>
        </div>
      )}
    </div>
  );
}

function getScoreColor(score) {
  if (score >= 85) return '#FFD700';
  if (score >= 75) return '#9b59b6';
  if (score >= 65) return '#3498db';
  if (score >= 55) return '#f39c12';
  return '#e74c3c';
}

function getCosmicAdvice(score, name1, name2) {
  if (score >= 85) return `${name1} and ${name2} share a rare and beautiful cosmic alignment. Cherish this connection — nurture it with honesty, respect each other's independence, and watch it deepen into something extraordinary over time.`;
  if (score >= 75) return `${name1} and ${name2} have strong natural chemistry with beautiful potential. Lean into your strengths and approach differences as growth opportunities rather than incompatibilities. Your contrasts are actually assets.`;
  if (score >= 65) return `${name1} and ${name2} have meaningful differences to bridge, but every point of contrast is an invitation to expand. Practice curiosity over judgment, and you'll discover that your differences create remarkable wholeness together.`;
  if (score >= 55) return `${name1} and ${name2} will need conscious effort and genuine commitment, but challenging connections often create the most profound growth. If both are willing, this pairing can be deeply transformative.`;
  return `${name1} and ${name2} face genuine challenges, but the stars don't determine destiny — consciousness does. With mutual respect, clear communication, and willingness to meet each other halfway, any cosmic challenge can be transformed.`;
}
