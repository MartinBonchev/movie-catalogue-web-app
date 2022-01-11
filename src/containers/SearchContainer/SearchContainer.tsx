import { Button, Search } from "components";
import React from "react";
import "./SearchContainer.css";

interface SearchContainerProps {}

export const SearchContainer: React.FC<SearchContainerProps> = ({}) => {
  return (
    <div className="search-container">
      <Search />
      <Button
        onClickHandler={() => {
          console.log("You are searching");
          return "";
        }}
      />
    </div>
  );
};
