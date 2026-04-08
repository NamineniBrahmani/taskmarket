import Modal from "../components/Modal";
import Loader from "../components/Loader";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/main.css";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [modal, setModal] = useState(null);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTask = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get(`/tasks/${id}`);
      setTask(res.data);
    } catch (err) {
      console.error(err);
      setModal({ msg: "Error loading task", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  if (loading) return <Loader />;
  if (!task) return <p style={{ textAlign: "center" }}>Task not found</p>;

  // 🔥 SAFE CHECKS
  const isPoster =
    user?._id &&
    String(task.postedBy?._id || task.postedBy) === String(user._id);

  const isWorker =
    user?._id &&
    String(task.assignedTo?._id || task.assignedTo) === String(user._id);

  return (
    <>
      <div className="container">
        <div className="card" style={{ padding: "30px" }}>

          <h1>{task.title}</h1>
          <p style={{ opacity: 0.8 }}>{task.description}</p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginTop: "15px"
          }}>
            <p><b>💰 Budget:</b> ₹{task.budget}</p>
            <p><b>📅 Deadline:</b> {new Date(task.deadline).toLocaleDateString("en-GB")}</p>

            <p className={`status ${task.status}`}>
              <b>Status:</b> {task.status.toUpperCase()}
            </p>

            <p><b>📂 Category:</b> {task.category}</p>

            {/* 🔥 PAYMENT STATUS */}
            <p>
              <b>💳 Payment:</b>{" "}
              {task.paymentStatus === "paid" ? "✅ Paid" : "⏳ Pending"}
            </p>
          </div>

          <hr />

          <p><b>👤 Posted By:</b> {task.postedBy?.name}</p>
          <p><b>👷 Assigned To:</b> {task.assignedTo?.name || "Not Assigned"}</p>

          {/* 🔥 WORKER PAYMENT MESSAGE */}
          {isWorker && task.paymentStatus === "paid" && (
            <p style={{
              color: "#22c55e",
              fontWeight: "bold",
              marginTop: "10px"
            }}>
              💰 Payment received in your wallet!
            </p>
          )}

          <div style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "20px"
          }}>

            {/* 🛠 WORKER → PLACE BID */}
            {!isPoster && task.status === "open" && (
              <button
                className="btn"
                onClick={() => navigate(`/bids/${task._id}`)}
              >
                💼 Place Bid
              </button>
            )}

            {/* 📊 POSTER → VIEW BIDS */}
            {isPoster && (
              <button
                className="btn"
                onClick={() => navigate(`/bids/${task._id}`)}
              >
                📊 View Bids
              </button>
            )}

            {/* 🔐 POSTER → GENERATE OTP */}
            {isPoster && task.status === "assigned" && (
              <button
                className="btn"
                onClick={async () => {
                  try {
                    await API.put(`/tasks/${task._id}/generate-otp`);
                    setModal({ msg: "OTP sent to worker 📩", type: "success" });
                  } catch {
                    setModal({ msg: "Error generating OTP", type: "error" });
                  }
                }}
              >
                🔐 Generate OTP
              </button>
            )}

            {/* 🔐 WORKER → ENTER OTP */}
            {isWorker && task.status === "assigned" && (
              <button
                className="btn"
                onClick={() => navigate(`/payment/${task._id}`)}
              >
                ▶ Enter OTP
              </button>
            )}

            {/* ✅ WORKER → COMPLETE TASK */}
            {isWorker && task.status === "in-progress" && (
              <button
                className="btn"
                onClick={async () => {
                  try {
                    await API.put(`/tasks/${task._id}/complete`);
                    setModal({ msg: "Task Completed!", type: "success" });
                    fetchTask();
                  } catch {
                    setModal({ msg: "Error completing task", type: "error" });
                  }
                }}
              >
                ✅ Complete Task
              </button>
            )}

            {/* 💳 POSTER → RELEASE PAYMENT */}
            {isPoster &&
              task.status === "completed" &&
              task.paymentStatus !== "paid" && (
                <button
                  className="btn"
                  onClick={async () => {
                    try {
                      await API.put(`/tasks/${task._id}/release-payment`);
                      setModal({ msg: "Payment Released 💰", type: "success" });
                      fetchTask();
                    } catch {
                      setModal({ msg: "Error releasing payment", type: "error" });
                    }
                  }}
                >
                  💳 Release Payment
                </button>
              )}

            {/* ⭐ REVIEW */}
            {task.status === "completed" && (
              <button
                className="btn"
                onClick={() => navigate(`/review/${task._id}`)}
              >
                ⭐ Give Feedback
              </button>
            )}

            {/* 💬 CHAT */}
            {(isPoster || isWorker) && (
              <button
                className="btn"
                onClick={() => navigate(`/chat/${task._id}`)}
              >
                💬 Chat
              </button>
            )}

          </div>
        </div>
      </div>

      {modal && (
        <Modal
          message={modal.msg}
          type={modal.type}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}

export default TaskDetails;