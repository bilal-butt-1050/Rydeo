import { useState } from "react";
import { createStudent, createDriver, createRoute, logout } from "../api";
import "../styles/pages/AdminDashboard.css";

export default function AdminDashboard() {
  const [msg, setMsg] = useState("");

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

  // States for route form
  const [route, setRoute] = useState({
    routeName: "",
    startPoint: "",
    endPoint: "",
    stops: [{ stopName: "", latitude: "", longitude: "" }],
  });

  // Handle Student Form Submission
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

  // Handle Driver Form Submission
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

  // Handle Route Form Submission
  const handleRouteSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate stops have all required fields
      const validStops = route.stops.filter(
        (stop) => stop.stopName && stop.latitude && stop.longitude
      );

      if (validStops.length === 0) {
        setMsg("❌ Please add at least one complete stop");
        return;
      }

      const routeData = {
        routeName: route.routeName,
        startPoint: route.startPoint,
        endPoint: route.endPoint,
        stops: validStops,
      };

      const res = await createRoute(routeData);
      setMsg(`✅ Route ${res.data.route.routeName} created successfully with ${validStops.length} stops!`);
      setRoute({
        routeName: "",
        startPoint: "",
        endPoint: "",
        stops: [{ stopName: "", latitude: "", longitude: "" }],
      });
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to create route");
    }
  };

  // Add a new stop field
  const addStop = () => {
    setRoute({
      ...route,
      stops: [...route.stops, { stopName: "", latitude: "", longitude: "" }],
    });
  };

  // Remove a stop field
  const removeStop = (index) => {
    const newStops = route.stops.filter((_, i) => i !== index);
    setRoute({ ...route, stops: newStops });
  };

  // Update a specific stop field
  const updateStop = (index, field, value) => {
    const newStops = [...route.stops];
    newStops[index][field] = value;
    setRoute({ ...route, stops: newStops });
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {msg && <p className={msg.includes("✅") ? "success-msg" : "error-msg"}>{msg}</p>}

      <div className="dashboard-grid">
        {/* Student Form */}
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
              minLength="6"
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

        {/* Driver Form */}
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
              minLength="6"
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

        {/* Route Form */}
        <div className="form-container" style={{ gridColumn: "1 / -1" }}>
          <h2>Create Route</h2>
          <form onSubmit={handleRouteSubmit}>
            <input
              type="text"
              placeholder="Route Name"
              value={route.routeName}
              onChange={(e) => setRoute({ ...route, routeName: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Start Point"
              value={route.startPoint}
              onChange={(e) => setRoute({ ...route, startPoint: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="End Point"
              value={route.endPoint}
              onChange={(e) => setRoute({ ...route, endPoint: e.target.value })}
              required
            />

            <div className="stops-container">
              <h3>Stops</h3>
              {route.stops.map((stop, index) => (
                <div key={index} className="stop-item">
                  <div className="stop-inputs">
                    <input
                      type="text"
                      placeholder="Stop Name"
                      value={stop.stopName}
                      onChange={(e) => updateStop(index, "stopName", e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      step="any"
                      placeholder="Latitude"
                      value={stop.latitude}
                      onChange={(e) => updateStop(index, "latitude", e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      step="any"
                      placeholder="Longitude"
                      value={stop.longitude}
                      onChange={(e) => updateStop(index, "longitude", e.target.value)}
                      required
                    />
                  </div>
                  {route.stops.length > 1 && (
                    <button
                      type="button"
                      className="remove-stop-btn"
                      onClick={() => removeStop(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="add-stop-btn" onClick={addStop}>
                + Add Stop
              </button>
            </div>

            <button type="submit">Create Route</button>
          </form>
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