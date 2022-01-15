import React from "react";
import { StandardTextFieldProps, TextField } from "@mui/material";

interface SearchFieldProps extends StandardTextFieldProps {}

export const SearchField: React.FC<SearchFieldProps> = ({
  style,
  onChange,
  value,
  ...rest
}) => {
  const defaultStyles = { width: 300, backgroundColor: "white" };
  return (
    <TextField
      color="success"
      fullWidth={false}
      size="small"
      style={{ ...defaultStyles, ...style }}
      label="Search by movie title..."
      variant="outlined"
      onChange={onChange}
      value={value || ""}
      {...rest}
    ></TextField>
  );
};
