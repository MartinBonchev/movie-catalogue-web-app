import React from "react";
import { useNavigate } from "react-router-dom";

import { Typography } from "@mui/material";
import "./Header.css";
import { Button } from "components";
import {SearchContainer} from 'containers'
import { useAppDispatch } from "__hooks__/redux";
import { logoutUserThunk } from "redux/slices/authSlice";


interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
