import axios from "axios";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { RootState } from "redux/store";

import { setFavouriteId } from "utils/movie.utils";
import { BASE_URL, MOVIE_API_KEY } from "utils/CONSTANTS";
import { database } from "config/firebase.config";

const favouritesFirebaseCollection = collection(database, "favourites");
const commentsFirebaseCollection = collection(database, "comments");

export interface MovieResponse {
  id?: string;
  external_id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string;
  genres: Array<number>;
  runtime?: number;
  homepage?: string;
  vote_average: number;
}

export interface CreateFavouriteMovie {
  external_id: number;
  poster_path: string;
}

export interface FavouriteMovie extends CreateFavouriteMovie {
  id: string;
}

export const fetchTrendingMoviesThunk = createAsyncThunk("movies", async () => {
  const response = await axios.get(
    `${BASE_URL}/trending/movies/day?api_key=${MOVIE_API_KEY}`
  );

  const trendingMovies: MovieResponse[] = response.data.results.map(
    (result: any) => {
      const trendingMovie: MovieResponse = {
        external_id: result.id,
        genres: result.genre_ids,
        overview: result.overview,
        poster_path: result.poster_path,
        release_date: result.release_date,
        title: result.title || result.name,
        vote_average: result.vote_average,
      };

      return trendingMovie;
    }
  );

  return trendingMovies;
});

export const fetchFavouritesThunk = createAsyncThunk(
  "movies/favourites",
  async () => {
    const response = await getDocs(favouritesFirebaseCollection);
    return response.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as FavouriteMovie[];
  }
);

export const getMovieByIdThunk = createAsyncThunk(
  "movie/get-movie-by-id",
  async (id: number) => {
    const response = await axios.get(
      `${BASE_URL}/movie/${id}?api_key=${MOVIE_API_KEY}`
    );
    const data = response.data;
    const movie: MovieResponse = {
      external_id: data.id,
      title: data.title,
      release_date: data.release_date,
      overview: data.overview,
      poster_path: data.poster_path,
      genres: data.genres.map((genre: { id: number }) => genre.id),
      runtime: data.runtime,
      homepage: data.homepage,
      vote_average: data.vote_average,
    };
    return movie;
  }
);

export const searchMoviesByQueryThunk = createAsyncThunk(
  "movies/by-query",
  async (query: string) => {
    const response = await axios.get(
      `${BASE_URL}/search/movie?query=${query}&api_key=${MOVIE_API_KEY}`
    );
    const movies: MovieResponse[] = response.data.results.map((result: any) => {
      const movie: MovieResponse = {
        external_id: result.id,
        genres: result.genre_ids,
        overview: result.overview,
        poster_path: result.poster_path,
        release_date: result.release_date,
        title: result.title,
        vote_average: result.vote_average,
      };

      return movie;
    });

    return movies;
  }
);

export const addToFavouritesThunk = createAsyncThunk(
  "movie/favourites/add",
  async (movie: CreateFavouriteMovie) => {
    const { id } = await addDoc(favouritesFirebaseCollection, { ...movie });
    return { id, ...movie };
  }
);

export const deleteToFavouritesThunk = createAsyncThunk(
  "movie/favourites/delete",
  async (movieId: string) => {
    const movieDoc = doc(favouritesFirebaseCollection, movieId);

    await deleteDoc(movieDoc);
    return movieId;
  }
);

interface MovieState {
  trendingMovies: MovieResponse[];
  searchResults: MovieResponse[];
  favourites: FavouriteMovie[];
}

const initialState: MovieState = {
  trendingMovies: [],
  searchResults: [],
  favourites: [],
};

const fetchMoviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingMoviesThunk.fulfilled, (state, { payload }) => {
        const getTrendingMovies = setFavouriteId(state.favourites, payload);
        state.trendingMovies = getTrendingMovies;
      })
      .addCase(fetchTrendingMoviesThunk.rejected, (state) => {
        state.trendingMovies = [];
      })
      .addCase(searchMoviesByQueryThunk.fulfilled, (state, { payload }) => {
        const searchedMovies = setFavouriteId(state.favourites, payload);
        state.searchResults = searchedMovies;
      })
      .addCase(searchMoviesByQueryThunk.rejected, (state) => {
        state.searchResults = [];
      })
      .addCase(fetchFavouritesThunk.fulfilled, (state, { payload }) => {
        state.favourites = payload;
      })
      .addCase(fetchFavouritesThunk.rejected, (state) => {
        state.favourites = [];
      })
      .addCase(addToFavouritesThunk.fulfilled, (state, { payload }) => {
        state.favourites.push(payload);
      })
      .addCase(deleteToFavouritesThunk.fulfilled, (state, { payload }) => {
        state.favourites = state.favourites.filter(
          (favourite) => favourite.id !== payload
        );
      });
  },
});

const selectMoviesState = (state: RootState) => {
  return state.moviesData;
};

export const selectTrendingMovies = createSelector(
  [selectMoviesState],
  ({ trendingMovies }) => {
    return trendingMovies;
  }
);

export const selectSearchResults = createSelector(
  [selectMoviesState],
  ({ searchResults }) => {
    return searchResults;
  }
);

export const selectFavoriteMovies = createSelector(
  [selectMoviesState],
  ({ favourites }) => {
    return favourites;
  }
);

export const selectIsFavourite = (id: number) => {
  return createSelector([selectMoviesState], (state: MovieState) => {
    return state.favourites.find((el) => el.external_id === id);
  });
};

export const selectMovie = (id: number) => {
  return createSelector([selectMoviesState], (state: MovieState) => {
    return state.trendingMovies.find((el: MovieResponse) => {
      return Number(el.external_id) === Number(id);
    });
  });
};

export default fetchMoviesSlice.reducer;
