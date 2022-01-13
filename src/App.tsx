import { Header } from "containers";
import { ProtectedRoute } from "pages/Authentication/ProtectedRoute";
import { Auth } from "pages/Authentication/Auth";
import { Home } from "pages/Home/Home";
import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  // loginWithTokenThunk,
  selectIsAuthenticated,
} from "redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "__hooks__/redux";
import "./App.css";
import { Search } from "./pages/Search/Search";
import { MovieDetails } from "pages/MovieDetails/MovieDetails";

function App() {
  const isAuth = useAppSelector(selectIsAuthenticated);
  // const dispatch = useAppDispatch();
  // useEffect(() => {
  //   dispatch(loginWithTokenThunk());
  // }, []);
  return (
    <div>
      {isAuth ? <Header /> : null}
      <Routes>
        {!isAuth ? (
          <Route path="auth" element={<Auth />} />
        ) : (
          <>
            <Route path="/*" element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="movie/movie-title/:id" element={<MovieDetails />} />
          </>
        )}
        <Route path="*" element={<Navigate to={isAuth ? "/" : "/auth"} />} />
      </Routes>
    </div>
  );
}

export default App;
