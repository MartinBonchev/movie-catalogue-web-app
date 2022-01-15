import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "redux/store";

import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { database } from "config/firebase.config";

export interface CommentResponse {
  external_movie_id: number;
  comments: CommentState[];
  comment_id: string;
}

export interface CommentStartingState
  extends Omit<CommentResponse, "comment_id"> {}

interface CommentState {
  email: string | null | undefined;
  comment: string;
}

interface CommentsState {
  commentsList: CommentResponse[];
}

const initialState: CommentsState = {
  commentsList: [],
};

const commentsFirebaseCollection = collection(database, "comments");

export const fetchCommentsThunk = createAsyncThunk(
  "comments/fetch",
  async () => {
    const response = await getDocs(commentsFirebaseCollection);

    return response.docs.map(
      (doc) => ({ ...doc.data(), comment_id: doc.id } as CommentResponse)
    );
  }
);

export const addCommentIfNoneThunk = createAsyncThunk(
  "comments/add-if-none",
  async ({
    newCommentSectionData,
  }: {
    newCommentSectionData: CommentStartingState;
  }) => {
    const { id } = await addDoc(commentsFirebaseCollection, {
      ...newCommentSectionData,
    });
    return {
      ...newCommentSectionData,
      comment_id: id,
    };
  }
);

export const addCommentThunk = createAsyncThunk(
  "comment/add",
  async ({
    comment,
    movieComments,
  }: {
    comment: CommentState;
    movieComments: CommentResponse;
  }) => {
    const commentDoc = doc(
      commentsFirebaseCollection,
      movieComments.comment_id
    );
    await updateDoc(commentDoc, {
      comments: arrayUnion(comment),
    });
    return { external_movie_id: movieComments.external_movie_id, comment };
  }
);

const commentsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsThunk.fulfilled, (state, { payload }) => {
        state.commentsList = payload;
      })
      .addCase(fetchCommentsThunk.rejected, (state) => {
        state.commentsList = [];
      })
      .addCase(addCommentIfNoneThunk.fulfilled, (state, { payload }) => {
        state.commentsList.push({
          comments: payload.comments,
          external_movie_id: payload.external_movie_id,
          comment_id: payload.comment_id,
        });
      })
      .addCase(addCommentIfNoneThunk.rejected, (state) => {
        return state;
      })
      .addCase(addCommentThunk.fulfilled, (state, { payload }) => {
        const commentSectionIndex: number = state.commentsList.findIndex(
          (list) => list.external_movie_id === payload.external_movie_id
        );
        state.commentsList[commentSectionIndex].comments.push(payload.comment);
      });
  },
});

const selectComments = (state: RootState) => {
  return state.commentsData;
};

export const selectCommentsList = (external_id: number) => {
  return createSelector([selectComments], ({ commentsList }) => {
    if (commentsList.length === 0) return;
    const movieComments = commentsList.find((list) => {
      return list.external_movie_id === external_id;
    });

    return movieComments;
  });
};

export default commentsSlice.reducer;
