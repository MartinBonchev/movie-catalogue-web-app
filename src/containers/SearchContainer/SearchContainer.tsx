import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { searchMoviesByQueryThunk } from "redux/slices/movieSlice";
import { Button, SearchField } from "components";
import { useAppDispatch } from "__hooks__/redux";
import "./SearchContainer.css";

interface SearchContainerProps {}

export const SearchContainer: React.FC<SearchContainerProps> = ({}) => {
  const [query, setQuery] = useState("");
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function searchAction(value: string) {
    if (value) dispatch(searchMoviesByQueryThunk(value));
    navigate("/search");
    setQuery("");
  }

  const handlerOnChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const query = event.target.value;
    setQuery(query);
  };

  return (
    <div className="search-container">
      <SearchField onChange={handlerOnChange} value={query} />
      <Button onClickHandler={() => searchAction(query)}>Search</Button>
    </div>
  );
};
