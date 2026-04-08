import { useState, useEffect } from "react";
import API from "../services/api";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import "../styles/main.css";

function ReviewPage() {
  const { taskId } = useParams();
  const { user } = useAuth();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [reviewee, setReviewee] = useState(null);

  // 🔄 FETCH TASK TO FIND REVIEWEE
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await API.get(`/tasks/${taskId}`);
        const task = res.data;

        // 👇 Decide who to review
        if (task.postedBy?._id === user._id) {
          setReviewee(task.assignedTo?._id);
        } else {
          setReviewee(task.postedBy?._id);
        }
      } catch {
        setModal({ msg: "Error loading task", type: "error" });
      }
    };

    fetchTask();
  }, [taskId, user]);

  const submitReview = async () => {
    if (!comment) {
      return setModal({
        msg: "Please write a review",
        type: "warning"
      });
    }

    if (!reviewee) {
      return setModal({
        msg: "Invalid review target",
        type: "error"
      });
    }

    try {
      setLoading(true);

      await API.post("/reviews", {
        taskId,
        reviewee,
        rating,
        comment
      });

      setModal({
        msg: "Review submitted successfully! ⭐",
        type: "success"
      });

      setComment("");

    } catch (err) {
      setModal({
        msg: err.response?.data?.msg || "Error submitting review",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ textAlign: "center" }}>
        <h2>⭐ Give Feedback</h2>

        {/* ⭐ RATING */}
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
          <option value={4}>⭐⭐⭐⭐ (4)</option>
          <option value={3}>⭐⭐⭐ (3)</option>
          <option value={2}>⭐⭐ (2)</option>
          <option value={1}>⭐ (1)</option>
        </select>

        {/* 📝 COMMENT */}
        <input
          placeholder="Write feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* 🔘 BUTTON */}
        <button
          className="btn"
          onClick={submitReview}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>

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

export default ReviewPage;