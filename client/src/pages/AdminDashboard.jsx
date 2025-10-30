import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStudent, createDriver, logout } from "../api";

export default function AdminDashboard() {
  const navigate = useNavigate();
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

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {msg && <p className="message">{msg}</p>}

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-cards">
          <div className="action-card" onClick={() => navigate("/admin/routes")}>
            <div className="card-icon">🗺️</div>
            <h3>Manage Routes</h3>
            <p>Create and manage bus routes and stops</p>
          </div>

          <div className="action-card">
            <div className="card-icon">👨‍🎓</div>
            <h3>Total Students</h3>
            <p>View all registered students</p>
          </div>

          <div className="action-card">
            <div className="card-icon">🚌</div>
            <h3>Total Drivers</h3>
            <p>View all registered drivers</p>
          </div>

          <div className="action-card">
            <div className="card-icon">📊</div>
            <h3>Analytics</h3>
            <p>View system statistics</p>
          </div>
        </div>
      </div>

      {/* Forms Section */}
      <div className="forms-section">
        {/* Student Form */}
        <div className="form-container">
          <h2>Create Student Account</h2>
          <form onSubmit={handleStudentSubmit}>
            <div className="form-group">
              <label>Login ID</label>
              <input
                type="text"
                placeholder="Enter unique login ID"
                value={student.loginID}
                onChange={(e) =>
                  setStudent({ ...student, loginID: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={student.password}
                onChange={(e) =>
                  setStudent({ ...student, password: e.target.value })
                }
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter student name"
                value={student.name}
                onChange={(e) => setStudent({ ...student, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Default Stop</label>
              <input
                type="text"
                placeholder="Enter default bus stop"
                value={student.defaultStop}
                onChange={(e) =>
                  setStudent({ ...student, defaultStop: e.target.value })
                }
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Create Student
            </button>
          </form>
        </div>

        {/* Driver Form */}
        <div className="form-container">
          <h2>Create Driver Account</h2>
          <form onSubmit={handleDriverSubmit}>
            <div className="form-group">
              <label>Login ID</label>
              <input
                type="text"
                placeholder="Enter unique login ID"
                value={driver.loginID}
                onChange={(e) => setDriver({ ...driver, loginID: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={driver.password}
                onChange={(e) => setDriver({ ...driver, password: e.target.value })}
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter driver name"
                value={driver.name}
                onChange={(e) => setDriver({ ...driver, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={driver.phone}
                onChange={(e) => setDriver({ ...driver, phone: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Bus ID</label>
              <input
                type="text"
                placeholder="Enter assigned bus ID"
                value={driver.bus}
                onChange={(e) => setDriver({ ...driver, bus: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Create Driver
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}