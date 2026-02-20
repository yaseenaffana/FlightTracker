import { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';
import { getPlaneIcon } from '../utils/iconCache';
import { useAircraftFlights } from '../hooks/useAircraftFlights';
import { getAirlineNameFromCallsign } from '../utils/airlineLogo';
import { useAircraftMetadata } from '../hooks/useAircraftMetadata';

const FlightMarker = ({ flight, selected, onSelect }) => {
  const [
    icao24,
    callsign,
    originCountry,
    ,
    lastContact,
    longitude,
    latitude,
    baroAltitude,
    onGround,
    velocity,
    trueTrack,
    verticalRate,
    ,
    ,
    squawk,
  ] = flight;

  const position = [latitude, longitude];
  const icon = getPlaneIcon(trueTrack, selected);
  const { latest, loading: detailsLoading } = useAircraftFlights(selected ? icao24 : null);
  const { metadata, loading: metadataLoading } = useAircraftMetadata(selected ? icao24 : null);

  const normalizedCallsign = useMemo(
    () => (callsign ? String(callsign).trim().replace(/\s+/g, '') : ''),
    [callsign]
  );
  const flightNumber = useMemo(
    () => normalizedCallsign.match(/[0-9]+/)?.[0] ?? null,
    [normalizedCallsign]
  );
  const airlineName = useMemo(() => getAirlineNameFromCallsign(callsign), [callsign]);

  const eta = null;

  const departure = latest?.estDepartureAirport || null;
  const destination = latest?.estArrivalAirport || null;

  const aircraftType = metadata?.typecode || metadata?.icaoaircrafttype || null;
  const aircraftName = useMemo(() => {
    const maker = metadata?.manufacturername || null;
    const model = metadata?.model || null;
    if (maker && model) return `${maker} ${model}`;
    return model || maker || metadata?.registration || null;
  }, [metadata]);

  const squawkCode = squawk ? String(squawk).trim() : null;
  const emergencySquawks = {
    '7500': 'Hijack',
    '7600': 'Radio failure',
    '7700': 'Emergency',
  };
  const emergencyLabel = squawkCode && emergencySquawks[squawkCode];
  const isEmergency = Boolean(emergencyLabel);

  const hasAltitude = Number.isFinite(baroAltitude);
  const hasSpeed = Number.isFinite(velocity);
  const hasVerticalRate = Number.isFinite(verticalRate);
  const hasHeading = Number.isFinite(trueTrack);
  const altitudeFeet = hasAltitude ? Math.round(baroAltitude * 3.28084) : null;
  const speedKnots = hasSpeed ? Math.round(velocity * 1.94384) : null;

  const handleClick = () => {
    onSelect(icao24);
  };

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{
        click: handleClick,
      }}
    >
      <Popup>
        <div style={{ color: 'black', fontFamily: 'monospace' }}>
          <strong>Plane {callsign || "Unknown"}</strong><br />
          <strong>ICAO24:</strong> {icao24}<br />
          <strong>Country:</strong> {originCountry || "N/A"}<br />
          <strong>Aircraft Name:</strong> {aircraftName || "N/A"}<br />
          <strong>Aircraft Type:</strong> {aircraftType || "N/A"}<br />
          <strong>Airline Name:</strong> {airlineName || "N/A"}<br />
          <strong>Flight Number:</strong> {flightNumber || "N/A"}<br />
          <strong>Departure:</strong> {departure || "N/A"}<br />
          <strong>Destination:</strong> {destination || "N/A"}<br />
          <strong>Altitude:</strong> {altitudeFeet ? `${altitudeFeet} ft` : "N/A"}<br />
          <strong>Speed:</strong> {speedKnots ? `${speedKnots} kt` : "N/A"}<br />
          <strong>Vertical Rate:</strong> {hasVerticalRate ? `${Math.round(verticalRate)} m/s` : "N/A"}<br />
          <strong>Squawk Code:</strong>{' '}
          <span style={isEmergency ? { color: '#b91c1c', fontWeight: 'bold' } : undefined}>
            {squawkCode || "N/A"}{isEmergency ? ` (${emergencyLabel})` : ''}
          </span>
          <br />
          <strong>ETA:</strong> {eta || "N/A"}<br />
          <strong>Heading:</strong> {hasHeading ? `${Math.round(trueTrack)} deg` : "N/A"}<br />
          <strong>On Ground:</strong> {onGround ? "Yes" : "No"}<br />
          <strong>Last Contact:</strong> {new Date(lastContact * 1000).toLocaleTimeString()}
          {detailsLoading && (
            <div style={{ marginTop: '6px', color: '#475569' }}>
              Loading route details...
            </div>
          )}
          {metadataLoading && (
            <div style={{ marginTop: '6px', color: '#475569' }}>
              Loading aircraft details...
            </div>
          )}
          {selected && (
            <div style={{ marginTop: '10px', color: '#00aa00', fontWeight: 'bold' }}>
              FOLLOWING THIS FLIGHT
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

FlightMarker.propTypes = {
  flight: PropTypes.array.isRequired,
  selected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};

FlightMarker.defaultProps = {
  selected: false,
};

export default FlightMarker;
