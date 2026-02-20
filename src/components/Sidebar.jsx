import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useAircraftFlights } from '../hooks/useAircraftFlights';
import AirlineLogo from './AirlineLogo';

const Sidebar = ({ flights, selectedFlight, onFlightSelect, isOpen, onToggle }) => {
  const selectedPlane = useMemo(() => {
    if (!selectedFlight) return null;
    return flights.find((f) => f?.[0] === selectedFlight) ?? null;
  }, [flights, selectedFlight]);

  const { latest, loading: detailsLoading } = useAircraftFlights(selectedFlight, { hours: 12 });

  const speedKmh = selectedPlane?.[9] ? Math.round(selectedPlane[9] * 3.6) : null;
  const altitudeM = selectedPlane?.[7] ? Math.round(selectedPlane[7]) : null;
  const headingDeg = selectedPlane?.[10] ? Math.round(selectedPlane[10]) : null;
  const lastContact = selectedPlane?.[4] ? new Date(selectedPlane[4] * 1000) : null;

  const dep = latest?.estDepartureAirport || null;
  const arr = latest?.estArrivalAirport || null;
  const firstSeen = latest?.firstSeen ? new Date(Number(latest.firstSeen) * 1000) : null;
  const lastSeen = latest?.lastSeen ? new Date(Number(latest.lastSeen) * 1000) : null;

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        className="sidebar-toggle"
        onClick={onToggle}
        title={isOpen ? "Hide Flight List" : "Show Flight List"}
        aria-expanded={isOpen}
        aria-controls="flight-sidebar"
      >
        {isOpen ? "◁" : "▷"}
      </button>

      {/* Sidebar Panel */}
      <div id="flight-sidebar" className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Visible Flights <span style={{ opacity: 0.8, fontWeight: 600 }}>({flights.length})</span></h3>
          <button className="sidebar-close" onClick={onToggle}>×</button>
        </div>

        <div className="sidebar-content">
          {selectedPlane && (
            <div className="flight-detail-card" style={{ marginBottom: '12px' }}>
              <div className="flight-detail-title">
                <span style={{ fontWeight: 750 }}>Selected Flight</span>
                {detailsLoading && <span style={{ opacity: 0.75, fontSize: '12px' }}>Loading details…</span>}
              </div>

              <div className="flight-detail-grid">
                <div className="flight-detail-item">
                  <div className="flight-detail-label">Callsign</div>
                  <div className="flight-detail-value" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AirlineLogo callsign={selectedPlane?.[1]} size={22} />
                    <span>{selectedPlane?.[1]?.trim() || selectedFlight}</span>
                  </div>
                </div>
                <div className="flight-detail-item">
                  <div className="flight-detail-label">Speed</div>
                  <div className="flight-detail-value">{speedKmh != null ? `${speedKmh} km/h` : 'N/A'}</div>
                </div>
                <div className="flight-detail-item">
                  <div className="flight-detail-label">Altitude</div>
                  <div className="flight-detail-value">{altitudeM != null ? `${altitudeM} m` : 'N/A'}</div>
                </div>
                <div className="flight-detail-item">
                  <div className="flight-detail-label">Heading</div>
                  <div className="flight-detail-value">{headingDeg != null ? `${headingDeg}°` : 'N/A'}</div>
                </div>
                <div className="flight-detail-item">
                  <div className="flight-detail-label">Departure</div>
                  <div className="flight-detail-value">{dep || 'Unknown'}</div>
                </div>
                <div className="flight-detail-item">
                  <div className="flight-detail-label">Arrival</div>
                  <div className="flight-detail-value">{arr || 'Unknown'}</div>
                </div>
                <div className="flight-detail-item">
                  <div className="flight-detail-label">Departure time</div>
                  <div className="flight-detail-value">{firstSeen ? firstSeen.toLocaleString() : 'Unknown'}</div>
                </div>
                <div className="flight-detail-item">
                  <div className="flight-detail-label">Last seen</div>
                  <div className="flight-detail-value">{lastSeen ? lastSeen.toLocaleString() : (lastContact ? lastContact.toLocaleString() : 'Unknown')}</div>
                </div>
              </div>
            </div>
          )}

          {flights.length === 0 ? (
            <div className="no-flights">No flights visible in current view</div>
          ) : (
            <ul className="flight-list">
              {flights.map((flight) => {
                const [icao24, callsign, originCountry, timePosition, lastContact, longitude, latitude, baroAltitude, onGround, velocity] = flight;
                const isSelected = selectedFlight === icao24;

                return (
                  <li
                    key={icao24}
                    className={`flight-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => onFlightSelect(icao24)}
                  >
                    <div className="flight-info">
                      <div className="flight-callsign-row">
                        <AirlineLogo callsign={callsign} size={22} />
                        <div className="flight-callsign">
                          ✈ {callsign || `ICAO:${icao24.slice(-6)}`}
                        </div>
                      </div>
                      <div className="flight-details">
                        <span className="flight-speed">
                          {velocity ? `${Math.round(velocity * 3.6)} km/h` : 'N/A'}
                        </span>
                        <span className="flight-altitude">
                          {baroAltitude ? `${Math.round(baroAltitude)}m` : 'N/A'}
                        </span>
                      </div>
                      <div className="flight-country">
                        {originCountry || 'Unknown'}
                      </div>
                    </div>
                    {isSelected && <div className="following-indicator">🎯</div>}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  flights: PropTypes.array.isRequired,
  selectedFlight: PropTypes.string,
  onFlightSelect: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default Sidebar;