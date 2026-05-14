import { useState, useEffect } from 'react';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      Promise.resolve().then(() => {
        setState(s => s.error === 'Geolocation is not supported' ? s : { ...s, error: 'Geolocation is not supported' });
      });
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      setState(s => ({ ...s, error: error.message }));
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  return state;
}
