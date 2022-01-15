import React from "react";
import {
  Button as MaterialButton,
  ButtonProps as MaterialButtonProps,
} from "@mui/material";

interface ButtonProps extends MaterialButtonProps {}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  style,
  children,
  ...rest
}) => {
  return (
    <MaterialButton
      style={{ textTransform: "none", ...style }}
      className="search-button"
      size="medium"
      onClick={onClick}
      {...rest}
    >
      {children}
    </MaterialButton>
  );
};
