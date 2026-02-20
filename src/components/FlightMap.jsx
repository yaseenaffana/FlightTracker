import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import MapEvents from './MapEvents';
import FlightMarker from './FlightMarker';

const TRAIL_LENGTH = 20; // Store last 20 positions for trail

const FlightMap = ({ flights, selectedFlight, selectedPlanePosition, onBoundsChange, onFlightSelect }) => {
  const [flightTrails, setFlightTrails] = useState(new Map());

  // Update flight trails when new flight data arrives
  useEffect(() => {
    setFlightTrails(prevTrails => {
      const newTrails = new Map(prevTrails);

      flights.forEach(flight => {
        const icao24 = flight[0];
        const position = [flight[6], flight[5]];

        if (!position[0] || !position[1]) return; // Skip invalid positions

        if (!newTrails.has(icao24)) {
          newTrails.set(icao24, []);
        }

        const trail = newTrails.get(icao24);
        // Add new position if it's different from the last one
        const lastPos = trail[trail.length - 1];
        if (!lastPos || lastPos[0] !== position[0] || lastPos[1] !== position[1]) {
          trail.push(position);
          // Keep only the last TRAIL_LENGTH positions
          if (trail.length > TRAIL_LENGTH) {
            trail.shift();
          }
        }
      });

      return newTrails;
    });
  }, [flights]);

  const selectedTrail = selectedFlight ? flightTrails.get(selectedFlight) : null;

  return (
    <MapContainer
      center={[20, 78]} // Centered on India, but shows global
      zoom={3}
      style={{ height: "100%", width: "100%" }}
      zoomControl={true}
      preferCanvas={true} // Enable canvas rendering for better performance
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <MapEvents
        onBoundsChange={onBoundsChange}
        followPosition={selectedPlanePosition}
      />

      {/* Render trail for selected flight */}
      {selectedTrail && selectedTrail.length > 1 && (
        <Polyline
          positions={selectedTrail}
          color="#00ff00"
          weight={3}
          opacity={0.8}
          dashArray="5, 5"
        />
      )}

      {flights.map((flight, index) => (
        flight[6] && flight[5] && ( // Check for valid lat/lon
          <FlightMarker
            key={`${flight[0]}-${index}`} // Use icao24 for unique key
            flight={flight}
            selected={selectedFlight === flight[0]}
            onSelect={onFlightSelect}
          />
        )
      ))}
    </MapContainer>
  );
};

FlightMap.propTypes = {
  flights: PropTypes.array.isRequired,
  selectedFlight: PropTypes.string,
  selectedPlanePosition: PropTypes.array,
  onBoundsChange: PropTypes.func.isRequired,
  onFlightSelect: PropTypes.func.isRequired,
};

export default FlightMap;