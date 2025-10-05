import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api";

export default function Login({ onLogin }) {
  const [loginID, setLoginID] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

    try {
      const res = await login(loginID, password);
      setMsg(`Welcome ${res.data.name} (${res.data.role})`);

      // Call the onLogin callback to update auth state in App.js
      if (onLogin) {
        onLogin();
      }

      // role-based redirect
      if (res.data.role === "admin") {
        navigate("/admin/dashboard");
      } else if (res.data.role === "student") {
        navigate("/student/profile");
      } else if (res.data.role === "driver") {
        navigate("/driver/profile");
      } else {
        setMsg("Unknown role, contact admin");
      }

    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed");
      // Clear password field on error
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="login-hero">
      <div className="login-container">
        <p>Login to your account</p>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            name="loginID"
            placeholder="Enter Login ID"
            value={loginID}
            onChange={(e) => setLoginID(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            required
            minLength="6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>
        {msg && <p className={msg.includes("Welcome") ? "success-msg" : "error-msg"}>{msg}</p>}
      </div>
    </section>
  );
}