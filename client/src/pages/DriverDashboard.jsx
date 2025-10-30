import { useState, useEffect } from "react";
import { getDriverProfile, logout } from "../api";


export default function DriverDashboard() {
  const [msg, setMsg] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getDriverProfile();
      setProfile(res.data);
      setLoading(false);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to load profile");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setMsg("👋 Logged out successfully");
      setTimeout(() => {
        window.location.href = "/user/login";
      }, 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to log out");
    }
  };

  const handleStartTracking = () => {
    setIsTracking(true);
    setMsg("✅ Location tracking started");
    // TODO: Implement actual location tracking
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    setMsg("🛑 Location tracking stopped");
    // TODO: Stop location tracking
  };

  if (loading) {
    return <div className="driver-dashboard">Loading...</div>;
  }

  return (
    <div className="driver-dashboard">
      <h1>Driver Dashboard</h1>
      
      {msg && <p className={msg.includes("✅") || msg.includes("👋") ? "success-msg" : "error-msg"}>{msg}</p>}

      {/* Profile Section */}
      <div className="profile-section">
        <h2>My Profile</h2>
        <div className="profile-info">
          <div className="info-item">
            <span className="info-label">Name:</span>
            <span className="info-value">{profile?.name || "Not available"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Login ID:</span>
            <span className="info-value">{profile?.loginID || "Not available"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Phone:</span>
            <span className="info-value">{profile?.phone || "Not available"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Bus ID:</span>
            <span className="info-value">{profile?.bus || "Not assigned"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Role:</span>
            <span className="info-value">Driver</span>
          </div>
        </div>
      </div>

      {/* Route Information */}
      <div className="route-section">
        <h2>Current Route</h2>
        <div className="route-info">
          <div className="route-detail">
            <span className="route-label">Route Name:</span>
            <span className="route-value">Main Campus Route</span>
          </div>
          <div className="route-detail">
            <span className="route-label">Start Point:</span>
            <span className="route-value">Campus Gate</span>
          </div>
          <div className="route-detail">
            <span className="route-label">End Point:</span>
            <span className="route-value">City Center</span>
          </div>
          <div className="route-detail">
            <span className="route-label">Total Stops:</span>
            <span className="route-value">8</span>
          </div>
        </div>
      </div>

      {/* Status Section */}
      <div className="status-section">
        <h2>Tracking Status</h2>
        <div className={`status-indicator ${isTracking ? "status-active" : "status-inactive"}`}>
          <span className={`status-dot ${isTracking ? "active" : "inactive"}`}></span>
          {isTracking ? "Tracking Active" : "Tracking Inactive"}
        </div>
      </div>

      {/* Tracking Controls */}
      <div className="tracking-controls">
        {!isTracking ? (
          <button onClick={handleStartTracking} className="start-tracking-btn">
            Start Tracking
          </button>
        ) : (
          <button onClick={handleStopTracking} className="stop-tracking-btn">
            Stop Tracking
          </button>
        )}
      </div>

      <div className="logout-section">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}