import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { database } from "../../firebase.config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { RootState } from "redux/store";
import { getGenres } from "utils/utils";

const MOVIE_API_KEY = "9ba406ea4c973d65f9dedc0fea8f449f";
const BASE_URL = "https://api.themoviedb.org/3/trending/movie/";

interface MoviesListState {
  trendingMovies: MovieState[];
  favourites: FavouriteMovie[];
  reviews: [];
}

export interface MovieState {
  id?: string;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string;
  genres: Array<number>;
  runtime: number;
  homepage: string;
  vote_average: number;
  external_id: number;
}

export interface CreateFavouriteMovie {
  external_id: number;
  poster_path: string;
}
export interface FavouriteMovie extends CreateFavouriteMovie {
  id: string;
}
const initialState: MoviesListState = {
  trendingMovies: [],
  favourites: [],
  reviews: [],
};

const favouritesCollection = collection(database, "favourites");
const reviewsCollection = collection(database, "movie-review-info");

export const fetchTrendingMovies = createAsyncThunk("movies", async () => {
  const response: { data: { results: MovieState[] } } = await axios.get(
    `https://api.themoviedb.org/3/trending/movies/day?api_key=${MOVIE_API_KEY}`
  );
  return response.data.results;
});

export const fetchFavouritesThunk = createAsyncThunk(
  "movies/favourites",
  async () => {
    const response = await getDocs(favouritesCollection);
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
    console.log(response);
    const data = response.data;
    const movie: MovieState = {
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

export const addToFavouritesThunk = createAsyncThunk(
  "movie/favourites/add",
  async (movie: CreateFavouriteMovie) => {
    console.log(movie);
    const { id } = await addDoc(favouritesCollection, { ...movie });
    return { id, ...movie };
  }
);

export const deleteToFavouritesThunk = createAsyncThunk(
  "movie/favourites/delete",
  async (movieId: string) => {
    const movieDoc = doc(database, "favourites", movieId);

    await deleteDoc(movieDoc);
    return movieId;
  }
);

export const fetchReviewsThunk = createAsyncThunk("movie/reviews", async () => {
  const response = await getDocs(reviewsCollection);
  return response.docs.map((doc) => ({ ...doc.data(), review_id: doc.id }));
});

export const addRatingThunk = createAsyncThunk(
  "movie/reviews/add",
  async ({ review, currMovie }: any) => {
    const currReview = currMovie.find((el: any) => el.id === review.id);
    if (currReview !== undefined) {
      await addDoc(reviewsCollection, { ...review });
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
      await addDoc(reviewsCollection, { ...review });
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

const fetchMoviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        const getTrendingMovies = action.payload.map((el) => {
          const isFavourite = state.favourites.find((e) => {
            return e.external_id === el.external_id;
          });
          return isFavourite ? { ...el, id: isFavourite.id } : el;
        });
        state.trendingMovies = getTrendingMovies;
      })
      .addCase(fetchTrendingMovies.rejected, (state) => {
        state.trendingMovies = [];
      });
    builder
      .addCase(fetchFavouritesThunk.fulfilled, (state, action) => {
        state.favourites = action.payload;
      })
      .addCase(fetchFavouritesThunk.rejected, (state) => {
        state.favourites = [];
      });
    builder.addCase(addToFavouritesThunk.fulfilled, (state, action) => {
      state.favourites.push(action.payload);
    });
    builder.addCase(deleteToFavouritesThunk.fulfilled, (state, action) => {
      state.favourites = state.favourites.filter(
        (el) => el.id !== action.payload
      );
    });
    builder
      .addCase(fetchReviewsThunk.fulfilled, (state, action) => {
        // state.reviews = { list: action.payload };
      })
      .addCase(fetchReviewsThunk.rejected, (state) => {
        state.reviews = [];
      });
  },
});

const selectMovies = (state: RootState) => {
  return state.moviesData;
};

export const selectMoviesList = createSelector([selectMovies], (state) => {
  return state.trendingMovies;
});

export const selectFavouritesList = createSelector([selectMovies], (state) => {
  return state.favourites;
});

export const selectReviewsList = createSelector([selectMovies], (state) => {
  return state.reviews;
});

export const selectReview = (id: number) => {
  return createSelector([selectMovies], (state: any) => {
    const review = state.reviews.list.find((el: any) => {
      return Number(el.id) === Number(id);
    });
    if (review !== undefined) return review || [];
  });
};

export const selectIsFavourite = (id: number) => {
  return createSelector([selectMovies], (state: MoviesListState) => {
    return state.favourites.find((el) => el.external_id === id);
  });
};

export const selectMovie = (id: number) => {
  return createSelector([selectMovies], (state: MoviesListState) => {
    return state.trendingMovies.find((el: MovieState) => {
      return Number(el.external_id) === Number(id);
    });
  });
};

export default fetchMoviesSlice.reducer;
