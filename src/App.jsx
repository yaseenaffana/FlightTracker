import { useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import { useFlights } from './hooks/useFlights';
import SearchBar from './components/SearchBar';
import FlightMap from './components/FlightMap';
import Sidebar from './components/Sidebar';

// Fix default marker icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

function App() {
  const [search, setSearch] = useState("");
  const [mapBounds, setMapBounds] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { planes, loading, error, refreshFlights } = useFlights();

  const filteredPlanes = useMemo(() => {
    let filtered = planes;

    // Filter by search
    if (search) {
      filtered = filtered.filter(p => p[1] && p[1].toLowerCase().includes(search.toLowerCase()));
    }

    // Filter by map bounds if available
    if (mapBounds) {
      filtered = filtered.filter(p => {
        const lat = p[6];
        const lon = p[5];
        return lat >= mapBounds.getSouth() && lat <= mapBounds.getNorth() &&
               lon >= mapBounds.getWest() && lon <= mapBounds.getEast();
      });
    }

    // Limit to 500 markers for performance
    return filtered.slice(0, 500);
  }, [planes, search, mapBounds]);

  const handleBoundsChange = useCallback((bounds) => {
    setMapBounds(bounds);
  }, []);

  const handleFlightSelect = useCallback((icao24) => {
    setSelectedFlight(selectedFlight === icao24 ? null : icao24);
  }, [selectedFlight]);

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen]);

  const selectedPlanePosition = useMemo(() => {
    if (!selectedFlight) return null;
    const selectedPlane = planes.find(p => p[0] === selectedFlight);
    return selectedPlane ? [selectedPlane[6], selectedPlane[5]] : null;
  }, [planes, selectedFlight]);

  return (
    <div className="app-container">
      <Sidebar
        flights={filteredPlanes}
        selectedFlight={selectedFlight}
        onFlightSelect={handleFlightSelect}
        isOpen={sidebarOpen}
        onToggle={handleSidebarToggle}
      />

      <div className={`map-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by flight number (callsign)..."
        />
        {selectedFlight && (
          <div className="follow-indicator">
            🎯 Following: {planes.find(p => p[0] === selectedFlight)?.[1] || selectedFlight}
            <button onClick={() => setSelectedFlight(null)} style={{ marginLeft: '10px' }}>
              Stop Following
            </button>
          </div>
        )}
        {loading && <div className="loading">Loading flight data...</div>}
        {error && (
          <div className="error">
            {error}
            <br />
            <button onClick={refreshFlights} style={{ marginTop: '10px' }}>
              Retry
            </button>
          </div>
        )}
        <FlightMap
          flights={filteredPlanes}
          selectedFlight={selectedFlight}
          selectedPlanePosition={selectedPlanePosition}
          onBoundsChange={handleBoundsChange}
          onFlightSelect={handleFlightSelect}
        />
      </div>
    </div>
  );
}

export default App;
