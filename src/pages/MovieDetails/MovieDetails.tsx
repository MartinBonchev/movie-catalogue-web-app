import { Rating, TextareaAutosize } from "@mui/material";
import { Button, Movie } from "components";
import React, { useEffect, useState } from "react";
import { Params, useParams } from "react-router";
import { selectUser } from "redux/slices/authSlice";
import {
  addCommentThunk,
  addRatingThunk,
  getMovieByIdThunk,
  MovieState,
  selectMovie,
  selectReview,
  selectReviewsList,
} from "redux/slices/movieSlice";
import { useAppDispatch, useAppSelector } from "__hooks__/redux";
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
  const dispatch = useAppDispatch();
  const [movie, setMovie] = useState<MovieState | null>(null);
  // const reviewState = useAppSelector(selectReview(movie.id));
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
      setMovie(movie.payload as MovieState);
    }
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

  // const changeRating = async (value: number | null) => {
  //   if (value !== null)
  //     await dispatch(
  //       addRatingThunk({
  //         review: { id: movie.id, vote_average: value * 2 },
  //         currMovie: movie,
  //       })
  //     );
  // };

  return (
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
        {/* <Rating
          value={getRating() / 2}
          onChange={(_, newValue: number | null) => {
            changeRating(newValue);
          }}
        /> */}
        {/* <TextareaAutosize
          style={{ ...textareaStyles }}
          placeholder="Your private notes and comments about the movie"
          onChange={(event) => {
            setComment(event.target.value);
          }}
        /> */}
        {/* <Button onClickHandler={addComment}>Add Comment</Button> */}
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
        </div> */}
      </div>
    </div>
  );
};
