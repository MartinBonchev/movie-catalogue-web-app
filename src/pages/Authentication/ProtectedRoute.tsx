import React, { Component } from "react";
import { Navigate, Route } from "react-router-dom";
import { selectIsAuthenticated } from "redux/slices/authSlice";
import { useAppSelector } from "__hooks__/redux";

interface ProtectedRouteProps {
  component?: Component;
  children: JSX.Element[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  ...restOfProps
}) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  console.log("this", isAuthenticated);

  return <></>;
};
