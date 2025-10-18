import { useTheme } from "@/hooks/useTheme";
import { Text as RNText, TextProps } from "react-native";

interface ThemedTextProps extends TextProps {
  variant?: "primary" | "secondary" | "tertiary" | "inverse";
}

export function Text({
  variant = "primary",
  style,
  ...props
}: ThemedTextProps) {
  const { colors } = useTheme();

  const color = colors.text[variant];

  return <RNText style={[{ color }, style]} {...props} />;
}
