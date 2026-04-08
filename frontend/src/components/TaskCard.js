import { Link } from "react-router-dom";
import "../styles/main.css";

function TaskCard({ task }) {
  // ✅ SAFE USER PARSE
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const mode = localStorage.getItem("mode");

  // ✅ SAFE postedBy check
  const isPoster =
    user?._id === (task.postedBy?._id || task.postedBy);

  return (
    <div className="card task-card">

      {/* 🔥 TITLE */}
      <h3>{task.title}</h3>

      {/* 📝 DESCRIPTION */}
      <p style={{ opacity: 0.85 }}>{task.description}</p>

      {/* 📊 INFO */}
      <p><b>📂 Category:</b> {task.category}</p>
      <p><b>💰 Budget:</b> ₹{task.budget}</p>

      {/* 📅 SAFE DEADLINE */}
      <p>
        <b>📅 Deadline:</b>{" "}
        {task.deadline
          ? new Date(task.deadline).toLocaleDateString()
          : "Not specified"}
      </p>

      {/* 📊 STATUS */}
      <p className={`status ${task.status}`}>
        {task.status.toUpperCase()}
      </p>

      {/* 🔘 ACTIONS */}
      <div className="actions">

        {/* 👁 VIEW */}
        <Link to={`/task/${task._id}`}>
          <button className="btn">View</button>
        </Link>

        {/* 🛠 WORKER MODE */}
        {mode === "worker" &&
          task.status === "open" &&
          !isPoster && (
            <Link to={`/bids/${task._id}`}>
              <button className="btn">Place Bid</button>
            </Link>
          )}

        {/* 📌 POSTER MODE */}
        {mode === "poster" && isPoster && (
          <Link to={`/bids/${task._id}`}>
            <button className="btn">View Bids</button>
          </Link>
        )}

      </div>
    </div>
  );
}

export default TaskCard;