import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { auth } from "../../firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { RootState } from "redux/store";

interface User {
  email: string | null;
  accessToken: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface CreateUserRequest {
  email: string;
  password: string;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

export const createUserThunk = createAsyncThunk(
  "users/register",
  async ({ email, password }: CreateUserRequest) => {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return response;
  }
);

export const loginUserThunk = createAsyncThunk(
  "user/login",
  async ({ email, password }: CreateUserRequest) => {
    const response = await signInWithEmailAndPassword(auth, email, password);
    return response;
  }
);

export const logoutUserThunk = createAsyncThunk("user/logout", async () => {
  const response = await signOut(auth);
  return response;
});

// export const loginWithTokenThunk = createAsyncThunk(
//   "user/verifyToken",
//   async () => {
//     const token: string = localStorage.getItem("accessToken") || "";
//     const response = await signInWithCustomToken(auth, token);
//     return response;
//   }
// );

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUserThunk.fulfilled, (state, action: any) => {
        state.user = {
          accessToken: action.payload.user.uid,
          email: action.payload.user.email,
        };
        state.isAuthenticated = true;
      })
      .addCase(createUserThunk.rejected, () => {
        return initialState;
      });
    builder
      .addCase(loginUserThunk.fulfilled, (state, action: any) => {
        state.user = {
          accessToken: action.payload.user.uid,
          email: action.payload.user.email,
        };
        state.isAuthenticated = true;
      })
      .addCase(loginUserThunk.rejected, () => {
        return initialState;
      });
    builder
      .addCase(logoutUserThunk.fulfilled, () => {
        return initialState;
      })
      .addCase(logoutUserThunk.rejected, (state) => {
        return state;
      });
    // builder
    //   .addCase(loginWithTokenThunk.fulfilled, (state, action: any) => {

    //     state.user = {
    //       accessToken: action.payload.user.uid,
    //       email: action.payload.user.email,
    //     };
    //     state.isAuthenticated = true;
    //   })
    //   .addCase(loginWithTokenThunk.rejected, () => {
    //     return initialState;
    //   });
  },
});

const selectAuthState = (state: RootState) => {
  return state.userData;
};
export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (state) => {
    return state.isAuthenticated;
  }
);

export const selectUser = createSelector([selectAuthState], (state) => {
  return state.user;
});

export default authSlice.reducer;
