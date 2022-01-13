import { Rating } from "@mui/material";
import { Movie } from "components";
import React from "react";
import { Params, useParams } from "react-router";
import { MovieState, selectMovie } from "redux/slices/movieSlice";
import { useAppSelector } from "__hooks__/redux";

interface MovieDetailsProps {}

export const MovieDetails: React.FC<MovieDetailsProps> = ({}) => {
  const params: Readonly<Params<string>> = useParams();
  console.log(params);
  const movie: MovieState = useAppSelector(selectMovie(params.id));
  console.log(movie);
  return (
    <div className="movie-details-container">
      <Movie
        src={movie.poster_path}
        title={movie.title}
        date={movie.release_date}
        genres={movie.genres}
        duration={movie.runtime}
        overview={movie.overview}
        officialSitePath={movie.homepage}
      />
      <div className="review-section">
        <h2>Your Review</h2>
        <Rating value={Number(movie.vote_average) / 2} />
      </div>
    </div>
  );
};
