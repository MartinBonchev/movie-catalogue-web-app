import { Button } from "components";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMovies } from "redux/slices/movieSlice";
import { useAppDispatch } from "__hooks__/redux";
import "./Home.css";
interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchMovies())
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function clickHandler() {
    navigate("/search");
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
        {/* Favourite Movies */}
      </div>
    </div>
  );
};
