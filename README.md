# Global Flight Tracker

A real-time global flight tracking web application built with React, Vite, Leaflet, and Spring Boot. Features interactive maps, flight search, follow mode, trail paths, and a secure backend API proxy.

## Features

### Frontend (React + Vite)
- **Real-time Flight Data**: Live updates from OpenSky Network API
- **Interactive Map**: Leaflet-powered map with flight markers
- **Flight Search**: Search flights by callsign, ICAO, or airline
- **Follow Mode**: Track specific flights with auto-centering
- **Flight Trails**: Visualize flight paths with trail rendering
- **Performance Optimized**: Icon caching, viewport filtering, efficient re-rendering
- **Responsive UI**: Collapsible sidebar with flight details

### Backend (Spring Boot)
- **Secure API Proxy**: Server-side authentication with OpenSky Network
- **In-Memory Caching**: 25-second cache to reduce API calls
- **Retry Logic**: Exponential backoff for failed requests
- **CORS Support**: Configured for frontend integration

## Tech Stack

- **Frontend**: React 19.2.0, Vite, Leaflet 1.9.4, Axios
- **Backend**: Spring Boot 3.2.1, Maven, Java 17+
- **Mapping**: React-Leaflet, OpenStreetMap tiles
- **Styling**: CSS modules, responsive design

## Quick Start

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.6+
- OpenSky Network account (for backend)

### 1. Clone and Install Frontend
```bash
git clone <repository-url>
cd flight-tracker
npm install
```

### 2. Start Frontend (Development)
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

### 3. Setup Backend (Optional for Development)
```bash
cd backend
# Set environment variables
export OPENSKY_CLIENT_ID=your_client_id
export OPENSKY_CLIENT_SECRET=your_client_secret

mvn clean install
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`

### 4. Build for Production
```bash
npm run build
```

## Project Structure

```
flight-tracker/
├── src/
│   ├── components/
│   │   ├── FlightMap.jsx      # Main map component
│   │   ├── FlightMarker.jsx   # Individual flight markers
│   │   ├── MapEvents.jsx      # Map interaction handlers
│   │   ├── SearchBar.jsx      # Flight search component
│   │   └── Sidebar.jsx        # Flight details sidebar
│   ├── hooks/
│   │   └── useFlights.js      # Flight data fetching hook
│   ├── utils/
│   │   └── iconCache.js       # Icon caching utility
│   ├── App.jsx                # Main application
│   └── main.jsx               # React entry point
├── backend/
│   ├── src/main/java/com/flighttracker/
│   │   ├── FlightController.java     # REST API endpoint
│   │   ├── FlightDataService.java    # API proxy service
│   │   ├── config/                   # Configuration classes
│   │   └── FlightTrackerBackendApplication.java
│   ├── src/test/                     # Unit tests
│   ├── pom.xml                       # Maven configuration
│   └── README.md                     # Backend documentation
├── public/                           # Static assets
├── package.json                      # Frontend dependencies
└── vite.config.js                    # Vite configuration
```

## API Integration

### OpenSky Network API
The application uses the OpenSky Network API for real-time flight data:
- **Endpoint**: `https://opensky-network.org/api/states/all`
- **Data**: Global flight states including position, altitude, speed
- **Rate Limit**: 400 requests/day for anonymous users, higher for authenticated

### Backend Proxy
For production security, the backend proxies API calls:
- **Endpoint**: `GET /api/flights`
- **Authentication**: Basic Auth with OpenSky credentials
- **Caching**: 25-second in-memory cache
- **Response**: Same JSON structure as OpenSky API

## Key Components

### FlightMap Component
- Renders Leaflet map with OpenStreetMap tiles
- Manages flight markers and viewport filtering
- Handles map events (zoom, pan, click)

### useFlights Hook
- Fetches flight data from API (backend proxy in production)
- Implements polling for real-time updates
- Handles error states and retry logic

### FlightMarker Component
- Renders individual aircraft markers
- Shows flight details on hover/click
- Optimized with icon caching

### Sidebar Component
- Displays selected flight information
- Collapsible design for better UX
- Shows flight trail and follow mode controls

## Performance Optimizations

- **Icon Caching**: Pre-loads aircraft icons to prevent re-rendering
- **Viewport Filtering**: Only renders flights visible on screen
- **Efficient Updates**: React.memo and useMemo for component optimization
- **API Caching**: Backend caches responses to reduce external API calls

## Development

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Scripts
```bash
mvn clean install    # Build project
mvn spring-boot:run  # Start application
mvn test            # Run tests
```

## Environment Variables

### Backend
```bash
OPENSKY_CLIENT_ID=your_opensky_client_id
OPENSKY_CLIENT_SECRET=your_opensky_client_secret
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [OpenSky Network](https://opensky-network.org/) for flight data
- [Leaflet](https://leafletjs.com/) for mapping library
- [React](https://reactjs.org/) for UI framework
- [Vite](https://vitejs.dev/) for build tooling
