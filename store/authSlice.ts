import { AuthState, User } from "@/api/auth/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StorageKeys } from "../constants/config";
import {
  asyncStorageHelper,
  storageHelper,
  useAsyncStorage,
} from "../services/mmkvStorage";

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
};

// async thunk to restore auth from storage
export const restoreAuthAsync = createAsyncThunk(
  "auth/restoreAsync",
  async () => {
    if (useAsyncStorage) {
      // use async storage helper when MMKV is not available
      const token = await asyncStorageHelper.getString(StorageKeys.AUTH_TOKEN);
      const refreshToken = await asyncStorageHelper.getString(
        StorageKeys.AUTH_REFRESH_TOKEN
      );
      const user = await asyncStorageHelper.getObject<User>(
        StorageKeys.AUTH_USER
      );
      return { token, refreshToken, user };
    } else {
      // use synchronous storage helper when MMKV is available
      const token = storageHelper.getString(StorageKeys.AUTH_TOKEN);
      const refreshToken = storageHelper.getString(
        StorageKeys.AUTH_REFRESH_TOKEN
      );
      const user = storageHelper.getObject<User>(StorageKeys.AUTH_USER);
      return { token, refreshToken, user };
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    restoreAuth: (state) => {
      const token = storageHelper.getString(StorageKeys.AUTH_TOKEN);
      const refreshToken = storageHelper.getString(
        StorageKeys.AUTH_REFRESH_TOKEN
      );
      const user = storageHelper.getObject<User>(StorageKeys.AUTH_USER);

      if (token && user) {
        state.token = token;
        state.refreshToken = refreshToken || null;
        state.user = user;
        state.isAuthenticated = true;
      }
      state.isLoading = false;
    },

    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        refreshToken?: string;
      }>
    ) => {
      const { user, token, refreshToken } = action.payload;
      storageHelper.setString(StorageKeys.AUTH_TOKEN, token);
      if (refreshToken) {
        storageHelper.setString(StorageKeys.AUTH_REFRESH_TOKEN, refreshToken);
      }
      storageHelper.setObject(StorageKeys.AUTH_USER, user);

      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken || null;
      state.isAuthenticated = true;
      state.isLoading = false;
    },

    updateTokens: (
      state,
      action: PayloadAction<{ token: string; refreshToken: string }>
    ) => {
      const { token, refreshToken } = action.payload;
      storageHelper.setString(StorageKeys.AUTH_TOKEN, token);
      storageHelper.setString(StorageKeys.AUTH_REFRESH_TOKEN, refreshToken);
      state.token = token;
      state.refreshToken = refreshToken;
    },

    logout: (state) => {
      storageHelper.delete(StorageKeys.AUTH_TOKEN);
      storageHelper.delete(StorageKeys.AUTH_REFRESH_TOKEN);
      storageHelper.delete(StorageKeys.AUTH_USER);

      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      storageHelper.setObject(StorageKeys.AUTH_USER, action.payload);
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreAuthAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreAuthAsync.fulfilled, (state, action) => {
        const { token, refreshToken, user } = action.payload;
        if (token && user) {
          state.token = token;
          state.refreshToken = refreshToken || null;
          state.user = user;
          state.isAuthenticated = true;
        }
        state.isLoading = false;
      })
      .addCase(restoreAuthAsync.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  restoreAuth,
  setCredentials,
  updateTokens,
  logout,
  setUser,
  setLoading,
} = authSlice.actions;

export default authSlice.reducer;
