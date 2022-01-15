import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "redux/store";

import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { database } from "config/firebase.config";

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

export const addChangeReviewIfNoneThunk = createAsyncThunk(
  "reviews/add",
  async ({ review }: { review: ReviewResponse }) => {
    const { id } = await addDoc(reviewsFirebaseCollection, { ...review });
    return { ...review, review_id: id };
  }
);

export const addChangeReviewIfSomeThunk = createAsyncThunk(
  "reviews/change",
  async ({ review }: { review: ReviewResponse }) => {
    const reviewDoc = doc(reviewsFirebaseCollection, review.review_id);
    const newFields = { vote_average: review.vote_average };
    await updateDoc(reviewDoc, newFields);
    return { ...review };
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
      })
      .addCase(fetchReviewsThunk.rejected, (state) => {
        state.reviews = [];
      })
      .addCase(addChangeReviewIfNoneThunk.fulfilled, (state, { payload }) => {
        state.reviews.push(payload);
      })
      .addCase(addChangeReviewIfNoneThunk.rejected, (state) => {
        return state;
      })
      .addCase(addChangeReviewIfSomeThunk.fulfilled, (state, { payload }) => {
        const reviewIndex: number = state.reviews.findIndex(
          (review) => review.external_movie_id === payload.external_movie_id
        );
        state.reviews[reviewIndex] = payload;
      })
      .addCase(addChangeReviewIfSomeThunk.rejected, (state) => {
        return state;
      });
  },
});

const selectReviews = (state: RootState) => {
  return state.reviewsData;
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
