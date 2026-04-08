import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 🎨 Global Styles
import "./styles/main.css";

// 🔐 Auth Context
import { AuthProvider } from "./context/AuthContext";

// 🚀 Create Root
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);