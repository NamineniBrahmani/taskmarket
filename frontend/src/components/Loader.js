import "../styles/main.css";

function Loader({ text = "Loading..." }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "80px",
        color: "#ccc"
      }}
    >
      {/* 🔥 SPINNER */}
      <div className="loader"></div>

      {/* 📝 TEXT */}
      <p style={{ marginTop: "12px", fontSize: "14px" }}>
        {text}
      </p>
    </div>
  );
}

export default Loader;