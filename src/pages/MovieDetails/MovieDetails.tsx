import { Rating, TextareaAutosize } from "@mui/material";

import { Movie } from "components";
import React from "react";
import { Params, useParams } from "react-router";
import { MovieState, selectMovie } from "redux/slices/movieSlice";
import { useAppSelector } from "__hooks__/redux";
import "./MovieDetails.css";
interface MovieDetailsProps {}

const textareaStyles = {
  height: 200,
  width: 500,
  borderWidth: 0.5,
  borderColor: "grey",
  borderRadius: 10,
  padding: 10,
};

export const MovieDetails: React.FC<MovieDetailsProps> = ({}) => {
  const params: Readonly<Params<string>> = useParams();

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
        <p className="review-heading">Your Review</p>
        <Rating value={Number(movie.vote_average) / 2} />
        <TextareaAutosize
          style={{ ...textareaStyles }}
          placeholder="Your private notes and comments about the movie"
        />
      </div>
    </div>
  );
};
