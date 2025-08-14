import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  let userRole = null;
  try {
    const decoded = jwtDecode(token);
    userRole = decoded.role;
  } catch (e) {
    return <Navigate to="/login" />;
  }
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
