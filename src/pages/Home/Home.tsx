import { Button } from "components";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchFavouritesThunk,
  fetchTrendingMovies,
  fetchReviewsThunk,
  MovieState,
  selectFavouritesList,
} from "redux/slices/movieSlice";
import { useAppDispatch, useAppSelector } from "__hooks__/redux";
import "./Home.css";
interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  const favourites = useAppSelector(selectFavouritesList);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchFavouritesThunk());
  }, []);

  function clickHandler() {
    navigate("/search");
  }

  function viewFavouriteMovie(id: number) {
    navigate(`/movie/movie-title/${id}`);
  }

  return (
    <div className="container">
      <div className="heading-container">
        <div className="inner-heading-container">
          <h1 className="heading">Movie Catalogue</h1>
          <p className="description">
            Here you can see the most popular movies, nowadays. You can add to
            favourites, and search through different genres.
          </p>
          <Button
            variant="contained"
            color="primary"
            onClickHandler={clickHandler}
          >
            Search
          </Button>
        </div>
      </div>
      <div className="favourite-section-container">
        <h1>Your Favourites</h1>
        <div className="favourites-container">
          {favourites.map((el) => (
            <div
              onClick={() => viewFavouriteMovie(el.external_id)}
              className="favourite-movie-container"
              key={el.external_id}
            >
              <img
                height={300}
                width={200}
                src={`https://image.tmdb.org/t/p/w500${el.poster_path}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
