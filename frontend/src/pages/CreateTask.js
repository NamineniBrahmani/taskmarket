import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Modal from "../components/Modal";
import "../styles/main.css";

function CreateTask() {
  const navigate = useNavigate();
  const mode = localStorage.getItem("mode");

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    category: "Other"
  });

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    // 🔍 VALIDATION
    if (!form.title || !form.description || !form.budget || !form.deadline) {
      return setModal({
        msg: "Please fill all fields",
        type: "warning"
      });
    }

    if (form.budget <= 0) {
      return setModal({
        msg: "Budget must be greater than 0",
        type: "warning"
      });
    }

    const today = new Date().toISOString().split("T")[0];
    if (form.deadline < today) {
      return setModal({
        msg: "Deadline cannot be in the past",
        type: "warning"
      });
    }

    try {
      setLoading(true);

      await API.post("/tasks", form);

      setModal({
        msg: "Task Created Successfully! 🎉",
        type: "success"
      });

      // ⏳ Redirect
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      setModal({
        msg: err.response?.data?.msg || "Error creating task",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // ❌ Only poster mode allowed
  if (mode !== "poster") {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: "center" }}>
          <h3>⚠️ Switch to Poster Mode to create tasks</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Create Task</h2>

        <form onSubmit={submit}>

          {/* 📝 TITLE */}
          <input
            name="title"
            placeholder="Task Title"
            value={form.title}
            onChange={handleChange}
          />

          {/* 📝 DESCRIPTION */}
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          {/* 📂 CATEGORY */}
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option>Delivery</option>
            <option>Assignment</option>
            <option>Cleaning</option>
            <option>Shopping</option>
            <option>Other</option>
          </select>

          {/* 💰 BUDGET */}
          <input
            type="number"
            name="budget"
            placeholder="Budget (₹)"
            value={form.budget}
            onChange={handleChange}
          />

          {/* 📅 DEADLINE */}
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
          />

          {/* 🔘 BUTTON */}
          <button className="btn" disabled={loading}>
            {loading ? "Creating..." : "Create Task"}
          </button>

        </form>
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

export default CreateTask;