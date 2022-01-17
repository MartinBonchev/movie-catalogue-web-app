import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { selectIsAuthenticated } from "redux/slices/authSlice";
import { useAppSelector } from "__hooks__/redux";

export const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/signup" />;
};
