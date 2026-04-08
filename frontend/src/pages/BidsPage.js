import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

function BidsPage() {
  const { taskId } = useParams();
  const { user } = useAuth();

  const [bids, setBids] = useState([]);
  const [task, setTask] = useState(null);

  const [bidAmount, setBidAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const mode = localStorage.getItem("mode");

  // ✅ FIXED: useCallback to remove warning
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const t = await API.get(`/tasks/${taskId}`);
      const b = await API.get(`/bids/${taskId}`);

      setTask(t.data);
      setBids(b.data);
    } catch {
      setModal({ msg: "Error loading data", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  // 🔄 FETCH DATA
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 🛠 PLACE BID
  const placeBid = async () => {
    if (!bidAmount || !deadline) {
      return setModal({
        msg: "Please fill all fields",
        type: "warning"
      });
    }

    try {
      await API.post("/bids", {
        taskId,
        bidAmount,
        deadline: new Date(deadline + "T23:59:59")
      });

      setModal({ msg: "Bid placed successfully!", type: "success" });

      setBidAmount("");
      setDeadline("");

      fetchData();
    } catch (err) {
      setModal({
        msg: err.response?.data?.msg || "Error placing bid",
        type: "error"
      });
    }
  };

  // 📌 ASSIGN TASK
  const assign = async (id) => {
    try {
      await API.put(`/tasks/${taskId}/assign`, { userId: id });

      setModal({ msg: "Task Assigned!", type: "success" });

      fetchData();
    } catch {
      setModal({ msg: "Error assigning task", type: "error" });
    }
  };

  // 🔐 SAFE CHECKS
  const isPoster =
    user?._id &&
    (task?.postedBy?._id === user._id ||
      task?.postedBy === user._id);

  if (loading) return <Loader />;

  return (
    <div className="container">
      <h2>{task?.title}</h2>

      {/* 🛠 WORKER MODE */}
      {mode === "worker" && task?.status === "open" && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <h3>Place Your Bid</h3>

          <input
            type="number"
            placeholder="Enter amount"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
          />

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <button className="btn" onClick={placeBid}>
            Submit Bid
          </button>
        </div>
      )}

      {/* ❌ NO BIDS */}
      {bids.length === 0 && (
        <EmptyState message="No bids yet" />
      )}

      {/* ✅ BIDS LIST */}
      {bids.map((b) => (
        <div key={b._id} className="card">
          <h3>₹{b.bidAmount}</h3>

          <p>
            <b>User:</b> {b.userId?.name || "Unknown"}
          </p>

          <p>
            <b>Deadline:</b>{" "}
            {new Date(b.deadline).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })}
          </p>

          {/* 📌 POSTER ASSIGN */}
          {isPoster && task?.status === "open" && (
            <button
              className="btn"
              onClick={() => assign(b.userId._id)}
            >
              Assign Task
            </button>
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

export default BidsPage;