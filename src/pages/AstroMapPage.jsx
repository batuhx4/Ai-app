import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, useMap } from 'react-leaflet';
import { generateAstroLines } from '../utils/astroCalculations';
import 'leaflet/dist/leaflet.css';
import './AstroMapPage.css';

const PLANET_COLORS = {
  sun: '#FFD700', moon: '#C0C0C0', mercury: '#FFA500',
  venus: '#90EE90', mars: '#FF4500', jupiter: '#4169E1', saturn: '#DAA520',
};

const LINE_TYPES = {
  MC: { label: 'MC', desc: 'Midheaven — career & public life' },
  IC: { label: 'IC', desc: 'Imum Coeli — home & roots' },
  ASC: { label: 'ASC', desc: 'Ascendant — identity & appearance' },
  DSC: { label: 'DSC', desc: 'Descendant — relationships' },
};

export default function AstroMapPage() {
  const routerLocation = useLocation();
  const passedData = routerLocation.state?.birthData;

  const [form, setForm] = useState(passedData || { date: '', time: '12:00', lat: '', lon: '' });
  const [lines, setLines] = useState([]);
  const [activePlanets, setActivePlanets] = useState(
    Object.fromEntries(Object.keys(PLANET_COLORS).map(p => [p, true]))
  );
  const [activeTypes, setActiveTypes] = useState(
    Object.fromEntries(Object.keys(LINE_TYPES).map(t => [t, true]))
  );
  const [selectedLine, setSelectedLine] = useState(null);
  const [calculated, setCalculated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLegend, setShowLegend] = useState(true);

  // Auto-calculate if data was passed from birth chart page
  useEffect(() => {
    if (passedData?.date && passedData?.lat && passedData?.lon) {
      handleCalculate(null, passedData);
    }
  }, []);

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

  function handleCalculate(e, overrideData = null) {
    if (e) e.preventDefault();
    const data = overrideData || form;
    if (!data.date || !data.lat || !data.lon) return;

    setLoading(true);
    setTimeout(() => {
      const result = generateAstroLines(data.date, data.time || '12:00', parseFloat(data.lon), parseFloat(data.lat));
      setLines(result);
      setCalculated(true);
      setLoading(false);
    }, 600);
  }

  const filteredLines = lines.filter(l => activePlanets[l.planet] && activeTypes[l.type]);

  return (
    <div className="astromap-page">
      <div className="map-header">
        <div className="map-title-area">
          <div className="map-icon">🗺️</div>
          <div>
            <h1>Astrocartography</h1>
            <p>Your planetary power lines on the world map</p>
          </div>
        </div>
      </div>

      {!calculated ? (
        <div className="map-form-container">
          <div className="map-explainer">
            <h3>What is Astrocartography?</h3>
            <p>Astrocartography maps where each planet rises, sets, culminates, or is at the nadir at the moment of your birth — creating lines of energy across the globe. Living near these lines amplifies that planet's themes in your life.</p>
            <div className="explainer-examples">
              <div className="explainer-item"><span style={{color:'#FFD700'}}>☀️ Sun MC</span> — Career success & recognition</div>
              <div className="explainer-item"><span style={{color:'#90EE90'}}>♀ Venus ASC</span> — Beauty, love & magnetic charisma</div>
              <div className="explainer-item"><span style={{color:'#4169E1'}}>♃ Jupiter MC</span> — Fortune, abundance & expansion</div>
              <div className="explainer-item"><span style={{color:'#FF4500'}}>♂ Mars ASC</span> — High energy, passion & ambition</div>
            </div>
          </div>

          <form className="map-mini-form" onSubmit={handleCalculate}>
            <div className="mini-form-row">
              <label>Birth Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required
                className="mini-input" max={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="mini-form-row">
              <label>Birth Time</label>
              <input type="time" name="time" value={form.time} onChange={handleChange} className="mini-input" />
            </div>
            <div className="mini-form-row">
              <label>Birth Latitude</label>
              <input type="number" name="lat" placeholder="e.g. 40.7128" value={form.lat}
                onChange={handleChange} required className="mini-input" step="0.0001" min="-90" max="90" />
            </div>
            <div className="mini-form-row">
              <label>Birth Longitude</label>
              <input type="number" name="lon" placeholder="e.g. -74.0060" value={form.lon}
                onChange={handleChange} required className="mini-input" step="0.0001" min="-180" max="180" />
            </div>
            <button type="button" className="geo-btn-sm" onClick={handleGeolocate}>📍 Use My Location</button>
            <button type="submit" className="map-calc-btn" disabled={loading}>
              {loading ? '✦ Generating...' : '🗺️ Generate My Astro Map'}
            </button>
          </form>
        </div>
      ) : (
        <div className="map-view">
          <div className="map-controls">
            <div className="controls-section">
              <h4>Planets</h4>
              <div className="toggle-group">
                {Object.entries(PLANET_COLORS).map(([planet, color]) => (
                  <button
                    key={planet}
                    className={`toggle-pill ${activePlanets[planet] ? 'on' : 'off'}`}
                    style={activePlanets[planet] ? { borderColor: color, background: `${color}22` } : {}}
                    onClick={() => setActivePlanets(p => ({ ...p, [planet]: !p[planet] }))}
                  >
                    <span style={{ color }}>{getPlanetSymbol(planet)}</span>
                    <span className="planet-label">{capitalize(planet)}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="controls-section">
              <h4>Line Types</h4>
              <div className="toggle-group">
                {Object.entries(LINE_TYPES).map(([type, info]) => (
                  <button
                    key={type}
                    className={`toggle-pill type-pill ${activeTypes[type] ? 'on' : 'off'}`}
                    onClick={() => setActiveTypes(t => ({ ...t, [type]: !t[type] }))}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="map-wrapper">
            <MapContainer
              center={[20, 0]}
              zoom={2}
              minZoom={2}
              maxZoom={6}
              style={{ height: '100%', width: '100%' }}
              worldCopyJump={false}
              maxBounds={[[-90, -200], [90, 200]]}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              {filteredLines.map((line, i) => (
                <Polyline
                  key={`${line.planet}-${line.type}-${i}`}
                  positions={line.coordinates}
                  pathOptions={{
                    color: line.color,
                    weight: 2,
                    opacity: 0.8,
                    dashArray: line.dashed ? '6, 4' : null,
                  }}
                  eventHandlers={{
                    click: () => setSelectedLine(line),
                    mouseover: (e) => e.target.setStyle({ weight: 4, opacity: 1 }),
                    mouseout: (e) => e.target.setStyle({ weight: 2, opacity: 0.8 }),
                  }}
                >
                  <Popup>
                    <div className="line-popup">
                      <strong style={{ color: line.color }}>{capitalize(line.planet)} {line.type}</strong>
                      <p>{line.description}</p>
                    </div>
                  </Popup>
                </Polyline>
              ))}
              {/* Birth location marker */}
              {form.lat && form.lon && (
                <CircleMarker
                  center={[parseFloat(form.lat), parseFloat(form.lon)]}
                  radius={8}
                  pathOptions={{ color: '#fff', fillColor: '#9b59b6', fillOpacity: 0.9, weight: 2 }}
                >
                  <Popup><strong>Birth Location</strong></Popup>
                </CircleMarker>
              )}
            </MapContainer>
          </div>

          {selectedLine && (
            <div className="line-info-card">
              <div className="line-info-header">
                <div className="line-planet-dot" style={{ background: selectedLine.color }}></div>
                <div>
                  <h4 style={{ color: selectedLine.color }}>
                    {capitalize(selectedLine.planet)} {selectedLine.type}
                    {selectedLine.dashed && ' (IC/DSC)'}
                  </h4>
                  <p>{LINE_TYPES[selectedLine.type]?.desc}</p>
                </div>
                <button className="close-info" onClick={() => setSelectedLine(null)}>✕</button>
              </div>
              <p className="line-description">{selectedLine.description}</p>
              <div className="line-tip">
                <span>💡</span>
                <span>Living within 300km of this line amplifies these themes in your life</span>
              </div>
            </div>
          )}

          {showLegend && (
            <div className="map-legend">
              <div className="legend-header">
                <span>Line Types</span>
                <button onClick={() => setShowLegend(false)}>✕</button>
              </div>
              {Object.entries(LINE_TYPES).map(([type, info]) => (
                <div key={type} className="legend-row">
                  <div className={`legend-line ${type === 'IC' || type === 'DSC' ? 'dashed' : ''}`}></div>
                  <span className="legend-type">{type}</span>
                  <span className="legend-desc">{info.desc}</span>
                </div>
              ))}
            </div>
          )}

          <div className="map-actions">
            <button className="recalc-btn" onClick={() => setCalculated(false)}>
              ← New Chart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getPlanetSymbol(planet) {
  const symbols = {
    sun: '☀', moon: '☽', mercury: '☿', venus: '♀',
    mars: '♂', jupiter: '♃', saturn: '♄',
  };
  return symbols[planet] || planet[0].toUpperCase();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
