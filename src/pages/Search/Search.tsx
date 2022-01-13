import React, { useEffect, useState } from "react";
import { Movie } from "components";
import "./Search.css";
import { MovieState, selectMoviesList } from "redux/slices/movieSlice";
import { useAppSelector } from "__hooks__/redux";
import { SearchContainer } from "containers";
import { useNavigate } from "react-router";
import { searchByTitle } from "config/search";

export const Search: React.FC = ({}) => {
  const moviesState = useAppSelector(selectMoviesList) || [];
  const [movies, setMovies] = useState<Array<MovieState>>([]);
  const navigate = useNavigate();

  function navigateToDetails(id: number) {
    navigate(`/movie/movie-title/${id}`);
  }

  function getMovieList(value: string) {
    if (searchByTitle(value, moviesState)) {
      setMovies(searchByTitle(value, moviesState));
    } else setMovies(moviesState);
  }

  useEffect(() => {
    setMovies(moviesState);
  }, []);

  return (
    <div className="container">
      <div className="section-container">
        <div className="search-heading-container">
          <h2>Search</h2>
          <SearchContainer getValue={getMovieList} />
        </div>
        <div className="movie-section-container">
          {movies.map((movie: MovieState) => (
            <div
              key={movie.id}
              className="movie"
              onClick={() => navigateToDetails(movie.id)}
            >
              <Movie
                id={movie.id}
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
