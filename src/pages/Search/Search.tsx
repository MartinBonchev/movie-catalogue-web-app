import React, { useEffect, useState } from "react";
import { Movie } from "components";
import "./Search.css";
import {
  fetchTrendingMovies,
  MovieState,
  selectMoviesList,
} from "redux/slices/movieSlice";
import { useAppDispatch, useAppSelector } from "__hooks__/redux";

import { useNavigate } from "react-router";
import { SearchContainer } from "containers";

export const Search: React.FC = ({}) => {
  const moviesState = useAppSelector(selectMoviesList);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  function navigateToDetails(id: number) {
    navigate(`/movie/movie-title/${id}`);
  }

  useEffect(() => {
    dispatch(fetchTrendingMovies());
  }, []);
  return (
    <div className="container">
      <div className="section-container">
        <div className="search-heading-container">
          <h2>Search</h2>
          <SearchContainer />
        </div>
        <div className="movie-section-container">
          {moviesState &&
            moviesState.map((movie: MovieState) => (
              <div
                key={movie.external_id}
                className="movie"
                onClick={() => navigateToDetails(movie.external_id)}
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
  );
};
