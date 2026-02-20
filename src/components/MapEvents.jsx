import { useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const MapEvents = ({ onBoundsChange, followPosition }) => {
  const map = useMap();
  const isUserInteracting = useRef(false);

  useMapEvents({
    moveend: () => {
      onBoundsChange(map.getBounds());
      // Reset user interaction flag after a short delay
      setTimeout(() => {
        isUserInteracting.current = false;
      }, 100);
    },
    zoomend: () => {
      onBoundsChange(map.getBounds());
      setTimeout(() => {
        isUserInteracting.current = false;
      }, 100);
    },
    movestart: () => {
      isUserInteracting.current = true;
    },
    zoomstart: () => {
      isUserInteracting.current = true;
    },
  });

  useEffect(() => {
    // Set initial bounds
    onBoundsChange(map.getBounds());
  }, [map, onBoundsChange]);

  // Auto-follow selected flight
  useEffect(() => {
    if (followPosition && !isUserInteracting.current) {
      map.panTo(followPosition, { animate: true, duration: 1 });
    }
  }, [followPosition, map]);

  return null;
};

MapEvents.propTypes = {
  onBoundsChange: PropTypes.func.isRequired,
  followPosition: PropTypes.array,
};

export default MapEvents;