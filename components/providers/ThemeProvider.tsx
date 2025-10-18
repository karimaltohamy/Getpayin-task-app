import { useTheme } from "@/hooks/useTheme";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const { mode, updateActiveTheme } = useTheme();

  useEffect(() => {
    // update active theme based on system color scheme
    if (mode === "system") {
      updateActiveTheme(systemColorScheme === "dark" ? "dark" : "light");
    } else {
      updateActiveTheme(mode);
    }
  }, [mode, systemColorScheme, updateActiveTheme]);

  return <>{children}</>;
}
