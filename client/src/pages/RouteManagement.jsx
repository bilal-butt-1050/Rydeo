import { useState, useEffect } from "react";
import PlaceSearch from "../components/PlaceSearch";
import RouteMap from "../components/RouteMap";
import { createRoute, getAllRoutes, deleteRoute } from "../api";

export default function RouteManagement() {
  const [routeName, setRouteName] = useState("");
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [stops, setStops] = useState([]);
  const [msg, setMsg] = useState("");
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await getAllRoutes();
      setRoutes(res.data);
    } catch (err) {
      console.error("Failed to fetch routes:", err);
    }
  };

  const handleSelectStartPoint = (place) => {
    setStartPoint(place);
    setMsg(`Start point set: ${place.address}`);
  };

  const handleSelectEndPoint = (place) => {
    setEndPoint(place);
    setMsg(`End point set: ${place.address}`);
  };

  const handleAddStop = (place) => {
    setStops([...stops, { ...place, order: stops.length }]);
    setMsg(`Stop added: ${place.address}`);
  };

  const handleRemoveStop = (index) => {
    setStops(stops.filter((_, i) => i !== index));
    setMsg("Stop removed");
  };

  const handleCreateRoute = async (e) => {
    e.preventDefault();

    if (!routeName || !startPoint || !endPoint) {
      setMsg("❌ Please provide route name, start point, and end point");
      return;
    }

    try {
      const routeData = {
        routeName,
        startPoint: startPoint.address,
        endPoint: endPoint.address,
        stops: [
          {
            stopName: `Start: ${startPoint.name || startPoint.address}`,
            address: startPoint.address,
            latitude: startPoint.lat,
            longitude: startPoint.lon,
            order: 0,
          },
          ...stops.map((stop, index) => ({
            stopName: stop.name || stop.address,
            address: stop.address,
            latitude: stop.lat,
            longitude: stop.lon,
            order: index + 1,
          })),
          {
            stopName: `End: ${endPoint.name || endPoint.address}`,
            address: endPoint.address,
            latitude: endPoint.lat,
            longitude: endPoint.lon,
            order: stops.length + 1,
          },
        ],
      };

      const res = await createRoute(routeData);
      setMsg(`✅ Route "${routeName}" created successfully!`);
      
      // Reset form
      setRouteName("");
      setStartPoint(null);
      setEndPoint(null);
      setStops([]);
      
      // Refresh routes list
      fetchRoutes();
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Failed to create route");
    }
  };

  const handleDeleteRoute = async (routeId) => {
    if (!window.confirm("Are you sure you want to delete this route?")) return;

    try {
      await deleteRoute(routeId);
      setMsg("✅ Route deleted successfully");
      fetchRoutes();
      if (selectedRoute?._id === routeId) {
        setSelectedRoute(null);
      }
    } catch (err) {
      setMsg("❌ Failed to delete route");
    }
  };

  const handleViewRoute = (route) => {
    setSelectedRoute(route);
    setMsg(`Viewing route: ${route.routeName}`);
  };

  return (
    <div className="route-management">
      <h1>Route Management</h1>
      {msg && <p className="message">{msg}</p>}

      <div className="route-layout">
        {/* Left side - Form */}
        <div className="route-form-section">
          <h2>Create New Route</h2>
          <form onSubmit={handleCreateRoute}>
            <div className="form-group">
              <label>Route Name</label>
              <input
                type="text"
                placeholder="e.g., Route A - City Center to University"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Start Point</label>
              <PlaceSearch
                placeholder="Search for starting location..."
                onSelectPlace={handleSelectStartPoint}
              />
              {startPoint && (
                <div className="selected-place">
                  ✓ {startPoint.address}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Intermediate Stops (Optional)</label>
              <PlaceSearch
                placeholder="Search and add stops along the route..."
                onSelectPlace={handleAddStop}
              />
              {stops.length > 0 && (
                <div className="stops-list">
                  {stops.map((stop, index) => (
                    <div key={index} className="stop-item">
                      <span>
                        {index + 1}. {stop.address}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStop(index)}
                        className="remove-btn"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>End Point</label>
              <PlaceSearch
                placeholder="Search for ending location..."
                onSelectPlace={handleSelectEndPoint}
              />
              {endPoint && (
                <div className="selected-place">
                  ✓ {endPoint.address}
                </div>
              )}
            </div>

            <button type="submit" className="create-btn">
              Create Route
            </button>
          </form>

          {/* Existing Routes List */}
          <div className="existing-routes">
            <h3>Existing Routes</h3>
            {routes.length === 0 ? (
              <p>No routes created yet</p>
            ) : (
              <ul>
                {routes.map((route) => (
                  <li key={route._id} className="route-item">
                    <div>
                      <strong>{route.routeName}</strong>
                      <br />
                      <small>
                        {route.stops?.length || 0} stops
                      </small>
                    </div>
                    <div className="route-actions">
                      <button onClick={() => handleViewRoute(route)}>
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteRoute(route._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right side - Map */}
        <div className="route-map-section">
          <RouteMap
            startPoint={startPoint}
            endPoint={endPoint}
            stops={stops}
            selectedRoute={selectedRoute}
          />
        </div>
      </div>
    </div>
  );
}