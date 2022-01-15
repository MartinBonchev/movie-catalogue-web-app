import React from "react";
import { useNavigate } from "react-router-dom";

import {
  addToFavouritesThunk,
  deleteToFavouritesThunk,
  CreateFavouriteMovie,
  selectIsFavourite,
} from "redux/slices/movieSlice";

import { Button } from "components";
import { getGenres } from "utils/genre.utils";
import { useAppDispatch, useAppSelector } from "__hooks__/redux";
import "./Movie.css";
import { extractYearFrom } from "utils/date.utils";

interface MovieProps {
  id?: string;
  title: string;
  genres: Array<number>;
  runtime?: number;
  overview: string;
  homepage?: string;
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

  const isFavourite = useAppSelector(selectIsFavourite(external_id));
  const dispatch = useAppDispatch();

  function addToFavourites(movie: CreateFavouriteMovie) {
    dispatch(addToFavouritesThunk(movie));
  }

  function removeFromFavourites(id?: string) {
    if (!id) return;
    dispatch(deleteToFavouritesThunk(id));
  }

  function navigateToDetails(id: number) {
    navigate(`/movie/movie-title/${id}`);
  }

  return (
    <div className="movie-container">
      <img
        height={300}
        width={200}
        src={`https://image.tmdb.org/t/p/w500${poster_path}`}
        onClick={() => navigateToDetails(external_id)}
      />
      <div className="description-section">
        <h1>
          {title} {release_date ? `(${extractYearFrom(release_date)})` : null}
        </h1>
        <p>
          {getGenres(genres).join(", ")}
          {runtime ? `| ${runtime}  minutes` : null}
        </p>
        <p>{overview}</p>
        {homepage && <a href={homepage}>Visit official site</a>}
        {!isFavourite ? (
          <Button
            onClick={() =>
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
            onClick={() => removeFromFavourites(isFavourite.id)}
          >
            Remove from favourites
          </Button>
        )}
      </div>
    </div>
  );
};
