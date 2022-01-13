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

const MOVIE_API_KEY = "9ba406ea4c973d65f9dedc0fea8f449f";
const BASE_URL = "https://api.themoviedb.org/3/trending/movie/";

interface MoviesListState {
  movies: {};
  favourites: {};
  reviews: {};
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

interface MovieComponentState extends Omit<MovieState, "vote_average"> {}

interface FavouriteMoviesState extends MovieComponentState {
  movie_id: string;
}

const initialState: MoviesListState = {
  movies: {},
  favourites: {},
  reviews: {},
};

const favouritesCollection = collection(database, "favourites");
const reviewsCollection = collection(database, "movie-review-info");

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
    const response = await getDocs(favouritesCollection);
    return response.docs.map((doc) => ({ ...doc.data(), movie_id: doc.id }));
  }
);

export const addToFavouritesThunk = createAsyncThunk(
  "movie/favourites/add",
  async (movie: MovieComponentState) => {
    await addDoc(favouritesCollection, { ...movie });
  }
);

export const deleteToFavouritesThunk = createAsyncThunk(
  "movie/favourites/delete",
  async (movieId: string) => {
    const movieDoc = doc(database, "favourites", movieId);
    await deleteDoc(movieDoc);
  }
);

export const fetchReviewsThunk = createAsyncThunk("movie/reviews", async () => {
  const response = await getDocs(reviewsCollection);
  return response.docs.map((doc) => ({ ...doc.data(), review_id: doc.id }));
});

export const addRatingThunk = createAsyncThunk(
  "movie/reviews/add",
  async ({ review, currMovie }: any) => {
    console.log("asjdbnaskjdbn");
    const currReview = currMovie.find((el: any) => el.id === review.id);
    if (currReview !== undefined) {
      console.log({ ...review });
      await addDoc(reviewsCollection, { ...review });
    } else {
      const reviewDoc = doc(database, "movie-review-info", review.id);
      const newReview = (review.vote_average + currMovie.vote_average) / 2;
      const newFields = { vote_average: newReview };
      console.log(newFields);
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
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state) => {
        return { ...state, movies: {} };
      });
    builder
      .addCase(fetchFavouritesThunk.fulfilled, (state, action) => {
        state.favourites = { list: action.payload };
      })
      .addCase(fetchFavouritesThunk.rejected, (state) => {
        return { ...state, favourites: {} };
      });
    builder
      .addCase(fetchReviewsThunk.fulfilled, (state, action) => {
        state.reviews = { list: action.payload };
      })
      .addCase(fetchReviewsThunk.rejected, (state) => {
        return { ...state, reviews: {} };
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

export const selectReviewsList = createSelector([selectMovies], (state) => {
  return state.reviews;
});

export const selectReview = (id: number) => {
  return createSelector([selectMovies], (state) => {
    const review = state.reviews.list.find((el: any) => {
      return Number(el.id) === Number(id);
    });
    if (review !== undefined) return review || [];
  });
};

export const selectMovie = (id: any) => {
  return createSelector([selectMovies], (state) => {
    return state.movies.find((el: MovieState) => {
      return Number(el.id) === Number(id);
    });
  });
};

export default fetchMoviesSlice.reducer;
