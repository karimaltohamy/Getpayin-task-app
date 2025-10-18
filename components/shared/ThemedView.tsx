import { useTheme } from "@/hooks/useTheme";
import { View as RNView, ViewProps } from "react-native";

interface ThemedViewProps extends ViewProps {
  variant?: "primary" | "secondary" | "tertiary" | "card";
}

export function View({
  variant = "primary",
  style,
  ...props
}: ThemedViewProps) {
  const { colors } = useTheme();

  const backgroundColor =
    variant === "card" ? colors.card : colors.background[variant];

  return <RNView style={[{ backgroundColor }, style]} {...props} />;
}
