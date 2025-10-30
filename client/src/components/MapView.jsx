import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon issue in Leaflet with bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const FALLBACK_CENTER = [31.5204, 74.3587]; // Lahore fallback [lat, lng]

export default function MapView() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [currentPos, setCurrentPos] = useState(null);
  const [error, setError] = useState("");

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map instance
    const map = L.map(mapContainerRef.current).setView(FALLBACK_CENTER, 15);
    mapRef.current = map;

    // Add Geoapify tile layer
    const isRetina = window.devicePixelRatio > 1;
    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    const baseUrl = `https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${apiKey}`;
    const retinaUrl = `https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}@2x.png?apiKey=${apiKey}`;

    L.tileLayer(isRetina ? retinaUrl : baseUrl, {
      maxZoom: 20,
      id: "osm-carto",
    }).addTo(map);

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Get user location
  useEffect(() => {
    if (!mapRef.current) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setCurrentPos(coords);

          // Update map view
          mapRef.current.setView(coords, 18);

          // Add or update marker
          if (markerRef.current) {
            markerRef.current.setLatLng(coords);
          } else {
            markerRef.current = L.marker(coords)
              .addTo(mapRef.current)
              .bindPopup("You are here!")
              .openPopup();
          }
        },
        (err) => setError(err.message),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setError("Geolocation not supported by this browser.");
    }
  }, []);

  const recenter = () => {
    if (mapRef.current && currentPos) {
      mapRef.current.setView(currentPos, 18);
    }
  };

  if (error) return <div className="map-fallback">Error: {error}</div>;

  return (
    <div className="map-shell">
      <div ref={mapContainerRef} className="map-container" />
      {currentPos && (
        <button className="recenter-btn" onClick={recenter}>
          🎯 Re-center
        </button>
      )}
    </div>
  );
}