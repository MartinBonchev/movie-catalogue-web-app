import { TextField } from "@mui/material";
import React from "react";

interface SearchFieldProps {
  styles?: React.CSSProperties | undefined;
  getValue: (value: string) => void;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  styles,
  getValue,
}) => {
  const defaultStyles = { width: 300, backgroundColor: "white" };

  return (
    <TextField
      color="success"
      fullWidth={false}
      size="small"
      style={{ ...defaultStyles, ...styles }}
      label="Search by movie title..."
      variant="outlined"
      onChange={(value) => {
        getValue(value.target.value);
      }}
    ></TextField>
  );
};
