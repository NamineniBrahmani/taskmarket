import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Modal from "../components/Modal";
import "../styles/auth.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    // 🔍 VALIDATION
    if (!form.name || !form.email || !form.password) {
      return setModal({
        msg: "Please fill all fields",
        type: "warning"
      });
    }

    if (form.password.length < 6) {
      return setModal({
        msg: "Password must be at least 6 characters",
        type: "warning"
      });
    }

    try {
      setLoading(true);

      await API.post("/users/register", form);

      setModal({
        msg: "Registered successfully! 🎉",
        type: "success"
      });

      // ⏳ redirect
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setModal({
        msg: err.response?.data?.msg || "Registration failed",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={submit}>
        <h2>Create Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="link">
            Login
          </span>
        </p>
      </form>

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

export default Register;