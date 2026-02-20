import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { getAirlineLogoUrl, inferAirlineCodesFromCallsign } from '../utils/airlineLogo';

export default function AirlineLogo({ callsign, size = 22, className = '' }) {
  const [failed, setFailed] = useState(false);
  const { iata, icao, callsign: normalized } = useMemo(
    () => inferAirlineCodesFromCallsign(callsign),
    [callsign]
  );

  const code = iata || icao || null;
  const src = !failed ? getAirlineLogoUrl(iata) : null;

  if (!code) return null;

  if (!src) {
    return (
      <span
        className={`airline-badge ${className}`.trim()}
        style={{ width: size, height: size }}
        title={normalized || code}
        aria-label={`Airline ${code}`}
      >
        {code}
      </span>
    );
  }

  return (
    <img
      className={`airline-logo ${className}`.trim()}
      src={src}
      alt={`${code} logo`}
      title={normalized || code}
      width={size}
      height={size}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

AirlineLogo.propTypes = {
  callsign: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  size: PropTypes.number,
  className: PropTypes.string,
};

