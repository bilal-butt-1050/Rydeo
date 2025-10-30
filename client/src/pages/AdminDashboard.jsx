import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStudent, createDriver, logout } from "../api";
import RouteManagement from "../components/RouteManagement";
import "../styles/pages/AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("routes");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

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

  // Student form state
  const [student, setStudent] = useState({
    loginID: "",
    password: "",
    name: "",
    defaultStop: "",
  });

  // Driver form state
  const [driver, setDriver] = useState({
    loginID: "",
    password: "",
    name: "",
    phone: "",
    bus: "",
  });

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
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>

      {msg && <div className="message">{msg}</div>}

      <div className="tabs">
        <button
          onClick={() => setActiveTab("routes")}
          className={`tab ${activeTab === "routes" ? "active" : ""}`}
        >
          🗺️ Routes
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`tab ${activeTab === "students" ? "active" : ""}`}
        >
          🎓 Students
        </button>
        <button
          onClick={() => setActiveTab("drivers")}
          className={`tab ${activeTab === "drivers" ? "active" : ""}`}
        >
          🚌 Drivers
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "routes" && <RouteManagement setMsg={setMsg} />}

        {activeTab === "students" && (
          <div className="form-section">
            <h2>Create Student Account</h2>
            <form onSubmit={handleStudentSubmit} className="dashboard-form">
              <input
                type="text"
                placeholder="Login ID"
                value={student.loginID}
                onChange={(e) =>
                  setStudent({ ...student, loginID: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={student.password}
                onChange={(e) =>
                  setStudent({ ...student, password: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Name"
                value={student.name}
                onChange={(e) =>
                  setStudent({ ...student, name: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Default Stop"
                value={student.defaultStop}
                onChange={(e) =>
                  setStudent({ ...student, defaultStop: e.target.value })
                }
                required
              />
              <button type="submit" className="submit-btn">
                Create Student
              </button>
            </form>
          </div>
        )}

        {activeTab === "drivers" && (
          <div className="form-section">
            <h2>Create Driver Account</h2>
            <form onSubmit={handleDriverSubmit} className="dashboard-form">
              <input
                type="text"
                placeholder="Login ID"
                value={driver.loginID}
                onChange={(e) =>
                  setDriver({ ...driver, loginID: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={driver.password}
                onChange={(e) =>
                  setDriver({ ...driver, password: e.target.value })
                }
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
                type="tel"
                placeholder="Phone"
                value={driver.phone}
                onChange={(e) =>
                  setDriver({ ...driver, phone: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Bus ID"
                value={driver.bus}
                onChange={(e) => setDriver({ ...driver, bus: e.target.value })}
                required
              />
              <button type="submit" className="submit-btn">
                Create Driver
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}