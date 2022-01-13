import { TextField } from "@mui/material";
import React from "react";

interface SearchFieldProps {
  styles?: React.CSSProperties | undefined;
}

export const SearchField: React.FC<SearchFieldProps> = ({ styles }) => {
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
