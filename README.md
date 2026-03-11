# XiBit | Symptom-to-Specialist Mapper ⚕️📍

XiBit is an AI-powered medical triage tool designed for hackathons. It helps users identify the correct medical specialist based on their symptoms and provides real-time, live navigation to the nearest clinics using their current GPS location.

---

## 🌟 Key Features

- **AI Symptom Mapping**: Instantly maps over 40+ symptoms to the correct medical specialty (Neurologist, Cardiologist, etc.).
- **Live Geolocation**: Detects the user's real-time position using the browser's Geolocation API.
- **Real-Time Clinic Discovery**: Queries the **Overpass API (OpenStreetMap)** live to find the actual closest clinics, hospitals, and doctors near the user.
- **Interactive Map**: A premium Leaflet-based map with custom markers for the user (Blue) and clinics (Red).
- **One-Click Navigation**: Integrated with Google Maps for immediate turn-by-turn directions.
- **Premium Dark UI**: A modern, glassmorphic medical interface built with high-performance CSS and React.

---

## 🚀 Tech Stack

- **Frontend**: React.js (Vite), Leaflet, React-Leaflet, Vanilla CSS.
- **Backend**: Node.js, Express.js.
- **Data Source**: Live Overpass API (OSM) + Fallback Static JSON database.
- **Design**: Modern Dark Theme with Glassmorphism and Micro-animations.

---

## 📁 Project Structure

```text
XiBit/
├── backend/
│   ├── data/           # Symptom & Clinic fallback databases
│   ├── routes/         # Express API routes
│   └── server.js       # Express server (Port 3000)
├── frontend/
│   ├── src/
│   │   ├── components/ # Navbar, SymptomForm, ResultCard, ClinicMap
│   │   ├── App.jsx     # Main logic & Geolocation handling
│   │   └── index.css   # Global design system
│   └── vite.config.js  # Frontend dev server + Proxy settings
└── README.md           # Project documentation
```

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/XiBit.git
cd XiBit
```

### 2. Setup Backend
```bash
cd backend
npm install
node server.js
```
*The backend will run on `http://localhost:3000`*

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`*

---

## 📖 How to Use

1. Open `http://localhost:5173` in your browser.
2. Enter your symptom (e.g., "headache", "chest pain", "skin rash") or click one of the quick-select chips.
3. **Allow Location Access** when prompted by the browser.
4. View your recommended specialist and the list of real clinics near you.
5. Click **"Navigate Now"** on any clinic card or map popup to get directions via Google Maps.

---

## 🏆 Hackathon Details
- **Project Name**: XiBit
- **Category**: Healthcare / AI Triage
- **Year**: 2026

Built with ❤️ for the medical community.
