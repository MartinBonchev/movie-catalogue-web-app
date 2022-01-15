import React from "react";
import { TextField } from "@mui/material";
interface SearchFieldProps {
  styles?: React.CSSProperties | undefined;
  onChangeHandler: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  value: string;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  styles,
  onChangeHandler,
  value,
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
      onChange={onChangeHandler}
      value={value || ""}
    ></TextField>
  );
};
