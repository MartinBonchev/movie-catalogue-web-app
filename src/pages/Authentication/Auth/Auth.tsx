import React from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";

import { selectIsAuthenticated } from "redux/slices/authSlice";
import { useAppSelector } from "__hooks__/redux";
import { Button, Container } from "components";
import "./Auth.css";

export const Auth: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="auth-container">
      <div className="auth-nav-container">
        <p>Go to </p>
        {location.pathname === "/auth/signin" ? (
          <Link to="/auth/signup" style={{ textDecoration: "none" }}>
            <Button variant="contained">Sign Up</Button>
          </Link>
        ) : (
          <Link to="/auth/signin" style={{ textDecoration: "none" }}>
            <Button variant="contained">Sign In</Button>
          </Link>
        )}
      </div>
      <div className="page-container">
        <Container>
          <Outlet />
        </Container>
      </div>
    </div>
  );
};
