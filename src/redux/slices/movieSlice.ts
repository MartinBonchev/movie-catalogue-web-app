import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { AsyncLocalStorage } from "async_hooks";
import axios from "axios";
import { Movie } from "components";
import { SSL_OP_LEGACY_SERVER_CONNECT } from "constants";
import { Params } from "react-router";

const MOVIE_API_KEY = "9ba406ea4c973d65f9dedc0fea8f449f";
const BASE_URL = "https://api.themoviedb.org/3/trending/movie/";

interface MoviesListState {
  movies: {};
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
  },
});

const selectMovies = (state: any) => {
  return state.moviesData;
};

export const selectMoviesList = createSelector([selectMovies], (state) => {
  return state.movies;
});

export const selectMovie = (id: any) => {
  return createSelector([selectMovies], (state) => {
    return state.movies.find((el: MovieState) => {
      return el.id === Number(id);
    });
  });
};

export default fetchMoviesSlice.reducer;
