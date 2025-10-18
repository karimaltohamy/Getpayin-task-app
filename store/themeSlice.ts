import { StorageKeys } from "@/constants/config";
import { storageHelper } from "@/services/mmkvStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode;
  activeTheme: "light" | "dark";
}

// Get initial theme from storage
const getInitialTheme = (): ThemeMode => {
  try {
    const savedTheme = storageHelper.getString(StorageKeys.THEME_MODE);
    if (
      savedTheme === "light" ||
      savedTheme === "dark" ||
      savedTheme === "system"
    ) {
      return savedTheme;
    }
  } catch (error) {
    console.error("Error loading theme from storage:", error);
  }
  return "system";
};

const initialState: ThemeState = {
  mode: getInitialTheme(),
  activeTheme: "dark",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;

      // persist to storage
      try {
        storageHelper.setString(StorageKeys.THEME_MODE, action.payload);
      } catch (error) {
        console.error("Error saving theme to storage:", error);
      }
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
      try {
        storageHelper.setString(StorageKeys.THEME_MODE, state.mode);
      } catch (error) {
        console.error("Error saving theme to storage:", error);
      }
    },
  },
});

export const { setThemeMode, setActiveTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
