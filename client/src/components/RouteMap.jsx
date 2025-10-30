import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const FALLBACK_CENTER = [31.5204, 74.3587]; // Lahore

export default function RouteMap({ startPoint, endPoint, stops, selectedRoute }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const routeLayerRef = useRef(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView(FALLBACK_CENTER, 13);
    mapRef.current = map;

    // Add Geoapify tile layer
    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    const isRetina = window.devicePixelRatio > 1;
    const baseUrl = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`;
    const retinaUrl = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey=${apiKey}`;

    L.tileLayer(isRetina ? retinaUrl : baseUrl, {
      attribution:
        'Powered by <a href="https://www.geoapify.com/">Geoapify</a> | © OpenStreetMap contributors',
      maxZoom: 20,
    }).addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Clear markers and route
  const clearMap = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }
  };

  // Calculate and display route
  const calculateRoute = async (waypoints) => {
    if (!mapRef.current || waypoints.length < 2) return;

    setIsCalculating(true);

    try {
      const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
      const waypointsStr = waypoints
        .map((wp) => `${wp.lat},${wp.lon}`)
        .join("|");

      const response = await fetch(
        `https://api.geoapify.com/v1/routing?waypoints=${waypointsStr}&mode=drive&apiKey=${apiKey}`
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        // Add route to map
        const routeGeoJSON = L.geoJSON(data, {
          style: {
            color: "#4285f4",
            weight: 5,
            opacity: 0.8,
          },
        }).addTo(mapRef.current);

        routeLayerRef.current = routeGeoJSON;

        // Fit map to route bounds
        const bounds = routeGeoJSON.getBounds();
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    } catch (error) {
      console.error("Error calculating route:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Update map when points change
  useEffect(() => {
    if (!mapRef.current) return;

    clearMap();

    const allPoints = [];

    // Add start point marker
    if (startPoint) {
      const marker = L.marker([startPoint.lat, startPoint.lon], {
        title: "Start",
      })
        .addTo(mapRef.current)
        .bindPopup(`<strong>Start:</strong><br/>${startPoint.address}`);

      const greenIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      
      marker.setIcon(greenIcon);
      markersRef.current.push(marker);
      allPoints.push(startPoint);
    }

    // Add intermediate stop markers
    stops.forEach((stop, index) => {
      const marker = L.marker([stop.lat, stop.lon], {
        title: `Stop ${index + 1}`,
      })
        .addTo(mapRef.current)
        .bindPopup(`<strong>Stop ${index + 1}:</strong><br/>${stop.address}`);

      markersRef.current.push(marker);
      allPoints.push(stop);
    });

    // Add end point marker
    if (endPoint) {
      const marker = L.marker([endPoint.lat, endPoint.lon], {
        title: "End",
      })
        .addTo(mapRef.current)
        .bindPopup(`<strong>End:</strong><br/>${endPoint.address}`);

      const redIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      
      marker.setIcon(redIcon);
      markersRef.current.push(marker);
      allPoints.push(endPoint);
    }

    // Calculate route if we have at least start and end points
    if (allPoints.length >= 2) {
      calculateRoute(allPoints);
    } else if (allPoints.length === 1) {
      // Just center on the single point
      mapRef.current.setView([allPoints[0].lat, allPoints[0].lon], 15);
    }
  }, [startPoint, endPoint, stops]);

  // Display selected route from database
  useEffect(() => {
    if (!mapRef.current || !selectedRoute) return;

    clearMap();

    if (selectedRoute.stops && selectedRoute.stops.length > 0) {
      const sortedStops = [...selectedRoute.stops].sort((a, b) => a.order - b.order);
      
      sortedStops.forEach((stop, index) => {
        const isFirst = index === 0;
        const isLast = index === sortedStops.length - 1;
        
        const marker = L.marker([stop.latitude, stop.longitude])
          .addTo(mapRef.current)
          .bindPopup(`<strong>${stop.stopName}</strong><br/>${stop.address}`);

        // Color code: green for start, red for end, blue for intermediate
        if (isFirst) {
          const greenIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          marker.setIcon(greenIcon);
        } else if (isLast) {
          const redIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          marker.setIcon(redIcon);
        }

        markersRef.current.push(marker);
      });

      // Calculate route
      const waypoints = sortedStops.map(stop => ({
        lat: stop.latitude,
        lon: stop.longitude,
      }));
      calculateRoute(waypoints);
    }
  }, [selectedRoute]);

  return (
    <div className="route-map-container">
      {isCalculating && <div className="calculating-overlay">Calculating route...</div>}
      <div ref={mapContainerRef} className="route-map" />
      {!startPoint && !endPoint && !selectedRoute && (
        <div className="map-placeholder">
          Add start and end points to visualize the route
        </div>
      )}
    </div>
  );
}