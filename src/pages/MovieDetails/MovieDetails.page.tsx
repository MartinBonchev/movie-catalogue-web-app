import React, { useEffect, useState } from "react";
import { Rating, TextareaAutosize } from "@mui/material";
import { Params, useParams } from "react-router";

import { selectUser } from "redux/slices/authSlice";
import { getMovieByIdThunk, MovieResponse } from "redux/slices/movieSlice";
import { useAppDispatch, useAppSelector } from "__hooks__/redux";

import { Button, Movie } from "components";
import { Page } from "layout/Page/Page";
import "./MovieDetails.css";
import {
  addChangeReviewThunk,
  fetchReviewsThunk,
  selectReview,
  selectReviewsList,
} from "redux/slices/reviewSlice";

const textareaStyles = {
  height: 200,
  width: 500,
  borderWidth: 0.5,
  borderColor: "grey",
  borderRadius: 10,
  padding: 10,
};

export const MovieDetails: React.FC = () => {
  const params: Readonly<Params<string>> = useParams();
  const dispatch = useAppDispatch();
  const [movie, setMovie] = useState<MovieResponse | null>(null);
  const movieReview = useAppSelector(selectReview(Number(params.id)));
  const reviewList = useAppSelector(selectReviewsList);
  const user = useAppSelector(selectUser);
  // const reviews = useAppSelector(selectReviewsList);
  const [comment, setComment] = useState("");
  // const getRating = (): number => {
  //   if (reviewState !== undefined && reviewState.vote_average)
  //     return reviewState.vote_average;
  //   return movie.vote_average;
  // };

  useEffect(() => {
    async function getMovieById() {
      const movie = await dispatch(getMovieByIdThunk(Number(params.id)));
      setMovie(movie.payload as MovieResponse);
    }
    dispatch(fetchReviewsThunk());
    getMovieById();
  }, []);

  // const addComment = async () => {
  //   if (!comment) return;
  //   const data = {
  //     email: user?.email,
  //     comment: comment,
  //   };
  //   await dispatch(
  //     addCommentThunk({ review: { ...data, id: movie.id }, currMovie: movie })
  //   );
  //   console.log({ review: { ...data, id: movie.id }, currMovie: movie });
  // };

  const addChangeRating = async (vote_average: number | null) => {
    if (vote_average === null) return;
    const movieHasReview = !!reviewList.find(
      ({ external_movie_id }) => external_movie_id === movie?.external_id
    );

    dispatch(
      addChangeReviewThunk({
        review: {
          ...movieReview!,
          external_movie_id: movie?.external_id!,
          vote_average: (vote_average * 2 + movie?.vote_average!) / 2,
        },
        movieHasReview: movieHasReview,
      })
    );
  };

  return (
    <Page>
      <div className="movie-details-container">
        {movie && (
          <Movie
            external_id={movie.external_id}
            id={movie.id}
            title={movie.title}
            genres={movie.genres}
            poster_path={movie.poster_path}
            runtime={movie.runtime}
            release_date={movie.release_date}
            overview={movie.overview}
            homepage={movie.homepage}
          />
        )}
        <div className="review-section">
          <p className="review-heading">Your Review</p>
          <Rating
            value={
              ((movieReview && movieReview.vote_average) ||
                movie?.vote_average!) / 2
            }
            onChange={(_, newValue: number | null) => {
              addChangeRating(newValue);
            }}
          />
          <TextareaAutosize
            style={{ ...textareaStyles }}
            placeholder="Your private notes and comments about the movie"
            onChange={(event) => {
              setComment(event.target.value);
            }}
          />
          {/* <Button onClick={addComment}>Add Comment</Button> */}
          {/* <div className="comment-section-container">
          {reviewState && reviewState.coments.length > 0
            ? reviewState.coments
                .slice()
                .map((el: { email: string; comment: string }, i: number) => (
                  <div className="comment-container" key={i}>
                    <p>{el.email}</p>
                    <p>{el.comment}</p>
                  </div>
                ))
            : null} 
         </div>  */}
        </div>
      </div>
    </Page>
  );
};
