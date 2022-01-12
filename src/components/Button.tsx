import { Button as MaterialButton } from "@mui/material";

interface ButtonProps {
  styles?: React.CSSProperties | undefined;
  onClickHandler: () => void | any;
  children: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onClickHandler,
  styles,
  children,
  disabled,
}) => {
  return (
    <MaterialButton
      style={{ textTransform: "none", ...styles }}
      className="search-button"
      size="medium"
      variant="outlined"
      color="success"
      onClick={onClickHandler}
      disabled={disabled}
    >
      {children}
    </MaterialButton>
  );
};
