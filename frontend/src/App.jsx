import { useState } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import SymptomForm from './components/SymptomForm';
import ResultCard from './components/ResultCard';

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const [liveClinics, setLiveClinics] = useState([]);
  const [isFetchingClinics, setIsFetchingClinics] = useState(false);

  // Specialist to Overpass Query Map
  const radius = import.meta.env.VITE_SEARCH_RADIUS || 10000;
  
  const SPECIALIST_TO_QUERY = {
    neurologist: `node["healthcare"="doctor"]["healthcare:speciality"="neurology"](around:${radius},LAT,LNG);`,
    cardiologist: `node["healthcare"="doctor"]["healthcare:speciality"="cardiology"](around:${radius},LAT,LNG);`,
    dermatologist: `node["healthcare"="doctor"]["healthcare:speciality"="dermatology"](around:${radius},LAT,LNG);`,
    gastroenterologist: `node["healthcare"="doctor"]["healthcare:speciality"="gastroenterology"](around:${radius},LAT,LNG);`,
    'general physician': `node["amenity"~"clinic|doctors"](around:${radius},LAT,LNG);`,
    dentist: `node["amenity"="dentist"](around:${radius},LAT,LNG);`,
    ophthalmologist: `node["healthcare"="doctor"]["healthcare:speciality"="ophthalmology"](around:${radius},LAT,LNG);`,
    orthopedist: `node["healthcare"="doctor"]["healthcare:speciality"~"orthopaedics|orthopedics"](around:${radius},LAT,LNG);`,
    physiotherapist: `node["healthcare"="physiotherapist"](around:${radius},LAT,LNG);`,
    psychiatrist: `node["healthcare"="doctor"]["healthcare:speciality"="psychiatry"](around:${radius},LAT,LNG);`,
    pulmonologist: `node["healthcare"="doctor"]["healthcare:speciality"~"pulmonology|pneumology"](around:${radius},LAT,LNG);`,
    ent: `node["healthcare"="doctor"]["healthcare:speciality"~"otolaryngology|ent"](around:${radius},LAT,LNG);`,
    gynecologist: `node["healthcare"="doctor"]["healthcare:speciality"~"gynaecology|gynecology"](around:${radius},LAT,LNG);`,
  };

  const fetchLiveClinics = async (specialist, lat, lng) => {
    setIsFetchingClinics(true);
    const key = specialist?.toLowerCase();
    const queryTemplate = SPECIALIST_TO_QUERY[key] || `node["amenity"~"hospital|clinic|doctors"](around:${radius},LAT,LNG);`;
    const nodeQuery = queryTemplate.replace(/LAT/g, lat).replace(/LNG/g, lng);
    const overpassQuery = `[out:json][timeout:25];\n(\n  ${nodeQuery}\n);\nout body;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const results = (data.elements || [])
        .filter((el) => el.lat && el.lon)
        .map((el) => ({
          name: el.tags?.name || el.tags?.['name:en'] || 'Nearby Medical Center',
          lat: el.lat,
          lng: el.lon,
          type: el.tags?.amenity || el.tags?.healthcare || '',
          distance: getDistance(lat, lng, el.lat, el.lon)
        }))
        .sort((a, b) => a.distance - b.distance);
      setLiveClinics(results);
    } catch (err) {
      console.error("Overpass fetch failed", err);
    } finally {
      setIsFetchingClinics(false);
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSearch = async (symptom) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setLiveClinics([]);

    try {
      const res = await fetch('/api/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptom }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setError({
            title: 'Symptom Not Recognized',
            message: `We couldn't find a match for "${symptom}". Try a more common term like "headache", "chest pain", or "skin rash".`,
          });
        } else {
          setError({
            title: 'Something Went Wrong',
            message: data.error || 'An unexpected server error occurred. Please try again.',
          });
        }
      } else {
        setResult(data);

        // Try to get user position and fetch live clinics
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              setUserPos({ lat: latitude, lng: longitude });
              fetchLiveClinics(data.specialist, latitude, longitude);
            },
            () => console.log("Location access denied"),
            { timeout: 5000 }
          );
        }

        setTimeout(() => {
          document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch (err) {
      setError({
        title: 'Connection Failed',
        message: 'Unable to reach the server. Make sure the backend is running on port 3000.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-orbs" aria-hidden="true" />
      <Navbar />

      <main className="main-wrapper">
        {/* Hero */}
        <section className="hero-section">
          <div className="hero-badge">AI-Powered Triage</div>
          <h1 className="hero-title">
            Find the right<br />
            <span className="highlight">specialist instantly</span>
          </h1>
          <p className="hero-subtitle">
            Describe your symptoms and XiBit will match you to the correct medical specialist and show you nearby clinics — instantly.
          </p>
          <div className="stats-row">
            <div className="stat-chip">
              <span className="stat-num">39+</span> symptoms mapped
            </div>
            <div className="stat-chip">
              <span className="stat-num">19+</span> partner clinics
            </div>
            <div className="stat-chip">
              <span className="stat-num">10+</span> specialties
            </div>
          </div>
        </section>

        {/* Search */}
        <SymptomForm onSearch={handleSearch} isLoading={isLoading} />

        {/* Loading */}
        {isLoading && (
          <div className="loading-wrapper" aria-live="polite" aria-label="Loading">
            <div className="loading-spinner" />
            <p className="loading-text">Analysing your symptoms…</p>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="error-card" role="alert">
            <span className="error-icon">⚠️</span>
            <div>
              <div className="error-title">{error.title}</div>
              <div className="error-message">{error.message}</div>
            </div>
          </div>
        )}

        {/* Result */}
        {!isLoading && !error && (
          <ResultCard
            result={result}
            liveClinics={liveClinics}
            userPos={userPos}
            isFetchingClinics={isFetchingClinics}
          />
        )}
      </main>

      <footer className="footer">
        Built with ❤️ for <span>XiBit Hackathon 2026</span> &mdash; Symptom-to-Specialist Mapper
      </footer>
    </>
  );
}

export default App;
