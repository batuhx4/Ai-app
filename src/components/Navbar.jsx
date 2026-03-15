import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Horoscopes' },
    { path: '/birth-chart', label: 'Birth Chart' },
    { path: '/astro-map', label: 'Astro Map' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </button>
        <Link to="/" className="navbar-logo">
          <span className="logo-star">✦</span> AstroMap
        </Link>
        <div className="navbar-tabs">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-tab ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
