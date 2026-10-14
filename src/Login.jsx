import { useState } from "react";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Login({ onBack, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      setMessage("Login successful! Welcome to RoadWatch AI.");

      // Save token and user info for this browser tab.
      if (data.token) {
        sessionStorage.setItem("roadwatchToken", data.token);
      }
      if (data.user) {
        sessionStorage.setItem("roadwatchUser", JSON.stringify(data.user));
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      }
    } catch (error) {
      setMessage(
        error.message === "Failed to fetch"
          ? "Cannot connect to the server. Check that your backend is running."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <button type="button" className="login-back" onClick={onBack}>
        ← Back to Home
      </button>

      <div className="login-card">
        <div className="login-logo">🛣️</div>
        <h1>Welcome Back</h1>

        <p className="login-subtitle">
          Sign in to your RoadWatch AI account
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {message && (
            <p className="login-message" role="status">
              {message}
            </p>
          )}
        </form>

        <p className="login-note">
          You need to register an account before logging in.
        </p>
      </div>
    </div>
  );
}

export default Login;
