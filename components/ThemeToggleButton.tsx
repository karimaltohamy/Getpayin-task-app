import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

export function ThemeToggleButton() {
  const { isDarkMode, toggleThemeMode, colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: colors.card,
          borderColor: colors.border.primary,
        },
      ]}
      onPress={toggleThemeMode}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isDarkMode ? "sunny" : "moon"}
        size={22}
        color={colors.text.primary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    width: 40,
    height: 40,
    gap: Spacing.sm,
  },
  buttonText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
});
