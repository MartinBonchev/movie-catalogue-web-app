import React from "react";

import { ProtectedRoute } from "layout/ProtectedRoute/ProtectedRoute";
import { Route, Routes } from "react-router-dom";
import { Auth } from "pages/Authentication/Auth";
import { Home } from "pages/Home/Home";
import { Search } from "pages/Search/Search";
import { MovieDetails } from "pages/MovieDetails/MovieDetails";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="auth" element={<Auth />} />
      <Route path="/*" element={<ProtectedRoute />}>
        <Route path="/*" element={<Home />} />
      </Route>
      <Route path="/search" element={<ProtectedRoute />}>
        <Route path="/search" element={<Search />} />
      </Route>
      <Route path="/movie/movie-title/:id" element={<ProtectedRoute />}>
        <Route path="/movie/movie-title/:id" element={<MovieDetails />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
