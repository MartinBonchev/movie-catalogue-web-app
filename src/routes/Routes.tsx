import React from "react";
import { Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "components/ProtectedRoute/ProtectedRoute";
import { Home } from "pages/Home/Home.page";
import { Search } from "pages/Search/Search";
import { MovieDetails } from "pages/MovieDetails/MovieDetails.page";

import { Auth } from "pages/Authentication/Auth/Auth";
import { SignUp } from "pages/Authentication/SIgnUp/SignUp.page";
import { SignIn } from "pages/Authentication/SignIn/SignIn";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="auth" element={<Auth />}>
        <Route path="signup" element={<SignUp />} />
        <Route path="signin" element={<SignIn />} />
      </Route>
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
