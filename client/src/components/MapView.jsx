import { useEffect, useRef, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const mapOptions = {
  disableDefaultUI: true, // remove all controls
  zoomControl: true,      // keep only zoom controls
};

const FALLBACK_CENTER = { lat: 31.5204, lng: 74.3587 }; // Lahore fallback

export default function MapView() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_MAPS_JS_API_KEY, 
  });

  const [currentPos, setCurrentPos] = useState(null);
  const [error, setError] = useState("");
  const mapRef = useRef(null);

  useEffect(() => {
    if (!isLoaded) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCurrentPos(coords);

          if (mapRef.current) {
            mapRef.current.panTo(coords);
            setTimeout(() => mapRef.current.setZoom(18), 300); // street view zoom after pan
          }
        },
        (err) => setError(err.message),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setError("Geolocation not supported by this browser.");
    }
  }, [isLoaded]);

  const onLoad = (map) => {
    mapRef.current = map;
  };

  const recenter = () => {
    if (mapRef.current && currentPos) {
      mapRef.current.panTo(currentPos); 
      setTimeout(() => mapRef.current.setZoom(18), 300); 
    }
  };

  if (!isLoaded) return <div className="map-fallback">Loading map…</div>;
  if (error) return <div className="map-fallback">Error: {error}</div>;

  return (
    <div className="map-shell">
      <GoogleMap
        mapContainerClassName="map-container"
        center={currentPos || FALLBACK_CENTER}
        zoom={currentPos ? 18 : 15}
        options={mapOptions}
        onLoad={onLoad}
      >
        {currentPos && <Marker position={currentPos} />}
      <button className="recenter-btn" onClick={recenter}>
        🎯 Re-center
      </button>
      </GoogleMap>


    </div>
  );
}
