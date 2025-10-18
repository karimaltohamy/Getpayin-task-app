import { DarkColors, LightColors } from "@/constants/theme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { ThemeMode } from "@/store/themeSlice";
import { setActiveTheme, setThemeMode, toggleTheme } from "@/store/themeSlice";
import { useCallback } from "react";

export function useTheme() {
  const dispatch = useAppDispatch();
  const { mode, activeTheme } = useAppSelector((state) => state.theme);

  // get theme colors
  const colors = activeTheme === "dark" ? DarkColors : LightColors;

  const isDarkMode = activeTheme === "dark";

  // change theme mode
  const changeThemeMode = useCallback(
    (newMode: ThemeMode) => {
      dispatch(setThemeMode(newMode));
    },
    [dispatch]
  );

  // toggle theme mode
  const toggleThemeMode = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  // update active theme
  const updateActiveTheme = useCallback(
    (theme: "light" | "dark") => {
      dispatch(setActiveTheme(theme));
    },
    [dispatch]
  );

  return {
    mode,
    activeTheme,
    isDarkMode,
    colors,
    changeThemeMode,
    toggleThemeMode,
    updateActiveTheme,
  };
}
