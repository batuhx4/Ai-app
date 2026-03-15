import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StarryBackground from './components/StarryBackground';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import HoroscopePage from './pages/HoroscopePage';
import BirthChartPage from './pages/BirthChartPage';
import AstroMapPage from './pages/AstroMapPage';
import CompatibilityPage from './pages/CompatibilityPage';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <StarryBackground />
      <Navbar />
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/horoscope/:sign" element={<HoroscopePage />} />
          <Route path="/birth-chart" element={<BirthChartPage />} />
          <Route path="/astro-map" element={<AstroMapPage />} />
          <Route path="/compatibility" element={<CompatibilityPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
