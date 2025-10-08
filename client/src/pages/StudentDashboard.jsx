import { useState, useEffect } from "react";
import { logout } from "../api";
import MapView from "../components/MapView";
import { io } from "socket.io-client";

export default function StudentDashboard() {
  const [msg, setMsg] = useState("");
  const [buses, setBuses] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to Socket.IO
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
      newSocket.emit("join-student");
    });

    newSocket.on("bus-location-update", (data) => {
      setBuses(prevBuses => {
        const index = prevBuses.findIndex(b => b.busId === data.busId);
        if (index !== -1) {
          const updated = [...prevBuses];
          updated[index] = { ...updated[index], ...data };
          return updated;
        }
        return [...prevBuses, data];
      });
    });

    newSocket.on("all-buses", (busData) => {
      setBuses(busData);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setMsg("👋 Logged out successfully");
      window.location.href = "/user/login";
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to log out");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {msg && <p className="message">{msg}</p>}

      <div className="dashboard-content">
        <div className="info-panel">
          <h2>Live Bus Tracking</h2>
          <p>Track your buses in real-time</p>
          
          <div className="bus-list">
            <h3>Active Buses ({buses.length})</h3>
            {buses.map((bus, index) => (
              <div key={bus.busId || index} className="bus-item">
                <strong>{bus.busNumber || `Bus ${index + 1}`}</strong>
                <p>Driver: {bus.driver || 'N/A'}</p>
                <p className="bus-status">● Online</p>
              </div>
            ))}
          </div>
        </div>

        <div className="map-section">
          <MapView buses={buses} showUserLocation={true} />
        </div>
      </div>
    </div>
  );
}