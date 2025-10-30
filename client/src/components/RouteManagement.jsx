import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRoutes, deleteRoute } from "../api";
import RouteForm from "./RouteForm";
import "../styles/components/RouteManagement.css";

export default function RouteManagement({ setMsg }) {
  const [routes, setRoutes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await getAllRoutes();
      setRoutes(res.data);
      setLoading(false);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to fetch routes");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this route?")) return;

    try {
      await deleteRoute(id);
      setMsg("✅ Route deleted successfully");
      fetchRoutes();
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to delete route");
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingRoute(null);
    fetchRoutes();
  };

  const handleRouteClick = (routeId) => {
    navigate(`/admin/routes/${routeId}`);
  };

  if (loading) {
    return <div className="loading">Loading routes...</div>;
  }

  return (
    <div className="route-management">
      <div className="route-header">
        <h2>Route Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="add-route-btn"
        >
          ➕ Add New Route
        </button>
      </div>

      {showForm && (
        <RouteForm
          route={editingRoute}
          onClose={handleFormClose}
          setMsg={setMsg}
        />
      )}

      <div className="routes-grid">
        {routes.length === 0 ? (
          <p className="no-routes">No routes found. Create your first route!</p>
        ) : (
          routes.map((route) => (
            <div key={route._id} className="route-card">
              <div 
                className="route-card-content"
                onClick={() => handleRouteClick(route._id)}
              >
                <h3>{route.routeName}</h3>
                <div className="route-info">
                  <p>
                    <span className="label">Start:</span> {route.startPoint}
                  </p>
                  <p>
                    <span className="label">End:</span> {route.endPoint}
                  </p>
                  <p>
                    <span className="label">Stops:</span>{" "}
                    {route.stops?.length || 0}
                  </p>
                </div>
              </div>
              <div className="route-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(route);
                  }}
                  className="edit-btn"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(route._id);
                  }}
                  className="delete-btn"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}