import { AuthState, User } from "@/api/auth/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StorageKeys } from "../constants/config";
import { storageHelper } from "../services/storage";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;

      // persist to storage
      storageHelper.setString(StorageKeys.AUTH_TOKEN, action.payload.token);
      storageHelper.setObject(StorageKeys.AUTH_USER, action.payload.user);
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      storageHelper.setObject(StorageKeys.AUTH_USER, action.payload);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      // clear storage
      storageHelper.delete(StorageKeys.AUTH_TOKEN);
      storageHelper.delete(StorageKeys.AUTH_USER);
    },

    restoreAuth: (state) => {
      const token = storageHelper.getString(StorageKeys.AUTH_TOKEN);
      const user = storageHelper.getObject<User>(StorageKeys.AUTH_USER);

      if (token && user) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
      }
      state.isLoading = false;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, setUser, logout, restoreAuth, setLoading } =
  authSlice.actions;

export default authSlice.reducer;
