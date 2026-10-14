
import { useState } from "react";
import "./App.css";
import Report from "./Report.jsx";
import Reports from "./Reports.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

function getStoredUser() {
  try {
    const stored = sessionStorage.getItem("roadwatchUser");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(getStoredUser);

  function handleLoginSuccess(userData) {
    setUser(userData);
    setPage("home");
  }

  function handleLogout() {
    sessionStorage.removeItem("roadwatchToken");
    sessionStorage.removeItem("roadwatchUser");
    setUser(null);
    setPage("home");
  }

  if (page === "login") {
    return (
      <Login
        onBack={() => setPage("home")}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (page === "register") {
    return (
      <Register
        onBack={() => setPage("home")}
        onLogin={() => setPage("login")}
      />
    );
  }

  if (page === "report") {
    return <Report onBack={() => setPage("home")} />;
  }

  if (page === "reports") {
    return <Reports onBack={() => setPage("home")} />;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">🛣️ RoadWatch AI</div>

        <div className="nav-links">
          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={() => setPage("reports")}>Reports</button>
          {user ? (
            <>
              <span className="user-greeting">👤 {user.name}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setPage("login")}>Login</button>
              <button onClick={() => setPage("register")}>Register</button>
            </>
          )}
        </div>
      </nav>

      <header className="hero">
        <h1>Smarter Roads, Safer Journeys</h1>
        <p>
          RoadWatch AI helps people report road damage
          and build safer roads through technology.
        </p>
        <button
          className="login-submit"
          onClick={() => setPage("report")}
        >
          Report Road Damage
        </button>
      </header>

      <section className="features">
        <h2>How RoadWatch AI Helps</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>📸 Report Road Damage</h3>
            <p>Submit road damage reports with photos and location information.</p>
          </div>

          <div className="feature-card">
            <h3>📍 Location Tracking</h3>
            <p>Identify road problems using GPS coordinates.</p>
          </div>

          <div className="feature-card">
            <h3>📋 View Reports</h3>
            <p>View submitted reports and check their current status.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 RoadWatch AI. Building safer roads together.</p>
      </footer>
    </div>
  );
}

