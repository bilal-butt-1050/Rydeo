import { useState, useEffect } from "react";
import { logout } from "../api";
import MapView from "../components/MapView";
import { io } from "socket.io-client";

export default function DriverDashboard() {
  const [msg, setMsg] = useState("");
  const [socket, setSocket] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    // Connect to Socket.IO
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
      newSocket.emit("join-driver");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    let watchId;

    if (isSharing && socket) {
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: new Date().toISOString(),
            };
            
            setCurrentLocation(location);
            socket.emit("driver-location-update", location);
          },
          (error) => {
            console.error("Geolocation error:", error);
            setMsg("Error getting location: " + error.message);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 5000,
            timeout: 10000,
          }
        );
      } else {
        setMsg("Geolocation not supported");
        setIsSharing(false);
      }
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isSharing, socket]);

  const toggleLocationSharing = () => {
    setIsSharing(!isSharing);
    setMsg(isSharing ? "Location sharing stopped" : "Location sharing started");
  };

  const handleLogout = async () => {
    try {
      if (socket) {
        socket.emit("driver-offline");
        socket.disconnect();
      }
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
        <h1>Driver Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {msg && <p className="message">{msg}</p>}

      <div className="dashboard-content">
        <div className="info-panel">
          <h2>Location Sharing</h2>
          
          <div className="control-panel">
            <button 
              onClick={toggleLocationSharing}
              className={`share-btn ${isSharing ? 'active' : ''}`}
            >
              {isSharing ? '⏹ Stop Sharing' : '▶ Start Sharing'}
            </button>
            
            <div className="status-indicator">
              <span className={`status-dot ${isSharing ? 'active' : ''}`}></span>
              {isSharing ? 'Sharing Location' : 'Not Sharing'}
            </div>
          </div>

          {currentLocation && (
            <div className="location-info">
              <h3>Current Position</h3>
              <p>Lat: {currentLocation.latitude.toFixed(6)}</p>
              <p>Lng: {currentLocation.longitude.toFixed(6)}</p>
              <p className="timestamp">
                Updated: {new Date(currentLocation.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>

        <div className="map-section">
          <MapView 
            buses={currentLocation ? [{
              busId: 'current',
              busNumber: 'Your Bus',
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }] : []}
            currentUserLocation={currentLocation ? {
              lat: currentLocation.latitude,
              lng: currentLocation.longitude
            } : null}
            showUserLocation={true}
          />
        </div>
      </div>
    </div>
  );
}