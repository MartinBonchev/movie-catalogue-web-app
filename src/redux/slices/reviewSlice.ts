import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "redux/store";

import { database } from "config/firebase.config";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { stat } from "fs";

interface ReviewResponse {
  external_movie_id: number;
  vote_average: number;
  review_id: string;
}

interface ReviewState {
  reviews: ReviewResponse[];
}

const initialState: ReviewState = {
  reviews: [],
};

const reviewsFirebaseCollection = collection(database, "reviews");

export const fetchReviewsThunk = createAsyncThunk("reviews/fetch", async () => {
  const response = await getDocs(reviewsFirebaseCollection);
  return response.docs.map(
    (doc) => ({ ...doc.data(), review_id: doc.id } as ReviewResponse)
  );
});

export const addChangeReviewThunk = createAsyncThunk(
  "reviews/add",
  async ({
    review,
    movieHasReview,
  }: {
    review: ReviewResponse;
    movieHasReview: boolean;
  }) => {
    if (!movieHasReview) {
      const { id } = await addDoc(reviewsFirebaseCollection, { ...review });
      return { ...review, review_id: id };
    } else {
      const reviewDoc = doc(reviewsFirebaseCollection, review.review_id);
      const newFields = { vote_average: review.vote_average };
      await updateDoc(reviewDoc, newFields);
      return { ...review };
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsThunk.fulfilled, (state, { payload }) => {
        state.reviews = payload;
        console.log(state.reviews);
      })
      .addCase(fetchReviewsThunk.rejected, (state) => {
        state.reviews = [];
      })
      .addCase(addChangeReviewThunk.fulfilled, (state, { payload }) => {
        const isReviewContained = state.reviews.some(
          (review) => review.external_movie_id === payload.external_movie_id
        );
        if (!isReviewContained) {
          state.reviews.push(payload);
        } else {
          const reviewIndex: number = state.reviews.findIndex(
            (review) => review.external_movie_id === payload.external_movie_id
          );
          state.reviews[reviewIndex] = payload;
        }
      })
      .addCase(addChangeReviewThunk.rejected, (state) => {
        return state;
      });
  },
});

//   export const addRatingThunk = createAsyncThunk(
//     "movie/reviews/add",
//     async ({ review, currMovie }: any) => {
//       // const currReview = currMovie.find((el: any) => el.id === review.id);
//       // if (currReview !== undefined) {
//       //   await addDoc(reviewsFirebaseCollection, { ...review });
//       // } else {
//       //   const reviewDoc = doc(database, "movie-review-info", review.id);
//       //   const newReview = (review.vote_average + currMovie.vote_average) / 2;
//       //   const newFields = { vote_average: newReview };
//       //   await updateDoc(reviewDoc, newFields);
//       // }
//     }
//   );
const selectReviews = (state: RootState) => {
  return state.reviewData;
};

export const selectReviewsList = createSelector(
  [selectReviews],
  ({ reviews }) => {
    return reviews;
  }
);

export const selectReview = (id: number) => {
  return createSelector([selectReviews], (state: ReviewState):
    | ReviewResponse
    | undefined => {
    const review: ReviewResponse | undefined = state.reviews.find(
      (review: ReviewResponse) => {
        return review.external_movie_id === id;
      }
    );
    return review;
  });
};

export default reviewSlice.reducer;
