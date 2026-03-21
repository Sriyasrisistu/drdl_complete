import React, { useState } from "react";
import { Link } from "react-router-dom";
import ApiService from "../services/apiService";
import "./LoginForm.css";

const ROLE_CONFIG = {
  SFEED: {
    title: "SFEED Supervisor Login",
    subtitle: "Review and approve submitted safety requests",
    demoId: "sfeed01",
    alternateLabel: "GD-T&S Login",
    alternatePath: "/gdts",
  },
  GDTS: {
    title: "GD-T&S Supervisor Login",
    subtitle: "Review and approve submitted safety requests",
    demoId: "gdts01",
    alternateLabel: "SFEED Login",
    alternatePath: "/sfeed",
  },
};

export default function SupervisorLoginForm({ roleCode, onLoginSuccess }) {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const config = ROLE_CONFIG[roleCode];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await ApiService.approverLogin(loginId, password);
      if (response.success) {
        onLoginSuccess(response.approver);
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      setError("Failed to login. Please check backend connection.");
      console.error("Supervisor login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>{config.title}</h1>
        <h2>{config.subtitle}</h2>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="loginId">Login ID</label>
            <input
              type="text"
              id="loginId"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="Enter supervisor login ID"
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Signing In..." : "SIGN IN"}
          </button>
        </form>

        <div className="demo-credentials">
          <p>Demo Account</p>
          <p>Login ID: <code>{config.demoId}</code></p>
          <p>Password: <code>pass123</code></p>
        </div>

        <div className="portal-links">
          <Link to="/" className="portal-link-btn secondary-link">Employee Login</Link>
          <Link to={config.alternatePath} className="portal-link-btn">
            {config.alternateLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
