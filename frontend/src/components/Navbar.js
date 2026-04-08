import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  // 🔒 SAFE PARSE
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const mode = localStorage.getItem("mode");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const switchMode = () => {
    localStorage.removeItem("mode");
    window.location.href = "/role"; // 🔥 force refresh
  };

  const isActive = (path) =>
    location.pathname === path ? "active-link" : "";

  if (!token) return null;

  return (
    <nav className="navbar">
      {/* 🔥 LOGO */}
      <h2 className="logo" onClick={() => navigate("/role")}>
        TaskMarket
      </h2>

      <div className="nav-links">

        {/* 🏠 HOME */}
        <Link to="/role" className={isActive("/role")}>
          Home
        </Link>

        {/* 🛠 WORKER MODE */}
        {mode === "worker" && (
          <Link to="/tasks" className={isActive("/tasks")}>
            Find Work
          </Link>
        )}

        {/* 📌 POSTER MODE */}
        {mode === "poster" && (
          <Link to="/create" className={isActive("/create")}>
            Post Task
          </Link>
        )}

        {/* 📊 DASHBOARD */}
        <Link to="/dashboard" className={isActive("/dashboard")}>
          Dashboard
        </Link>

        {/* ⚠️ NO MODE SELECTED */}
        {!mode && (
          <span style={{ color: "#f59e0b" }}>
            ⚠️ Select Mode
          </span>
        )}

        {/* 🔥 MODE INDICATOR */}
        {mode && (
          <span className="user">
            {mode === "worker" ? "🛠 Worker" : "📌 Poster"}
          </span>
        )}

        {/* 👤 USER */}
        <span className="user">
          👤 {user?.name || "User"}
        </span>

        {/* 🔄 SWITCH MODE */}
        <button onClick={switchMode} className="btn">
          Switch Mode
        </button>

        {/* 🚪 LOGOUT */}
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;