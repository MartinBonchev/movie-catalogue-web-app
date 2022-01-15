import { FavouriteMovie, MovieResponse } from "redux/slices/movieSlice";

export const setFavouriteId = (
  favouriteMovies: FavouriteMovie[],
  movies: MovieResponse[]
) => {
  return movies.map((movie) => {
    const isFavorite = favouriteMovies.find((favourite) => {
      return favourite.external_id === movie.external_id;
    });
    return isFavorite ? { ...movie, id: isFavorite.id } : movie;
  });
};
