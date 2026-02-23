# ✈️ Flight Tracker

A real-time flight tracking web application that visualizes live aircraft positions on an interactive dark-themed world map. Built with React and powered by the [OpenSky Network API](https://opensky-network.org/).

> **Live Demo:** [https://flighttracker-777.web.app](https://flighttracker-777.web.app)

---

## 📸 Screenshots

| Map View | Flight Details |
|----------|----------------|
| Real-time aircraft positions displayed as green plane icons on a dark CARTO basemap | Click any flight to see detailed info including airline, route, altitude, speed, and more |

---

## ✨ Features

### Core
- **Real-time Flight Tracking** — Live aircraft positions updated every 15 seconds via the OpenSky Network API
- **Interactive Dark Map** — Beautiful dark-themed CARTO basemap with zoom and pan controls powered by Leaflet
- **Flight Search** — Search flights by callsign (e.g., `AAL123`, `AI302`) with real-time filtering

### Flight Information
- **Detailed Popups** — Click any aircraft to see:
  - Callsign, ICAO24 identifier, and origin country
  - Aircraft type and manufacturer (e.g., Boeing 737, Airbus A320)
  - Airline name and logo (fetched from Google Flights CDN)
  - Departure and arrival airports
  - Altitude (feet), speed (knots), heading, and vertical rate
  - Squawk code with **emergency detection** (7500, 7600, 7700)
  - Ground status and last contact time

### Map Features
- **Flight Following** — Select a flight to auto-follow it as it moves across the map
- **Flight Trails** — Selected flights show a dashed green polyline trail of their last 20 positions
- **Bounds-based Filtering** — Only flights within the current map viewport are listed in the sidebar
- **Performance Optimized** — Canvas rendering, icon caching (rounded to 5° heading), and a 500-marker display limit

### Sidebar
- **Flight List Panel** — Collapsible sidebar showing all visible flights with:
  - Airline logo, callsign, speed, altitude, and country of origin
  - Dedicated detail card for the selected/followed flight
- **Responsive Design** — Sidebar adapts to mobile screens with overlay behavior

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework with hooks-based architecture |
| **Vite 7** | Build tool and dev server with HMR |
| **Leaflet 1.9** + **React-Leaflet 5** | Interactive map rendering |
| **Axios** | HTTP client for API calls with timeout and abort support |
| **Prop-Types** | Runtime type checking for React components |
| **CARTO Dark Basemap** | Dark-themed map tiles |

### Backend (Optional — for local development)
| Technology | Purpose |
|------------|---------|
| **Spring Boot 3.4** | Java backend framework |
| **Java 17** | Runtime environment |
| **Caffeine Cache** | In-memory caching for API responses |
| **Spring Retry** | Automatic retry with exponential backoff |
| **Maven** | Build and dependency management |

### Deployment & Hosting
| Technology | Purpose |
|------------|---------|
| **Firebase Hosting** | Static site hosting for the frontend |
| **Firebase CLI** | Deployment tooling |
| **GitHub Actions** | CI/CD pipeline for automatic deploys on merge to `main` |

### External APIs
| API | Purpose |
|-----|---------|
| [**OpenSky Network**](https://opensky-network.org/apidoc/) | Live flight state vectors, aircraft flights, and metadata |
| [**Google Flights CDN**](https://www.gstatic.com/flights/airline_logos/) | Airline logo images |

---

## 📁 Project Structure

```
flight-tracker/
├── index.html                  # Entry HTML with root div
├── vite.config.js              # Vite config with backend proxy
├── firebase.json               # Firebase Hosting config
├── package.json                # Dependencies and scripts
│
├── src/
│   ├── main.jsx                # App entry point
│   ├── App.jsx                 # Root component with state management
│   ├── index.css               # Global styles, theme, responsive design
│   ├── App.css                 # Minimal app-specific styles
│   │
│   ├── components/
│   │   ├── FlightMap.jsx       # Leaflet map with flight markers and trails
│   │   ├── FlightMarker.jsx    # Individual aircraft marker with popup details
│   │   ├── MapEvents.jsx       # Map interaction handler (bounds, follow)
│   │   ├── Sidebar.jsx         # Flight list panel with detail card
│   │   ├── SearchBar.jsx       # Callsign search input
│   │   └── AirlineLogo.jsx     # Airline logo with text fallback
│   │
│   ├── hooks/
│   │   ├── useFlights.js       # Polls OpenSky API for live flight data
│   │   ├── useAircraftFlights.js  # Fetches flight history for an aircraft
│   │   └── useAircraftMetadata.js # Fetches aircraft type/manufacturer info
│   │
│   └── utils/
│       ├── airlineLogo.js      # ICAO/IATA code mapping and logo URL builder
│       └── iconCache.js        # Cached Leaflet divIcon plane icons
│
├── backend/                    # Spring Boot backend (optional)
│   ├── Dockerfile              # Multi-stage Docker build for deployment
│   ├── pom.xml                 # Maven config with Spring Boot 3.4
│   └── src/main/java/com/flighttracker/
│       ├── FlightTrackerBackendApplication.java
│       ├── controller/FlightController.java    # REST API endpoints
│       ├── service/FlightDataService.java      # OpenSky API client with caching
│       └── config/
│           ├── OpenSkyConfig.java     # API credentials config
│           ├── CorsConfig.java        # CORS settings
│           ├── CacheConfig.java       # Caffeine cache setup
│           └── RestTemplateConfig.java
│
└── .github/workflows/
    ├── firebase-hosting-merge.yml       # Auto-deploy on push to main
    └── firebase-hosting-pull-request.yml # Preview deploy on PR
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and **npm**
- (Optional) **Java 17** and **Maven 3.9+** for the backend

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd flight-tracker

# Install frontend dependencies
npm install
```

### Running Locally

**Frontend only (connects directly to OpenSky API):**
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

**With backend (adds caching and credential support):**
```bash
# Terminal 1 — Start backend
cd backend
mvn spring-boot:run

# Terminal 2 — Start frontend
npm run dev
```

> **Note:** When using the backend, update `useFlights.js` to use `/api/flights` instead of the direct OpenSky URL. The Vite proxy will forward requests to `localhost:8080`.

### Building for Production

```bash
npm run build
```

The production bundle is output to the `dist/` directory.

### Deploying to Firebase

```bash
npm run build
firebase deploy --only hosting
```

---

## 🔌 API Reference

### OpenSky Network Endpoints Used

| Endpoint | Description |
|----------|-------------|
| `GET /api/states/all` | All current aircraft state vectors (position, speed, altitude, heading) |
| `GET /api/flights/aircraft?icao24=...&begin=...&end=...` | Flight history for a specific aircraft |
| `GET /api/metadata/aircraft/{icao24}` | Aircraft registration, type, and manufacturer info |

### Rate Limits
- **Anonymous:** ~10 requests/minute, 15-second data resolution
- **Authenticated:** Higher limits with OpenSky account credentials

---

## 🎨 Design

- **Dark theme** with glassmorphism effects and subtle gradients
- **CSS custom properties** for consistent theming across light/dark modes
- **Responsive layout** with mobile-optimized sidebar (overlay on small screens)
- **Smooth transitions** on sidebar toggle, search focus, and map interactions
- **Color palette:** Sky blue (`#38bdf8`) accent, violet (`#a78bfa`) for selections, green (`#34d399`) for success

---

## 📄 License

This project is for educational and personal use. Flight data is provided by the [OpenSky Network](https://opensky-network.org/) under their usage terms.

---

## 🙏 Acknowledgments

- [OpenSky Network](https://opensky-network.org/) — Free, open-source flight tracking data
- [Leaflet](https://leafletjs.com/) — Open-source interactive maps
- [CARTO](https://carto.com/) — Beautiful dark basemap tiles
- [Google Flights](https://flights.google.com/) — Airline logo assets
#   F l i g h t T r a c k e r  
 #   F l i g h t T r a c k e r  
 #   F l i g h t T r a c k e r  
 #   F l i g h t T r a c k e r  
 