import { useTheme } from "@/hooks/useTheme";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const { mode, updateActiveTheme, activeTheme } = useTheme();

  useEffect(() => {
    // update active theme based on system color scheme
    if (mode === "system") {
      const newTheme = systemColorScheme === "dark" ? "dark" : "light";
      updateActiveTheme(newTheme);
    } else {
      updateActiveTheme(mode);
    }
  }, [mode, systemColorScheme, updateActiveTheme, activeTheme]);

  return <>{children}</>;
}
