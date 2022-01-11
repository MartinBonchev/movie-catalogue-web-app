import { Button as MaterialButton } from "@mui/material";

interface ButtonProps {
  styles?: object;
  onClickHandler: () => {};
}

const Button: React.FC<ButtonProps> = ({ onClickHandler, styles }) => {
  return (
    <MaterialButton
      style={{ textTransform: "none", ...styles }}
      className="search-button"
      size="medium"
      variant="outlined"
      color="success"
      onClick={onClickHandler}
    >
      Search
    </MaterialButton>
  );
};
export default Button;
