import React from "react";
import { Header } from "containers";

export const Page: React.FC = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};
