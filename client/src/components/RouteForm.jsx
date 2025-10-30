import { useState, useEffect } from "react";
import { createRoute, updateRoute } from "../api";
import "../styles/components/RouteForm.css";

export default function RouteForm({ route, onClose, setMsg }) {
  const [routeName, setRouteName] = useState("");
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [stops, setStops] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (route) {
      setRouteName(route.routeName);
      setStartPoint(route.startPoint);
      setEndPoint(route.endPoint);
      setStops(route.stops || []);
    }
  }, [route]);

  const handleAddStop = () => {
    setStops([
      ...stops,
      { stopName: "", latitude: "", longitude: "" },
    ]);
  };

  const handleRemoveStop = (index) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleStopChange = (index, field, value) => {
    const updatedStops = [...stops];
    updatedStops[index][field] = value;
    setStops(updatedStops);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const routeData = {
      routeName,
      startPoint,
      endPoint,
      stops: stops.map(stop => ({
        stopName: stop.stopName,
        latitude: parseFloat(stop.latitude),
        longitude: parseFloat(stop.longitude),
      })),
    };

    try {
      if (route) {
        await updateRoute(route._id, routeData);
        setMsg("✅ Route updated successfully");
      } else {
        await createRoute(routeData);
        setMsg("✅ Route created successfully");
      }
      onClose();
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to save route");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="route-form-overlay">
      <div className="route-form-container">
        <div className="route-form-header">
          <h2>{route ? "Edit Route" : "Create New Route"}</h2>
          <button onClick={onClose} className="close-btn">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="route-form">
          <div className="form-group">
            <label>Route Name *</label>
            <input
              type="text"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              placeholder="e.g., Route A"
              required
            />
          </div>

          <div className="form-group">
            <label>Start Point *</label>
            <input
              type="text"
              value={startPoint}
              onChange={(e) => setStartPoint(e.target.value)}
              placeholder="e.g., Main Gate"
              required
            />
          </div>

          <div className="form-group">
            <label>End Point *</label>
            <input
              type="text"
              value={endPoint}
              onChange={(e) => setEndPoint(e.target.value)}
              placeholder="e.g., University Campus"
              required
            />
          </div>

          <div className="stops-section">
            <div className="stops-header">
              <h3>Stops</h3>
              <button
                type="button"
                onClick={handleAddStop}
                className="add-stop-btn"
              >
                ➕ Add Stop
              </button>
            </div>

            {stops.map((stop, index) => (
              <div key={index} className="stop-item">
                <div className="stop-number">{index + 1}</div>
                <div className="stop-fields">
                  <input
                    type="text"
                    placeholder="Stop Name"
                    value={stop.stopName}
                    onChange={(e) =>
                      handleStopChange(index, "stopName", e.target.value)
                    }
                    required
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={stop.latitude}
                    onChange={(e) =>
                      handleStopChange(index, "latitude", e.target.value)
                    }
                    required
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={stop.longitude}
                    onChange={(e) =>
                      handleStopChange(index, "longitude", e.target.value)
                    }
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveStop(index)}
                  className="remove-stop-btn"
                >
                  🗑️
                </button>
              </div>
            ))}

            {stops.length === 0 && (
              <p className="no-stops">No stops added yet</p>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-btn"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : route
                ? "Update Route"
                : "Create Route"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}