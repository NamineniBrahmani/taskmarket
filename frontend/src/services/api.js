import axios from "axios";

// 🌐 BASE URL (supports production + local)
const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// 🔥 Create Axios Instance
const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000 // ⏱ 10 sec timeout
});

// ✅ REQUEST INTERCEPTOR (Attach Token)
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// ❌ RESPONSE INTERCEPTOR (Global Error Handling)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    // 🔐 Unauthorized → logout
    if (err.response?.status === 401) {
      console.warn("Session expired. Redirecting...");

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("mode");

      window.location.href = "/login";
    }

    // 🌐 Network error
    if (!err.response) {
      console.error("Network error. Please check your connection.");
    }

    return Promise.reject(err);
  }
);

export default API;