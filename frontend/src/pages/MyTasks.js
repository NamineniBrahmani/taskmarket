import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import "../styles/main.css";

function MyTasks() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    if (user?._id) fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/tasks/user/${user._id}`);
      setTasks(res.data);

    } catch {
      setModal({
        msg: "Error fetching tasks",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔐 SAFE CHECKS
  const isPoster = (task) =>
    user?._id &&
    (task.postedBy?._id === user._id ||
      task.postedBy === user._id);

  const isWorker = (task) =>
    user?._id &&
    (task.assignedTo?._id === user._id ||
      task.assignedTo === user._id);

  if (loading) return <Loader text="Loading your tasks..." />;

  return (
    <div className="container">
      <h2>My Tasks</h2>

      {/* ❌ EMPTY */}
      {tasks.length === 0 && (
        <EmptyState message="No tasks found" />
      )}

      {/* ✅ TASK LIST */}
      {tasks.map((task) => (
        <div key={task._id} className="card">
          <h3>{task.title}</h3>
          <p>{task.description}</p>

          <p><b>💰 Budget:</b> ₹{task.budget}</p>
          <p><b>📊 Status:</b> {task.status}</p>

          {/* 🔵 POSTER */}
          {isPoster(task) && (
            <>
              <p>📌 You posted this task</p>

              {task.status === "assigned" && (
                <button
                  className="btn"
                  onClick={async () => {
                    try {
                      await API.put(`/tasks/${task._id}/generate-otp`);
                      setModal({
                        msg: "OTP sent to worker email",
                        type: "success"
                      });
                    } catch {
                      setModal({
                        msg: "Error generating OTP",
                        type: "error"
                      });
                    }
                  }}
                >
                  🔐 Generate OTP
                </button>
              )}
            </>
          )}

          {/* 🟢 WORKER */}
          {isWorker(task) && (
            <>
              <p>🛠️ You are assigned to this task</p>

              {/* ENTER OTP */}
              {task.status === "assigned" && (
                <button
                  className="btn"
                  onClick={() => navigate(`/payment/${task._id}`)}
                >
                  ▶ Enter OTP & Start Work
                </button>
              )}

              {/* COMPLETE TASK */}
              {task.status === "in-progress" && (
                <button
                  className="btn"
                  onClick={async () => {
                    try {
                      await API.put(`/tasks/${task._id}/complete`);

                      setModal({
                        msg: "Task marked as completed!",
                        type: "success"
                      });

                      fetchTasks();

                    } catch {
                      setModal({
                        msg: "Error completing task",
                        type: "error"
                      });
                    }
                  }}
                >
                  ✅ Mark as Completed
                </button>
              )}
            </>
          )}
        </div>
      ))}

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

export default MyTasks;