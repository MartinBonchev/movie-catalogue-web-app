import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
} from "@reduxjs/toolkit";
import { auth } from "../../firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { RootState } from "redux/store";

interface User {
  user_id: string | null;
  email: string | null;
}

interface CreateUserRequest {
  email: string;
  password: string;
}

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

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<User>) => {
      state.user = payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUserThunk.fulfilled, (state, action: any) => {
        state.user = {
          user_id: action.payload.user.uid,
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
          user_id: action.payload.user.uid,
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
  },
});

export const { setUser } = authSlice.actions;

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
