import { TextField } from "@mui/material";
import React from "react";

interface SearchProps {
  styles?: React.CSSProperties | undefined;
}

export const Search: React.FC<SearchProps> = ({ styles }) => {
  const defaultStyles = { width: 300, backgroundColor: "white" };

  return (
    <TextField
      color="success"
      fullWidth={false}
      size="small"
      style={{ ...defaultStyles, ...styles }}
      label="Search by movie title..."
      variant="outlined"
    ></TextField>
  );
};
