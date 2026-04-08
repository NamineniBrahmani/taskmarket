import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/main.css";

function RoleSelect() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const setMode = (mode) => {
    setSelected(mode);

    localStorage.setItem("mode", mode);

    setTimeout(() => {
      if (mode === "worker") navigate("/tasks");
      else navigate("/create");
    }, 500);
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        🚀 Choose Your Mode
      </h1>

      <p style={{ textAlign: "center", opacity: 0.7 }}>
        Switch anytime from the navbar
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          marginTop: "40px",
          flexWrap: "wrap"
        }}
      >

        {/* 🛠 WORKER */}
        <div
          className={`card role-card ${
            selected === "worker" ? "active" : ""
          }`}
          onClick={() => setMode("worker")}
        >
          <h2>🛠 Do Work</h2>
          <p>Browse tasks, place bids, and earn money</p>

          <ul>
            <li>✔ View available tasks</li>
            <li>✔ Place bids</li>
            <li>✔ Chat with poster</li>
            <li>✔ Earn payments</li>
          </ul>
        </div>

        {/* 📌 POSTER */}
        <div
          className={`card role-card ${
            selected === "poster" ? "active" : ""
          }`}
          onClick={() => setMode("poster")}
        >
          <h2>📌 Post Work</h2>
          <p>Create tasks and hire skilled workers</p>

          <ul>
            <li>✔ Post tasks</li>
            <li>✔ Review bids</li>
            <li>✔ Assign workers</li>
            <li>✔ Release payments</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RoleSelect;