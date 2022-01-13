import { Button } from "components";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addToFavouritesThunk,
  deleteToFavouritesThunk,
  fetchReviewsThunk,
  MovieState,
  selectFavouritesList,
} from "redux/slices/movieSlice";
import { useAppDispatch, useAppSelector } from "__hooks__/redux";
import "./Movie.css";
interface MovieProps extends Omit<MovieState, "vote_average"> {}

export const Movie: React.FC<MovieProps> = ({
  id,
  title,
  genres,
  runtime,
  overview,
  homepage,
  poster_path,
  release_date,
}) => {
  const navigate = useNavigate();
  const getYear = (date: string) => {
    const year = new Date(date).getFullYear();
    return year;
  };
  const dispatch = useAppDispatch();
  const { list } = useAppSelector(selectFavouritesList);

  function checkFavourites(id: number) {
    return list.find((el: MovieState) => {
      return Number(el.id) === id;
    });
  }

  function addToFavourites(movie: MovieProps) {
    dispatch(addToFavouritesThunk(movie));
    navigate("/");
  }

  function removeFromFavourites(movie: MovieProps) {
    const movieToDelete = checkFavourites(movie.id);
    dispatch(deleteToFavouritesThunk(movieToDelete.movie_id));
    navigate("/");
  }

  return (
    <div className="movie-container">
      <img
        height={300}
        width={200}
        src={`https://image.tmdb.org/t/p/w500${poster_path}`}
      />
      <div className="description-section">
        <h1>
          {title} ({getYear(release_date)})
        </h1>
        <p>
          {genres.join(", ")} | {runtime} minutes
        </p>
        <p>{overview}</p>
        <a href={homepage}>Visit official site</a>
        {checkFavourites(id) === undefined ? (
          <Button
            onClickHandler={() =>
              addToFavourites({
                id,
                title,
                genres,
                runtime,
                overview,
                homepage,
                poster_path,
                release_date,
              })
            }
          >
            Add to favourites
          </Button>
        ) : (
          <Button
            color="error"
            onClickHandler={() =>
              removeFromFavourites({
                id,
                title,
                genres,
                runtime,
                overview,
                homepage,
                poster_path,
                release_date,
              })
            }
          >
            Remove from favourites
          </Button>
        )}
      </div>
    </div>
  );
};
