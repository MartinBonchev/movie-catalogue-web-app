import React, { useEffect, useState } from "react";
import { Rating, TextareaAutosize, Typography } from "@mui/material";
import { Params, useParams } from "react-router";

import { selectUser } from "redux/slices/authSlice";
import { getMovieByIdThunk, MovieResponse } from "redux/slices/movieSlice";
import { useAppDispatch, useAppSelector } from "__hooks__/redux";

import {
  addChangeReviewIfNoneThunk,
  addChangeReviewIfSomeThunk,
  fetchReviewsThunk,
  selectReview,
  selectReviewsList,
} from "redux/slices/reviewSlice";
import {
  addCommentIfNoneThunk,
  addCommentThunk,
  CommentResponse,
  CommentStartingState,
  fetchCommentsThunk,
  selectCommentsList,
} from "redux/slices/commentsSlice";

import { Button, Movie } from "components";
import { Page } from "containers/Page/Page";
import "./MovieDetails.css";

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
  const movieComments = useAppSelector(selectCommentsList(Number(params.id)));
  const user = useAppSelector(selectUser);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    async function getMovieById() {
      const movie = await dispatch(getMovieByIdThunk(Number(params.id)));
      setMovie(movie.payload as MovieResponse);
    }
    dispatch(fetchReviewsThunk());
    dispatch(fetchCommentsThunk());
    getMovieById();
  }, []);

  const addCommentIfNone = (
    comment: string,
    email: string | null | undefined
  ) => {
    if (user === null) return;
    const newCommentSection: CommentStartingState = {
      external_movie_id: Number(params.id),
      comments: [{ email: email, comment: comment }],
    };
    dispatch(
      addCommentIfNoneThunk({
        newCommentSectionData: newCommentSection,
      })
    );
    setComment("");
  };

  const addCommentIfSome = (
    comment: string,
    email: string | null | undefined,
    movieComments: CommentResponse
  ) => {
    dispatch(addCommentThunk({ comment: { email, comment }, movieComments }));
    setComment("");
  };

  const addComment = (comment: string) => {
    if (comment === "") return;
    if (movieComments !== undefined && user !== undefined)
      addCommentIfSome(comment, user?.email, movieComments);
    else addCommentIfNone(comment, user?.email);
  };

  const changeCurrentRating = (vote_average: number) => {
    const rating = vote_average * 2;
    const newRating: number = (rating + movie?.vote_average!) / 2;
    dispatch(
      addChangeReviewIfSomeThunk({
        review: {
          ...movieReview!,
          external_movie_id: movie?.external_id!,
          vote_average: newRating,
        },
      })
    );
  };

  const addRating = (vote_average: number) => {
    dispatch(
      addChangeReviewIfNoneThunk({
        review: {
          ...movieReview!,
          external_movie_id: movie?.external_id!,
          vote_average: (vote_average * 2 + movie?.vote_average!) / 2,
        },
      })
    );
  };

  const changeRating = (vote_average: number) => {
    const movieHasReview = !!reviewList.find(
      ({ external_movie_id }) => external_movie_id === movie?.external_id
    );

    if (movieHasReview) changeCurrentRating(vote_average);
    else addRating(vote_average);
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
              if (newValue !== null) changeRating(newValue);
            }}
          />
          <TextareaAutosize
            style={{ ...textareaStyles }}
            placeholder="Your private notes and comments about the movie"
            onChange={(event) => {
              setComment(event.target.value);
            }}
            value={comment}
          />
          <Button onClick={() => addComment(comment)}>Add Comment</Button>
          <div className="comment-section-container">
            {movieComments && movieComments.comments.length > 0
              ? movieComments.comments.map(({ email, comment }, i) => (
                  <div className="comment-container" key={i}>
                    <Typography>Email: {email}</Typography>
                    <Typography>comment: {comment}</Typography>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </Page>
  );
};
