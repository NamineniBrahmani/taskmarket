import { useState } from "react";
import "../styles/main.css";

function BidCard({ bid, isOwner, onAssign, taskStatus }) {
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!bid?.bidder?._id) {
      alert("Invalid user");
      return;
    }

    setLoading(true);
    await onAssign(bid.bidder._id);
    setLoading(false);
  };

  return (
    <div className="card bid-card">

      <h3>₹{bid.amount}</h3>

      <p>
        <b>Bidder:</b> {bid.bidder?.name || "Unknown User"}
      </p>

      <p>
        <b>Deadline:</b>{" "}
        {new Date(bid.deadline).toLocaleDateString()}
      </p>

      {bid.message && <p>{bid.message}</p>}

      {/* 🔥 ASSIGN BUTTON */}
      {isOwner && taskStatus === "open" && (
        <button
          className="btn"
          onClick={handleAssign}
          disabled={loading}
        >
          {loading ? "Assigning..." : "Assign Task"}
        </button>
      )}

    </div>
  );
}

export default BidCard;