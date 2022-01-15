import React from "react";
import { Typography } from "@mui/material";

import { useAppDispatch } from "__hooks__/redux";
import { logoutUserThunk } from "redux/slices/authSlice";
import { Button } from "components";
import { SearchContainer } from "containers";
import "./Header.css";
import { clearFavourites } from "redux/slices/movieSlice";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();

  async function logout() {
    dispatch(logoutUserThunk());
    dispatch(clearFavourites());
  }

  return (
    <div className="header-container">
      <Typography>My Movie Collection</Typography>
      <SearchContainer />
      <Button color="primary" onClick={logout}>
        Log out
      </Button>
    </div>
  );
};

export default Header;
