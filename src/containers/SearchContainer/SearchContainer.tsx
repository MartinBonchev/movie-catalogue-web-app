import { Button, SearchField } from "components";
import React from "react";
import "./SearchContainer.css";

interface SearchContainerProps {}

export const SearchContainer: React.FC<SearchContainerProps> = ({}) => {
  return (
    <div className="search-container">
      <SearchField />
      <Button
        onClickHandler={() => {
          console.log("You are searching");
        }}
      >
        Search
      </Button>
    </div>
  );
};
