import React from "react";
import { useNavigate } from "react-router";
import { Typography } from "@mui/material";

import { useAppDispatch } from "__hooks__/redux";
import { logoutUserThunk } from "redux/slices/authSlice";
import { clearFavourites } from "redux/slices/movieSlice";

import { Button } from "components";
import { SearchContainer } from "containers";
import "./Header.css";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function logout() {
    dispatch(logoutUserThunk());
    dispatch(clearFavourites());
  }

  const navigateToHome = () => {
    navigate("/");
  };

  return (
    <div className="header-container">
      <div className="title-container" onClick={navigateToHome}>
        <Typography>My Movie Collection</Typography>
      </div>
      <SearchContainer />
      <Button color="primary" onClick={logout}>
        Log out
      </Button>
    </div>
  );
};

export default Header;
