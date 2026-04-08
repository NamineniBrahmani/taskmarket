import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import "../styles/dashboard.css";

function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({});
  const [tasks, setTasks] = useState([]);

  // ✅ FETCH DATA
  const fetchData = useCallback(async () => {
    try {
      const statsRes = await API.get("/stats");
      const tasksRes = await API.get(`/tasks/user/${user._id}`);

      setStats(statsRes.data || {});
      setTasks(tasksRes.data || []);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    if (user?._id) {
      fetchData();
    }
  }, [fetchData, user]);

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.name}</h2>

      {/* 💳 Wallet */}
      <div className="wallet">
        💳 Wallet Balance: ₹{user?.wallet}
      </div>

      {/* 📊 Stats */}
      <div className="stats">
        <div className="stat-card">
          📌 Posted: {stats.posted?.total || 0}
        </div>

        <div className="stat-card">
          ✅ Completed (Posted): {stats.posted?.completed || 0}
        </div>

        <div className="stat-card">
          🛠 Work Taken: {stats.work?.total || 0}
        </div>

        <div className="stat-card">
          🎯 Completed Work: {stats.work?.completed || 0}
        </div>

        <div className="stat-card">
          📂 Open Tasks: {stats.openTasks || 0}
        </div>
      </div>

      {/* 📌 Tasks */}
      <h3>My Tasks</h3>
      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))
      )}
    </div>
  );
}

export default Dashboard;