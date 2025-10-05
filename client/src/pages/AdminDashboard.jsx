import { useState } from "react";
import { createStudent, createDriver, logout } from "../api";

export default function AdminDashboard() {

 const [msg, setMsg] = useState("");

 const handleLogout = async () => {
    try {
      await logout();
      setMsg("👋 Logged out successfully");
      // optional: redirect to login page
      window.location.href = "/user/login";
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
      <h1>Admin Dashboard</h1>
      <p>{msg}</p>

      {/* Student Form */}
      <div className="form-container">
        <h2>Create Student Account</h2>
        <form onSubmit={handleStudentSubmit}>
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
            onChange={(e) => setStudent({ ...student, name: e.target.value })}
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

           {/* ✅ Logout Button */}
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Logout
      </button>
    </div>
  );
}
