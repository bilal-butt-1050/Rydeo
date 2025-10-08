import { useEffect, useState } from 'react';

const GoogleMapsLoader = ({ children, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      if (onLoad) onLoad();
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Wait for it to load
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          setIsLoaded(true);
          if (onLoad) onLoad();
          clearInterval(checkInterval);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    // Load the script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_MAPS_JS_API_KEY}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsLoaded(true);
      if (onLoad) onLoad();
    };

    script.onerror = () => {
      setError('Failed to load Google Maps');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, [onLoad]);

  if (error) {
    return <div className="map-fallback">Error: {error}</div>;
  }

  if (!isLoaded) {
    return <div className="map-fallback">Loading map...</div>;
  }

  return children;
};

export default GoogleMapsLoader;