import { FunctionComponent } from "react";
import React from "react";
import { Typography } from "@mui/material";
import "./Header.css";
import { SearchContainer } from "containers";
import { Button } from "components";
import { useAppDispatch, useAppSelector } from "__hooks__/redux";
import { logoutUserThunk } from "redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

import { selectMoviesList } from "redux/slices/movieSlice";

interface HeaderProps {}

const Header: FunctionComponent<HeaderProps> = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const moviesState = useAppSelector(selectMoviesList);
  async function logout() {
    try {
      const res: any = await dispatch(logoutUserThunk());
      if (!res.error) {
        localStorage.clear();
        navigate("/auth");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }

  return (
    <div className="header-container">
      <Typography>My Movie Collection</Typography>
      <SearchContainer />
      <Button color="primary" onClickHandler={logout}>
        Log out
      </Button>
    </div>
  );
};

export default Header;
