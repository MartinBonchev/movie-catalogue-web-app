import { Button as MaterialButton } from "@mui/material";

type Color =
  | "inherit"
  | "success"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "warning"
  | undefined;

interface ButtonProps {
  styles?: React.CSSProperties | undefined;
  onClickHandler: () => void | any;
  children: string;
  disabled?: boolean;
  color?: Color;
  variant?: "text" | "outlined" | "contained" | undefined;
}

export const Button: React.FC<ButtonProps> = ({
  onClickHandler,
  styles,
  children,
  disabled,
  color,
  variant,
}) => {
  return (
    <MaterialButton
      style={{ textTransform: "none", ...styles }}
      className="search-button"
      size="medium"
      variant={variant || "outlined"}
      color={color || "success"}
      onClick={onClickHandler}
      disabled={disabled}
    >
      {children}
    </MaterialButton>
  );
};
