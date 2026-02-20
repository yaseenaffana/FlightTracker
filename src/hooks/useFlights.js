import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const API_URL = '/api/flights'; // Backend proxy endpoint
const POLL_INTERVAL = 15000; // 15 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

export const useFlights = () => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const abortControllerRef = useRef(null);
  const isRequestInProgressRef = useRef(false);

  const fetchFlightsWithRetry = useCallback(async (retries = 0) => {
    // If this is the first attempt and a request is already in progress, don't start a new one
    if (retries === 0 && isRequestInProgressRef.current) {
      return;
    }

    try {
      // Only cancel previous request on the first attempt, not on retries
      if (retries === 0 && abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController only on first attempt
      if (retries === 0) {
        abortControllerRef.current = new AbortController();
        isRequestInProgressRef.current = true;
      }

      const response = await axios.get(API_URL, {
        signal: abortControllerRef.current.signal,
        timeout: 10000, // 10 second timeout
      });

      setPlanes(response.data.states || []);
      setError(null);
      setLoading(false);
      isRequestInProgressRef.current = false;

    } catch (err) {
      if (err.name === 'AbortError' || err.name === 'CanceledError') {
        // Request was cancelled, ignore
        isRequestInProgressRef.current = false;
        return;
      }

      console.error(`API Error (attempt ${retries + 1}):`, err);

      if (retries < MAX_RETRIES) {
        // Exponential backoff
        const delay = RETRY_DELAY * Math.pow(2, retries);
        setTimeout(() => fetchFlightsWithRetry(retries + 1), delay);
      } else {
        setError('Failed to fetch flight data after multiple attempts. Please check your connection.');
        setLoading(false);
        isRequestInProgressRef.current = false;
      }
    }
  }, []);

  const fetchFlights = useCallback(() => {
    fetchFlightsWithRetry();
  }, [fetchFlightsWithRetry]);

  useEffect(() => {
    // Initial fetch
    fetchFlights();

    // Set up polling
    intervalRef.current = setInterval(fetchFlights, POLL_INTERVAL);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      isRequestInProgressRef.current = false;
    };
  }, [fetchFlights]);

  // Manual refresh function
  const refreshFlights = useCallback(() => {
    if (!isRequestInProgressRef.current) {
      setLoading(true);
      fetchFlights();
    }
  }, [fetchFlights]);

  return {
    planes,
    loading,
    error,
    refreshFlights,
  };
};