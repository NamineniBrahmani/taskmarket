import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Modal from "../components/Modal";
import "../styles/main.css";

function PaymentPage() {
  const { id } = useParams();

  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);

  // 🔐 VERIFY OTP
  const verifyOTP = async () => {
    if (!otp) {
      return setModal({
        msg: "Please enter OTP",
        type: "warning"
      });
    }

    try {
      setLoading(true);

      await API.put(`/tasks/${id}/verify-otp`, { otp });

      setVerified(true);

      setModal({
        msg: "OTP Verified! Work Started 🚀",
        type: "success"
      });

    } catch (err) {
      setModal({
        msg: err.response?.data?.msg || "Invalid OTP",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ MARK COMPLETED
  const markCompleted = async () => {
    try {
      setLoading(true);

      await API.put(`/tasks/${id}/complete`);

      setModal({
        msg: "Work marked as completed!",
        type: "success"
      });

    } catch {
      setModal({
        msg: "Error completing task",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ textAlign: "center" }}>
        <h2>💼 Worker Panel</h2>

        {!verified ? (
          <>
            <p>Enter OTP to start working</p>

            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              className="btn"
              onClick={verifyOTP}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        ) : (
          <>
            <p>✅ Work in progress</p>

            <button
              className="btn"
              onClick={markCompleted}
              disabled={loading}
            >
              {loading ? "Processing..." : "Mark Work as Completed"}
            </button>
          </>
        )}
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

export default PaymentPage;