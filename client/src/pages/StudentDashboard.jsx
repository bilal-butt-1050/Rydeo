import { useState, useEffect } from "react";
import { getStudentProfile, logout } from "../api";
import "../styles/pages/StudentDashboard.css";

export default function StudentDashboard() {
  const [msg, setMsg] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getStudentProfile();
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

  if (loading) {
    return <div className="student-dashboard">Loading...</div>;
  }

  return (
    <div className="student-dashboard">
      <h1>Student Dashboard</h1>
      
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
            <span className="info-label">Default Stop:</span>
            <span className="info-value">{profile?.defaultStop || "Not set"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Role:</span>
            <span className="info-value">Student</span>
          </div>
        </div>
      </div>

      {/* Bus Tracking Section */}
      <div className="tracking-section">
        <h2>Bus Tracking</h2>
        <div className="eta-info">
          <div className="eta-time">15 mins</div>
          <div className="eta-label">Estimated Time of Arrival</div>
        </div>
      </div>

      <div className="logout-section">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}