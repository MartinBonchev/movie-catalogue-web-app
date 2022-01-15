import { Button } from "components";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchFavouritesThunk,
  selectFavoriteMovies,
} from "redux/slices/movieSlice";
import { Page } from "layout/Page/Page";
import { useAppDispatch, useAppSelector } from "__hooks__/redux";
import "./Home.css";
import { selectUser } from "redux/slices/authSlice";
interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  const favourites = useAppSelector(selectFavoriteMovies);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    dispatch(fetchFavouritesThunk(user?.user_id));
  }, []);

  function navigateToSearch() {
    navigate("/search");
  }

  function navigateToMovieDetails(id: number) {
    navigate(`/movie/movie-title/${id}`);
  }

  return (
    <Page>
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
              onClick={navigateToSearch}
            >
              Search
            </Button>
          </div>
        </div>
        <div className="favourite-section-container">
          <h1>Your Favourites</h1>
          <div className="favourites-container">
            {favourites.map(({ external_id, poster_path }) => (
              <div
                onClick={() => navigateToMovieDetails(external_id)}
                className="favourtie-movie-container"
                key={external_id}
              >
                <img
                  height={300}
                  width={200}
                  src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
};
