import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import movieSlice from "./slices/movieSlice";
import reviewSlice from "./slices/reviewSlice";

export const store = configureStore({
  reducer: {
    userData: authSlice,
    moviesData: movieSlice,
    reviewData: reviewSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
