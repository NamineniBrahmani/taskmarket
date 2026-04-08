import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateTask from "./pages/CreateTask";
import TaskDetails from "./pages/TaskDetails";
import Dashboard from "./pages/Dashboard";
import BidsPage from "./pages/BidsPage";
import ChatPage from "./pages/ChatPage";
import PaymentPage from "./pages/PaymentPage";
import RoleSelect from "./pages/RoleSelect";
import ReviewPage from "./pages/ReviewPage";

import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";

// 🔐 Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// 🔓 Public Route
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/role" replace /> : children;
};

// 🔥 Mode Protected Route
const ModeRoute = ({ children }) => {
  const mode = localStorage.getItem("mode");

  if (!mode) {
    return <Navigate to="/role" replace />;
  }

  return children;
};

function App() {
  const { user } = useAuth(); // 🔥 reactive auth

  return (
    <BrowserRouter>

      {/* 🔝 Navbar only when logged in */}
      {user && <Navbar />}

      <Routes>

        {/* 🔥 DEFAULT ROUTE */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/role" replace /> : <Navigate to="/login" replace />
          }
        />

        {/* 🔓 PUBLIC */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* 🎯 ROLE SELECT */}
        <Route
          path="/role"
          element={<ProtectedRoute><RoleSelect /></ProtectedRoute>}
        />

        {/* 📊 DASHBOARD */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />

        {/* 🛠 TASKS (Worker Mode Required) */}
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <ModeRoute>
                <Home />
              </ModeRoute>
            </ProtectedRoute>
          }
        />

        {/* 📌 CREATE TASK (Poster Mode Required) */}
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <ModeRoute>
                <CreateTask />
              </ModeRoute>
            </ProtectedRoute>
          }
        />

        {/* 🔍 TASK DETAILS */}
        <Route
          path="/task/:id"
          element={<ProtectedRoute><TaskDetails /></ProtectedRoute>}
        />

        {/* 💰 BIDS */}
        <Route
          path="/bids/:taskId"
          element={<ProtectedRoute><BidsPage /></ProtectedRoute>}
        />

        {/* 💬 CHAT */}
        <Route
          path="/chat/:taskId"
          element={<ProtectedRoute><ChatPage /></ProtectedRoute>}
        />

        {/* 🔐 PAYMENT */}
        <Route
          path="/payment/:id"
          element={<ProtectedRoute><PaymentPage /></ProtectedRoute>}
        />

        {/* ⭐ REVIEW */}
        <Route
          path="/review/:taskId"
          element={<ProtectedRoute><ReviewPage /></ProtectedRoute>}
        />

        {/* ❌ FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;