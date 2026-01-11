// src/router/ProtectedRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();

  // Read token + user from Redux
  const reduxToken = auth?.token;
  const reduxUser = auth?.user;

  // Fallback to localStorage (in case Redux not yet hydrated)
  const lsToken = localStorage.getItem("token");
  const lsUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const token = reduxToken || lsToken;
  const user = reduxUser || lsUser;

  // 🔍 Debug log – keep for now, remove later if annoying
  console.log("ProtectedRoute check:", { reduxToken, reduxUser, lsToken, lsUser });

  // 1️⃣ Not logged in at all → go to login
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }} // optional: can use to redirect back after login
      />
    );
  }

  // 2️⃣ If this route needs a specific role (e.g. ADMIN)
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  // 3️⃣ All good → render child page
  return children;
}
