import "../styles/main.css";

function EmptyState({ message = "Nothing here yet 😔", action }) {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "60px",
        padding: "30px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        color: "#ccc"
      }}
    >
      {/* 🎯 ICON */}
      <div style={{ fontSize: "40px", marginBottom: "10px" }}>
        📭
      </div>

      {/* 📝 MESSAGE */}
      <h3 style={{ marginBottom: "10px" }}>
        {message}
      </h3>

      {/* 🔥 OPTIONAL ACTION BUTTON */}
      {action && (
        <button
          className="btn"
          style={{ marginTop: "10px" }}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;