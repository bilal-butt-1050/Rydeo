import { useState, useEffect } from "react";
import { 
  createStudent, 
  createDriver, 
  createRoute,
  getAllRoutes,
  updateRoute,
  deleteRoute,
  logout 
} from "../api";

export default function AdminDashboard() {
  const [msg, setMsg] = useState("");
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isEditingRoute, setIsEditingRoute] = useState(false);

  // States for route form
  const [route, setRoute] = useState({
    routeName: "",
    busNumber: "",
    startPoint: "",
    endPoint: "",
  });

  // States for student form
  const [student, setStudent] = useState({
    loginID: "",
    password: "",
    name: "",
    defaultStop: "",
    route: "",
  });

  // States for driver form
  const [driver, setDriver] = useState({
    loginID: "",
    password: "",
    name: "",
    phone: "",
    route: "",
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await getAllRoutes();
      setRoutes(res.data);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to fetch routes");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setMsg("👋 Logged out successfully");
      window.location.href = "/user/login";
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to log out");
    }
  };

  // Handle Route Form Submission
  const handleRouteSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditingRoute && selectedRoute) {
        await updateRoute(selectedRoute._id, route);
        setMsg(`✅ Route ${route.routeName} updated successfully!`);
        setIsEditingRoute(false);
        setSelectedRoute(null);
      } else {
        const res = await createRoute(route);
        setMsg(`✅ Route ${res.data.route.routeName} created successfully!`);
      }
      setRoute({ routeName: "", busNumber: "", startPoint: "", endPoint: "" });
      fetchRoutes();
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to save route");
    }
  };

  // Handle Route Edit
  const handleEditRoute = (routeData) => {
    setIsEditingRoute(true);
    setSelectedRoute(routeData);
    setRoute({
      routeName: routeData.routeName,
      busNumber: routeData.busNumber,
      startPoint: routeData.startPoint,
      endPoint: routeData.endPoint,
    });
  };

  // Handle Route Delete
  const handleDeleteRoute = async (routeId) => {
    if (!window.confirm("Are you sure you want to delete this route?")) return;
    
    try {
      await deleteRoute(routeId);
      setMsg("✅ Route deleted successfully!");
      fetchRoutes();
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to delete route");
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setIsEditingRoute(false);
    setSelectedRoute(null);
    setRoute({ routeName: "", busNumber: "", startPoint: "", endPoint: "" });
  };

  // Handle Student Form Submission
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createStudent(student);
      setMsg(`✅ Student ${res.data.student.name} created successfully!`);
      setStudent({ loginID: "", password: "", name: "", defaultStop: "", route: "" });
      fetchRoutes(); // Refresh to show new student in route
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
      setDriver({ loginID: "", password: "", name: "", phone: "", route: "" });
      fetchRoutes(); // Refresh to show new driver in route
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to create driver");
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {msg && <p className="message">{msg}</p>}

      {/* Route Management Section */}
      <div className="form-container">
        <h2>{isEditingRoute ? "Edit Route" : "Create Route"}</h2>
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
            placeholder="Bus Number"
            value={route.busNumber}
            onChange={(e) => setRoute({ ...route, busNumber: e.target.value })}
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
          <button type="submit">
            {isEditingRoute ? "Update Route" : "Create Route"}
          </button>
          {isEditingRoute && (
            <button type="button" onClick={cancelEdit}>Cancel</button>
          )}
        </form>
      </div>

      {/* Routes List */}
      <div className="routes-section">
        <h2>All Routes</h2>
        {routes.length === 0 ? (
          <p>No routes created yet.</p>
        ) : (
          routes.map((r) => (
            <div key={r._id} className="route-card">
              <div className="route-header">
                <h3>{r.routeName} - Bus #{r.busNumber}</h3>
                <div className="route-actions">
                  <button onClick={() => handleEditRoute(r)}>Edit</button>
                  <button onClick={() => handleDeleteRoute(r._id)}>Delete</button>
                </div>
              </div>
              <p><strong>Route:</strong> {r.startPoint} → {r.endPoint}</p>
              
              {/* Driver Info */}
              <div className="route-driver">
                <h4>Driver:</h4>
                {r.driver ? (
                  <div className="profile-card">
                    <p><strong>Name:</strong> {r.driver.name}</p>
                    <p><strong>Login ID:</strong> {r.driver.loginID}</p>
                    <p><strong>Phone:</strong> {r.driver.phone}</p>
                  </div>
                ) : (
                  <p>No driver assigned</p>
                )}
              </div>

              {/* Students Info */}
              <div className="route-students">
                <h4>Students ({r.students?.length || 0}):</h4>
                {r.students && r.students.length > 0 ? (
                  <div className="students-list">
                    {r.students.map((s) => (
                      <div key={s._id} className="profile-card">
                        <p><strong>Name:</strong> {s.name}</p>
                        <p><strong>Login ID:</strong> {s.loginID}</p>
                        <p><strong>Default Stop:</strong> {s.defaultStop?.stopName || "Not set"}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No students assigned</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

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
          />
          <input
            type="text"
            placeholder="Name"
            value={student.name}
            onChange={(e) => setStudent({ ...student, name: e.target.value })}
            required
          />
          <select
            value={student.route}
            onChange={(e) => setStudent({ ...student, route: e.target.value })}
            required
          >
            <option value="">Select Route</option>
            {routes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.routeName} - Bus #{r.busNumber}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Default Stop ID (optional)"
            value={student.defaultStop}
            onChange={(e) => setStudent({ ...student, defaultStop: e.target.value })}
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
          <select
            value={driver.route}
            onChange={(e) => setDriver({ ...driver, route: e.target.value })}
            required
          >
            <option value="">Select Route</option>
            {routes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.routeName} - Bus #{r.busNumber}
              </option>
            ))}
          </select>
          <button type="submit">Create Driver</button>
        </form>
      </div>

      <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        Logout
      </button>
    </div>
  );
}