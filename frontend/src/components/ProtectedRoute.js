import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, requiredMode }) {
  const token = localStorage.getItem("token");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const mode = localStorage.getItem("mode");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ No mode selected
  if (!mode) {
    return <Navigate to="/role" replace />;
  }

  // ❌ Mode mismatch (important 🔥)
  if (requiredMode && mode !== requiredMode) {
    return <Navigate to="/role" replace />;
  }

  // ❌ Invalid user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ All good
  return children;
}

export default ProtectedRoute;