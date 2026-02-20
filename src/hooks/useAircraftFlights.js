import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

/**
 * Fetches recent flight records for an aircraft (icao24) from the backend.
 * Backend endpoint: GET /api/aircraft/:icao24/flights?hours=12
 *
 * Returned items typically include:
 * - firstSeen, lastSeen (epoch seconds)
 * - estDepartureAirport, estArrivalAirport
 * - callsign
 */
export function useAircraftFlights(icao24, { hours = 12 } = {}) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!icao24) {
      setFlights([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    async function run() {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/api/aircraft/${icao24}/flights`, {
          params: { hours },
          signal: controller.signal,
          timeout: 10000,
        });
        if (!cancelled) setFlights(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (e?.name === 'CanceledError' || e?.name === 'AbortError') return;
        if (!cancelled) {
          setError('Failed to load flight details.');
          setFlights([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [icao24, hours]);

  const latest = useMemo(() => {
    if (!flights.length) return null;
    // Pick the record with the most recent lastSeen.
    return flights.reduce((best, cur) => {
      const bestLast = Number(best?.lastSeen ?? 0);
      const curLast = Number(cur?.lastSeen ?? 0);
      return curLast > bestLast ? cur : best;
    }, flights[0]);
  }, [flights]);

  return { flights, latest, loading, error };
}

