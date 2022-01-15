import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { RootState } from "redux/store";

import { database } from "../../firebase.config";

const MOVIE_API_KEY = "9ba406ea4c973d65f9dedc0fea8f449f";

const favouritesFirebaseCollection = collection(database, "favourites");
const reviewsFirebaseCollection = collection(database, "movie-review-info");
interface CommentState {
  email: string;
  comment: string;
}

interface ReviewState {
  coments: CommentState[];
  external_id: string;
  vote_average: string;
}

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
    `https://api.themoviedb.org/3/trending/movies/day?api_key=${MOVIE_API_KEY}`
  );

  const trendingMovies: MovieResponse[] = response.data.results.map(
    (r: any) => {
      const trendingMovie: MovieResponse = {
        external_id: r.id,
        genres: r.genre_ids,
        overview: r.overview,
        poster_path: r.poster_path,
        release_date: r.release_date,
        title: r.title || r.name,
        vote_average: r.vote_average,
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
      `https://api.themoviedb.org/3/movie/${id}?api_key=${MOVIE_API_KEY}`
    );
    const data = response.data;
    const movie: MovieResponse = {
      external_id: data.id,
      title: data.title,
      release_date: data.release_date,
      overview: data.overview,
      poster_path: data.poster_path,
      genres: data.genres.map((el: { id: number }) => el.id),
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
      `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${MOVIE_API_KEY}`
    );
    const movies: MovieResponse[] = response.data.results.map((r: any) => {
      const movie: MovieResponse = {
        external_id: r.id,
        genres: r.genre_ids,
        overview: r.overview,
        poster_path: r.poster_path,
        release_date: r.release_date,
        title: r.title,
        vote_average: r.vote_average,
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

export const fetchReviewsThunk = createAsyncThunk("movie/reviews", async () => {
  const response = await getDocs(reviewsFirebaseCollection);
  return response.docs.map((doc) => ({ ...doc.data(), review_id: doc.id }));
});

export const addRatingThunk = createAsyncThunk(
  "movie/reviews/add",
  async ({ review, currMovie }: any) => {
    const currReview = currMovie.find((el: any) => el.id === review.id);
    if (currReview !== undefined) {
      await addDoc(reviewsFirebaseCollection, { ...review });
    } else {
      const reviewDoc = doc(database, "movie-review-info", review.id);
      const newReview = (review.vote_average + currMovie.vote_average) / 2;
      const newFields = { vote_average: newReview };
      await updateDoc(reviewDoc, newFields);
    }
  }
);

export const addCommentThunk = createAsyncThunk(
  "movie/reviews/add",
  async ({ review, currMovie }: any) => {
    const currReview = currMovie.find((el: any) => el.id === review.id);
    console.log(currReview);
    if (currReview !== undefined) {
      await addDoc(reviewsFirebaseCollection, { ...review });
    } else {
      const reviewDoc = doc(database, "movie-review-info", review.id);
      const newFields = {
        coment: {
          email: review.email,
          comment: review.comment,
        },
      };
      await updateDoc(reviewDoc, newFields);
    }
  }
);

interface MovieState {
  trendingMovies: MovieResponse[];
  searchResults: MovieResponse[];
  favourites: FavouriteMovie[];
  reviews: [];
}

const initialState: MovieState = {
  trendingMovies: [],
  searchResults: [],
  favourites: [],
  reviews: [],
};

const fetchMoviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingMoviesThunk.fulfilled, (state, action) => {
        const getTrendingMovies = action.payload.map((el) => {
          const isFavorite = state.favourites.find((e) => {
            return e.external_id === el.external_id;
          });
          return isFavorite ? { ...el, id: isFavorite.id } : el;
        });

        state.trendingMovies = getTrendingMovies;
      })
      .addCase(fetchTrendingMoviesThunk.rejected, (state) => {
        state.trendingMovies = [];
      })
      .addCase(searchMoviesByQueryThunk.fulfilled, (state, action) => {
        const searchedMovies = action.payload.map((el) => {
          const isFavorite = state.favourites.find((e) => {
            return e.external_id === el.external_id;
          });
          return isFavorite ? { ...el, id: isFavorite.id } : el;
        });

        state.searchResults = searchedMovies;
      })
      .addCase(searchMoviesByQueryThunk.rejected, (state) => {
        state.searchResults = [];
      })
      .addCase(fetchFavouritesThunk.fulfilled, (state, action) => {
        state.favourites = action.payload;
      })
      .addCase(fetchFavouritesThunk.rejected, (state) => {
        state.favourites = [];
      })
      .addCase(deleteToFavouritesThunk.fulfilled, (state, action) => {
        state.favourites = state.favourites.filter(
          (el) => el.id !== action.payload
        );
      })
      .addCase(fetchReviewsThunk.fulfilled, (state, action) => {
        // state.reviews = action.payload;
      })
      .addCase(fetchReviewsThunk.rejected, (state) => {
        state.reviews = [];
      });
  },
});

const selectMoviesState = (state: RootState) => {
  return state.moviesData;
};

export const selectTrendingMovies = createSelector(
  [selectMoviesState],
  (state) => {
    return state.trendingMovies;
  }
);

export const selectSearchResults = createSelector(
  [selectMoviesState],
  (state) => {
    return state.searchResults;
  }
);

export const selectFavoriteMovies = createSelector(
  [selectMoviesState],
  (state) => {
    return state.favourites;
  }
);

export const selectReviewsList = createSelector(
  [selectMoviesState],
  (state) => {
    return state.reviews;
  }
);

export const selectReview = (id: number) => {
  return createSelector([selectMoviesState], (state: any) => {
    const review = state.reviews.list.find((el: any) => {
      return Number(el.id) === Number(id);
    });
    if (review !== undefined) return review || [];
  });
};

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
