import React, { useEffect, useState } from "react";
import { Movie } from "components";
import "./Search.css";
import {
  fetchTrendingMovies,
  MovieState,
  selectMoviesList,
} from "redux/slices/movieSlice";
import { useAppDispatch, useAppSelector } from "__hooks__/redux";
import { SearchContainer } from "containers";
import { useNavigate } from "react-router";
import { searchByTitle } from "config/search";

export const Search: React.FC = ({}) => {
  const moviesState = useAppSelector(selectMoviesList);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  console.log(moviesState);

  function navigateToDetails(id: number) {
    navigate(`/movie/movie-title/${id}`);
  }

  // function getMovieList(value: string) {
  //   if (searchByTitle(value, moviesState)) {
  //     setMovies(searchByTitle(value, moviesState));
  //   } else setMovies(moviesState);
  // }

  useEffect(() => {
    dispatch(fetchTrendingMovies());
    // setMovies(moviesState);
  }, []);

  return (
    <div className="container">
      <div className="section-container">
        <div className="search-heading-container">
          <h2>Search</h2>
          {/* <SearchContainer getValue={getMovieList} /> */}
        </div>
        <div className="movie-section-container">
          {moviesState &&
            moviesState.map((movie: MovieState) => (
              <div
                key={movie.id}
                className="movie"
                // onClick={() => navigateToDetails(movie.id)}
              >
                <Movie
                  external_id={+movie.id!}
                  title={movie.title}
                  genres={movie.genres}
                  poster_path={movie.poster_path}
                  runtime={movie.runtime}
                  release_date={movie.release_date}
                  overview={movie.overview}
                  homepage={movie.homepage}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
