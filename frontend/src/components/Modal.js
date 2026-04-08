import { useEffect } from "react";
import "./Modal.css";

function Modal({ message, type = "success", onClose }) {

  // ⏳ Auto close (3.5s better UX)
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onClose]);

  const titles = {
    success: "✅ Success",
    error: "❌ Error",
    warning: "⚠️ Warning",
    info: "ℹ️ Info"
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      
      {/* ❗ Prevent closing when clicking inside */}
      <div
        className={`modal-box ${type}`}
        onClick={(e) => e.stopPropagation()}
      >

        <h2>{titles[type]}</h2>

        <p>{message}</p>

        <button className="btn" onClick={onClose}>
          OK
        </button>

      </div>
    </div>
  );
}

export default Modal;