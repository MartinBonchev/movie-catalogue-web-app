import { Button } from "components";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addToFavouritesThunk,
  deleteToFavouritesThunk,
  CreateFavouriteMovie,
  fetchReviewsThunk,
  MovieState,
  selectFavouritesList,
  selectIsFavourite,
} from "redux/slices/movieSlice";
import { getGenres } from "utils/utils";
import { useAppDispatch, useAppSelector } from "__hooks__/redux";
import "./Movie.css";
interface MovieProps {
  id?: string;
  title: string;
  genres: Array<number>;
  runtime?: number;
  overview: string;
  homepage: string;
  external_id: number;
  poster_path: string;
  release_date: string;
}

export const Movie: React.FC<MovieProps> = ({
  id,
  title,
  genres,
  runtime,
  overview,
  homepage,
  external_id,
  poster_path,
  release_date,
}) => {
  const navigate = useNavigate();
  const getYear = (date: string) => {
    const year = new Date(date).getFullYear();
    return year;
  };
  const isFavourite = useAppSelector(selectIsFavourite(external_id));
  const dispatch = useAppDispatch();
  const favourites = useAppSelector(selectFavouritesList);

  function checkFavourites(id: number) {
    return favourites.find((el: CreateFavouriteMovie) => {
      return Number(el.external_id) === id;
    });
  }

  function addToFavourites(movie: CreateFavouriteMovie) {
    dispatch(addToFavouritesThunk(movie));
    return navigate("/");
  }

  function removeFromFavourites(id: string | undefined) {
    if (!id) return;
    dispatch(deleteToFavouritesThunk(id));
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
          {/* {getGenres(genres).join(", ")}{" "} */}
          {runtime ? `| ${runtime}  minutes` : null}
        </p>
        <p>{overview}</p>
        <a href={homepage}>Visit official site</a>
        {!isFavourite ? (
          <Button
            onClickHandler={() =>
              addToFavourites({
                external_id: external_id,
                poster_path,
              })
            }
          >
            Add to favourites
          </Button>
        ) : (
          <Button
            color="error"
            onClickHandler={() => removeFromFavourites(isFavourite.id)}
          >
            Remove from favourites
          </Button>
        )}
      </div>
    </div>
  );
};
