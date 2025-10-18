import { StorageKeys } from "@/constants/config";
import {
  asyncStorageHelper,
  storageHelper,
  useAsyncStorage,
} from "@/services/mmkvStorage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode;
  activeTheme: "light" | "dark";
}

const initialState: ThemeState = {
  mode: "light",
  activeTheme: "light",
};

// async thunk to restore theme from storage
export const restoreThemeAsync = createAsyncThunk(
  "theme/restoreAsync",
  async () => {
    if (useAsyncStorage) {
      // use async storage helper when MMKV is not available
      const savedTheme = await asyncStorageHelper.getString(
        StorageKeys.THEME_MODE
      );
      return savedTheme;
    } else {
      // use synchronous storage helper when MMKV is available
      const savedTheme = storageHelper.getString(StorageKeys.THEME_MODE);
      return savedTheme;
    }
  }
);

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;

      if (action.payload !== "system") {
        state.activeTheme = action.payload;
      }

      // persist to storage
      storageHelper.setString(StorageKeys.THEME_MODE, action.payload);
    },

    setActiveTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.activeTheme = action.payload;
    },

    toggleTheme: (state) => {
      if (state.mode === "system") {
        state.mode = state.activeTheme === "light" ? "dark" : "light";
      } else {
        state.mode = state.mode === "light" ? "dark" : "light";
      }

      state.activeTheme = state.mode === "dark" ? "dark" : "light";

      // persist to storage
      storageHelper.setString(StorageKeys.THEME_MODE, state.mode);
    },
    restoreTheme: (state) => {
      const savedTheme = storageHelper.getString(StorageKeys.THEME_MODE);

      console.log("Restoring theme from storage:", savedTheme);

      if (savedTheme) {
        state.mode = savedTheme as ThemeMode;
        state.activeTheme =
          savedTheme === "system" ? "light" : (savedTheme as "light" | "dark");
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(restoreThemeAsync.fulfilled, (state, action) => {
      const savedTheme = action.payload;

      console.log("Restoring theme from storage:", savedTheme);

      if (
        savedTheme === "light" ||
        savedTheme === "dark" ||
        savedTheme === "system"
      ) {
        state.mode = savedTheme;
        state.activeTheme = savedTheme === "system" ? "light" : savedTheme;
      }
    });
  },
});

export const { setThemeMode, setActiveTheme, toggleTheme, restoreTheme } =
  themeSlice.actions;
export default themeSlice.reducer;
