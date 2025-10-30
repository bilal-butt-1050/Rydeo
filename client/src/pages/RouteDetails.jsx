import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleMap, useLoadScript, Marker, Polyline } from "@react-google-maps/api";
import { getRouteDetails } from "../api";
import "../styles/pages/RouteDetails.css";

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
};

export default function RouteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_MAPS_JS_API_KEY,
  });

  useEffect(() => {
    fetchRouteDetails();
  }, [id]);

  const fetchRouteDetails = async () => {
    try {
      const res = await getRouteDetails(id);
      setRouteData(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch route details");
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading route details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const { route, bus, driver, students } = routeData;

  // Prepare map data
  const mapCenter =
    route.stops && route.stops.length > 0
      ? {
          lat: route.stops[0].latitude,
          lng: route.stops[0].longitude,
        }
      : { lat: 31.5204, lng: 74.3587 };

  const markers = route.stops.map((stop) => ({
    position: { lat: stop.latitude, lng: stop.longitude },
    label: stop.stopName,
  }));

  const polylinePath = route.stops.map((stop) => ({
    lat: stop.latitude,
    lng: stop.longitude,
  }));

  return (
    <div className="route-details">
      <button onClick={() => navigate("/admin/dashboard")} className="back-btn">
        ← Back to Dashboard
      </button>

      <h1>{route.routeName}</h1>

      <div className="route-info-section">
        <div className="info-card">
          <h3>Route Information</h3>
          <p>
            <strong>Start Point:</strong> {route.startPoint}
          </p>
          <p>
            <strong>End Point:</strong> {route.endPoint}
          </p>
          <p>
            <strong>Total Stops:</strong> {route.stops?.length || 0}
          </p>
        </div>

        {driver && (
          <div className="info-card">
            <h3>Assigned Driver</h3>
            <p>
              <strong>Name:</strong> {driver.name}
            </p>
            <p>
              <strong>Login ID:</strong> {driver.loginID}
            </p>
            <p>
              <strong>Phone:</strong> {driver.phone}
            </p>
            {bus && (
              <p>
                <strong>Bus Number:</strong> {bus.busNumber}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Map View */}
      {isLoaded && route.stops && route.stops.length > 0 && (
        <div className="map-section">
          <h3>Route Map</h3>
          <GoogleMap
            mapContainerClassName="route-map"
            center={mapCenter}
            zoom={13}
            options={mapOptions}
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={marker.position}
                label={{
                  text: `${index + 1}`,
                  color: "white",
                  fontWeight: "bold",
                }}
              />
            ))}
            <Polyline
              path={polylinePath}
              options={{
                strokeColor: "#00e5ff",
                strokeOpacity: 0.8,
                strokeWeight: 4,
              }}
            />
          </GoogleMap>
        </div>
      )}

      {/* Stops List */}
      <div className="stops-list-section">
        <h3>All Stops</h3>
        <div className="stops-list">
          {route.stops && route.stops.length > 0 ? (
            route.stops.map((stop, index) => (
              <div key={stop._id} className="stop-card">
                <div className="stop-number">{index + 1}</div>
                <div className="stop-details">
                  <h4>{stop.stopName}</h4>
                  <p>
                    Lat: {stop.latitude.toFixed(6)}, Lng:{" "}
                    {stop.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No stops defined for this route</p>
          )}
        </div>
      </div>

      {/* Students List */}
      <div className="students-section">
        <h3>Students Using This Route</h3>
        {students && students.length > 0 ? (
          <div className="students-grid">
            {students.map((student) => (
              <div key={student._id} className="student-card">
                <h4>{student.name}</h4>
                <p>
                  <strong>Login ID:</strong> {student.loginID}
                </p>
                <p>
                  <strong>Default Stop:</strong>{" "}
                  {student.defaultStop?.stopName || "N/A"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No students assigned to this route yet</p>
        )}
      </div>
    </div>
  );
}