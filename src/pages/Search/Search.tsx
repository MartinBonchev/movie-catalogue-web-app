import React, { useEffect } from "react";
import { Movie } from "components";
import "./Search.css";
import { MovieState, selectMoviesList } from "redux/slices/movieSlice";
import { useAppSelector } from "__hooks__/redux";
import { SearchContainer } from "containers";
import { useNavigate } from "react-router";
interface SearchProps {}

export const Search: React.FC<SearchProps> = ({}) => {
  const movies = useAppSelector(selectMoviesList);
  const navigate = useNavigate();
  useEffect(() => {
    console.log(movies, " movies");
  }, []);
  function searchHandler() {}

  function navigateToDetails(id: number) {
    navigate(`/movie/movie-title/${id}`);
  }
  return (
    <div className="container">
      <div className="section-container">
        <div className="search-heading-container">
          <h2>Search</h2>
          <SearchContainer />
        </div>
        <div className="movie-section-container">
          {movies.map((movie: MovieState) => (
            <div
              key={movie.id}
              className="movie"
              onClick={() => navigateToDetails(movie.id)}
            >
              <Movie
                title={movie.title}
                src={movie.poster_path}
                date={movie.release_date}
                genres={movie.genres}
                duration={movie.runtime}
                overview={movie.overview}
                officialSitePath={movie.homepage}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
