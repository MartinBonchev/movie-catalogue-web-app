import { Box } from "@mui/material";
import React from "react";

interface ContainerProps {
  style?: React.CSSProperties | undefined;
  children: JSX.Element[];
}

export const Container: React.FC<ContainerProps> = ({ style, children }) => {
  const containerStyles: React.CSSProperties = {
    width: 500,
    height: 700,
    backgroundColor: "white",
    border: "solid",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#C2C3C6",
  };

  const displayFlex: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };
  return (
    <Box sx={{ ...containerStyles, ...displayFlex, ...style }}>
      <Box
        sx={{
          ...displayFlex,
          width: "100%",
          height: "50%",
          justifyContent: "space-between",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
