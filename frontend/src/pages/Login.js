import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import "../styles/auth.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    // 🔍 VALIDATION
    if (!form.email || !form.password) {
      return setModal({
        msg: "Please enter email and password",
        type: "warning"
      });
    }

    try {
      setLoading(true);

      const res = await API.post("/users/login", form);

      login(res.data);

      setModal({
        msg: "Login successful!",
        type: "success"
      });

      // ⏳ redirect after success
      setTimeout(() => {
        navigate("/role");
      }, 1200);

    } catch (err) {
      setModal({
        msg: err.response?.data?.msg || "Login failed",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>TaskMarket</h1>
        <h3>Login</h3>

        <form onSubmit={submit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button className="btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p onClick={() => navigate("/register")} className="link">
          Create new account →
        </p>
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

export default Login;