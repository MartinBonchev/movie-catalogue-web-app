import { FunctionComponent } from "react";
import React from "react";
import { Typography } from "@mui/material";
import "./Header.css";
import { SearchContainer } from "containers/SearchContainer/SearchContainer";

interface HeaderProps {}

const Header: FunctionComponent<HeaderProps> = () => {
  return (
    <div className="header-container">
      <Typography>My Movie Collection</Typography>
      <SearchContainer />
    </div>
  );
};

export default Header;
