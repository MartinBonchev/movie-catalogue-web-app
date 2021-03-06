import React, { useEffect } from "react";

import {
  fetchFavouritesThunk,
  fetchTrendingMoviesThunk,
  selectSearchResults,
  selectTrendingMovies,
} from "redux/slices/movieSlice";

import { useAppDispatch, useAppSelector } from "__hooks__/redux";
import { selectUser } from "redux/slices/authSlice";

import { SearchContainer } from "containers";
import { Movie } from "components";
import { Page } from "containers/Page/Page";
import "./Search.css";

export const Search: React.FC = () => {
  const trendingMovies = useAppSelector(selectTrendingMovies);
  const searchResults = useAppSelector(selectSearchResults);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTrendingMoviesThunk());
    dispatch(fetchFavouritesThunk(user?.user_id));
  }, []);

  const moviesToRender =
    searchResults.length > 0 ? searchResults : trendingMovies;

  return (
    <Page>
      <div className="container">
        <div className="section-container">
          <div className="search-heading-container">
            <h2>Search</h2>
            <SearchContainer />
          </div>
          <div className="movie-section-container">
            {moviesToRender.map((movie) => (
              <div
                key={`${movie.poster_path}${movie.release_date}${movie.homepage}`}
                className="movie"
              >
                <Movie
                  external_id={movie.external_id}
                  title={movie.title}
                  genres={movie.genres}
                  poster_path={movie.poster_path}
                  release_date={movie.release_date}
                  overview={movie.overview}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
};
