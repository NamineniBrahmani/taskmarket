import { useState, useEffect, useCallback } from "react";
import API from "../services/api";
import TaskCard from "../components/TaskCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import "../styles/main.css";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const mode = localStorage.getItem("mode"); // 🔥 important

  // ✅ FETCH TASKS
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);

      let url = `/tasks?search=${search}`;
      if (sort) url += `&sort=${sort}`;
      if (statusFilter) url += `&status=${statusFilter}`;

      const res = await API.get(url);

      setTasks(res.data || []);

    } catch (err) {
      console.error(err);
      setModal({
        msg: "Error loading tasks",
        type: "error"
      });
    } finally {
      setLoading(false); // 🔥 THIS WAS MISSING
    }
  }, [search, sort, statusFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // 🔥 FILTER FOR WORKER MODE
  const visibleTasks =
    mode === "worker"
      ? tasks.filter((t) => t.status === "open")
      : tasks;

  // ⏳ LOADING
  if (loading) return <Loader />;

  return (
    <div className="container">
      <h2>Available Tasks</h2>

      {/* 🔍 SEARCH */}
      <input
        placeholder="🔍 Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 🔽 FILTER BAR */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "10px",
          flexWrap: "wrap"
        }}
      >
        {/* 💰 SORT */}
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort By</option>
          <option value="low">Budget Low → High</option>
          <option value="high">Budget High → Low</option>
          <option value="deadline">Nearest Deadline</option>
        </select>

        {/* 📊 STATUS */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="assigned">Assigned</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* 🔄 RESET */}
        <button
          className="btn"
          onClick={() => {
            setSearch("");
            setSort("");
            setStatusFilter("");
          }}
        >
          Reset
        </button>
      </div>

      {/* ❌ EMPTY */}
      {visibleTasks.length === 0 ? (
        <EmptyState message="No tasks found" />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "15px",
            marginTop: "15px"
          }}
        >
          {visibleTasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}

      {/* 🔥 MODAL */}
      {modal && (
        <Modal
          message={modal.msg}
          type={modal.type}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

export default Home;