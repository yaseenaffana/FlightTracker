import { useEffect, useState } from 'react';
import axios from 'axios';

export function useAircraftMetadata(icao24) {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!icao24) {
      setMetadata(null);
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
        const res = await axios.get(`/api/aircraft/${icao24}/metadata`, {
          signal: controller.signal,
          timeout: 10000,
        });
        if (!cancelled) setMetadata(res.data || null);
      } catch (e) {
        if (e?.name === 'CanceledError' || e?.name === 'AbortError') return;
        if (!cancelled) {
          setError('Failed to load aircraft metadata.');
          setMetadata(null);
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
  }, [icao24]);

  return { metadata, loading, error };
}
