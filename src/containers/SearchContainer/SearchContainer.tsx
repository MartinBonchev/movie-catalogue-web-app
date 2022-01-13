import { Button, SearchField } from "components";
import React from "react";
import "./SearchContainer.css";

interface SearchContainerProps {
  getValue: (value: string) => void;
}

export const SearchContainer: React.FC<SearchContainerProps> = ({
  getValue,
}) => {
  return (
    <div className="search-container">
      <SearchField getValue={getValue} />
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
