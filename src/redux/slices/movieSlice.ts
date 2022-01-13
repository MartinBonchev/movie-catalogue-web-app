import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { database } from "../../firebase.config";
import { collection, getDocs } from "firebase/firestore";

const MOVIE_API_KEY = "9ba406ea4c973d65f9dedc0fea8f449f";
const BASE_URL = "https://api.themoviedb.org/3/trending/movie/";

interface MoviesListState {
  movies: {};
  favourites: {};
}

export interface MovieState {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string;
  genres: Array<string>;
  runtime: number;
  homepage: string;
  vote_average: number;
}

interface FetchedMovieDetailsState {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string;
  genres: Array<GenreState>;
  runtime: number;
  homepage: string;
  vote_average: number;
}

interface GenreState {
  id: number;
  name: string;
}

const initialState: MoviesListState = {
  movies: {},
  favourites: {},
};

const getGenres = (genresArr: Array<GenreState>): Array<string> => {
  return genresArr.reduce((acc: Array<string>, curr: GenreState) => {
    acc.push(curr.name);
    return acc;
  }, []);
};

export const fetchMovies = createAsyncThunk("movies", async () => {
  const moviesListResponse: { data: { results: [] } } = await axios.get(
    `https://api.themoviedb.org/3/trending/movie/day?api_key=${MOVIE_API_KEY}`
  );

  let moviesDetailsResponse: MovieState[] = [];
  for (let i = 0; i < moviesListResponse.data.results.length; i++) {
    const fetchedMovie: { id: number } = moviesListResponse.data.results[i];
    const data: { data: FetchedMovieDetailsState } = await axios.get(
      `https://api.themoviedb.org/3/movie/${fetchedMovie.id}?api_key=9ba406ea4c973d65f9dedc0fea8f449f`
    );
    const movieDetails: FetchedMovieDetailsState = data.data;
    moviesDetailsResponse.push({
      id: movieDetails.id,
      title: movieDetails.title,
      release_date: movieDetails.release_date,
      overview: movieDetails.overview,
      poster_path: movieDetails.poster_path,
      genres: getGenres(movieDetails.genres),
      runtime: movieDetails.runtime,
      homepage: movieDetails.homepage,
      vote_average: movieDetails.vote_average,
    });
  }

  return moviesDetailsResponse;
});

export const fetchFavouritesThunk = createAsyncThunk(
  "movies/favourites",
  async () => {
    const favouritesCollection = collection(database, "favourites");
    const response = await getDocs(favouritesCollection);
    return response.docs.map((doc) => ({ ...doc.data(), movie_id: doc.id }));
  }
);

const fetchMoviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, () => {
        return initialState;
      });
    builder
      .addCase(fetchFavouritesThunk.fulfilled, (state, action) => {
        state.favourites = { list: action.payload };
      })
      .addCase(fetchFavouritesThunk.rejected, () => {
        return initialState;
      });
  },
});

const selectMovies = (state: any) => {
  return state.moviesData;
};

export const selectMoviesList = createSelector([selectMovies], (state) => {
  return state.movies;
});

export const selectFavouritesList = createSelector([selectMovies], (state) => {
  return state.favourites;
});

export const selectMovie = (id: any) => {
  return createSelector([selectMovies], (state) => {
    return state.movies.find((el: MovieState) => {
      console.log(el.id, id);
      return el.id === Number(id);
    });
  });
};

export default fetchMoviesSlice.reducer;
