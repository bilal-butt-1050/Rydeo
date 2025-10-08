import { useState, useEffect } from "react";
import { createStudent, createDriver, logout } from "../api";
import MapView from "../components/MapView";
import { io } from "socket.io-client";

export default function AdminDashboard() {
  const [msg, setMsg] = useState("");
  const [buses, setBuses] = useState([]);
  const [socket, setSocket] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // States for student form
  const [student, setStudent] = useState({
    loginID: "",
    password: "",
    name: "",
    defaultStop: "",
  });

  // States for driver form
  const [driver, setDriver] = useState({
    loginID: "",
    password: "",
    name: "",
    phone: "",
    bus: "",
  });

  useEffect(() => {
    // Connect to Socket.IO
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
      newSocket.emit("join-admin");
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

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createStudent(student);
      setMsg(`✅ Student ${res.data.student.name} created successfully!`);
      setStudent({ loginID: "", password: "", name: "", defaultStop: "" });
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to create student");
    }
  };

  const handleDriverSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createDriver(driver);
      setMsg(`✅ Driver ${res.data.driver.name} created successfully!`);
      setDriver({ loginID: "", password: "", name: "", phone: "", bus: "" });
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to create driver");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {msg && <p className="message">{msg}</p>}

      <div className="admin-tabs">
        <button 
          className={activeTab === 'overview' ? 'tab-active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'students' ? 'tab-active' : ''}
          onClick={() => setActiveTab('students')}
        >
          Students
        </button>
        <button 
          className={activeTab === 'drivers' ? 'tab-active' : ''}
          onClick={() => setActiveTab('drivers')}
        >
          Drivers
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <>
            <div className="info-panel">
              <h2>System Overview</h2>
              <div className="stats">
                <div className="stat-card">
                  <h3>{buses.length}</h3>
                  <p>Active Buses</p>
                </div>
              </div>
              
              <div className="bus-list">
                <h3>Live Bus Tracking</h3>
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
              <MapView buses={buses} showUserLocation={false} />
            </div>
          </>
        )}

        {activeTab === 'students' && (
          <div className="form-container">
            <h2>Create Student Account</h2>
            <form onSubmit={handleStudentSubmit}>
              <input
                type="text"
                placeholder="Login ID"
                value={student.loginID}
                onChange={(e) => setStudent({ ...student, loginID: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={student.password}
                onChange={(e) => setStudent({ ...student, password: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Name"
                value={student.name}
                onChange={(e) => setStudent({ ...student, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Default Stop"
                value={student.defaultStop}
                onChange={(e) => setStudent({ ...student, defaultStop: e.target.value })}
                required
              />
              <button type="submit">Create Student</button>
            </form>
          </div>
        )}

        {activeTab === 'drivers' && (
          <div className="form-container">
            <h2>Create Driver Account</h2>
            <form onSubmit={handleDriverSubmit}>
              <input
                type="text"
                placeholder="Login ID"
                value={driver.loginID}
                onChange={(e) => setDriver({ ...driver, loginID: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={driver.password}
                onChange={(e) => setDriver({ ...driver, password: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Name"
                value={driver.name}
                onChange={(e) => setDriver({ ...driver, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={driver.phone}
                onChange={(e) => setDriver({ ...driver, phone: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Bus ID"
                value={driver.bus}
                onChange={(e) => setDriver({ ...driver, bus: e.target.value })}
                required
              />
              <button type="submit">Create Driver</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}