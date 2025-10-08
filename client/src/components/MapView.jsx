import { useEffect, useRef, useState } from "react";
import GoogleMapsLoader from "./GoogleMapsLoader";

const FALLBACK_CENTER = { lat: 31.5204, lng: 74.3587 }; // Lahore fallback

export default function MapView({ buses = [], currentUserLocation = null, showUserLocation = true }) {
  const [currentPos, setCurrentPos] = useState(currentUserLocation);
  const [error, setError] = useState("");
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!showUserLocation) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCurrentPos(coords);

          if (map) {
            map.panTo(coords);
            setTimeout(() => map.setZoom(15), 300);
          }
        },
        (err) => setError(err.message),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setError("Geolocation not supported by this browser.");
    }
  }, [map, showUserLocation]);

  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add bus markers
    buses.forEach(bus => {
      if (bus.latitude && bus.longitude) {
        const marker = new window.google.maps.Marker({
          position: { lat: bus.latitude, lng: bus.longitude },
          map: map,
          title: bus.busNumber || 'Bus',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path fill="#FF6B6B" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                <circle fill="#FF6B6B" cx="12" cy="12" r="5"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
          },
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="color: #000; padding: 5px;">
            <strong>${bus.busNumber || 'Bus'}</strong><br/>
            ${bus.driver || 'No driver assigned'}
          </div>`,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        markersRef.current.push(marker);
      }
    });

    // Add user location marker
    if (currentPos && showUserLocation) {
      const userMarker = new window.google.maps.Marker({
        position: currentPos,
        map: map,
        title: 'Your Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
              <circle fill="#4285F4" cx="12" cy="12" r="8"/>
              <circle fill="#fff" cx="12" cy="12" r="3"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
        },
      });
      markersRef.current.push(userMarker);
    }
  }, [map, buses, currentPos, showUserLocation]);

  const initializeMap = () => {
    if (!mapRef.current || map) return;

    const newMap = new window.google.maps.Map(mapRef.current, {
      center: currentPos || FALLBACK_CENTER,
      zoom: 15,
      disableDefaultUI: true,
      zoomControl: true,
    });

    setMap(newMap);
  };

  const recenter = () => {
    if (map && currentPos) {
      map.panTo(currentPos);
      setTimeout(() => map.setZoom(15), 300);
    }
  };

  return (
    <GoogleMapsLoader onLoad={initializeMap}>
      <div className="map-shell">
        {error && <div className="map-error">{error}</div>}
        <div ref={mapRef} className="map-container" />
        {showUserLocation && currentPos && (
          <button className="recenter-btn" onClick={recenter}>
            🎯 Re-center
          </button>
        )}
      </div>
    </GoogleMapsLoader>
  );
}