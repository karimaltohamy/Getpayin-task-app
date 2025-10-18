import { StyleSheet } from "react-native";
import { BorderRadius, Colors, Shadows, Spacing, Typography } from "./theme";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },

  containerPadding: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    padding: Spacing.md,
  },

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  shadow: {
    ...Shadows.md,
  },

  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.md,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border.medium,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.sizes.md,
    backgroundColor: Colors.background.primary,
    color: Colors.text.primary,
  },

  inputError: {
    borderColor: Colors.error,
  },

  button: {
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  buttonText: {
    color: Colors.text.inverse,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },

  buttonSecondary: {
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.medium,
  },

  buttonSecondaryText: {
    color: Colors.text.primary,
  },

  buttonDisabled: {
    backgroundColor: Colors.disabled,
    opacity: 0.6,
  },

  textPrimary: {
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
    fontWeight: Typography.weights.regular,
  },

  textSecondary: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  },

  textError: {
    fontSize: Typography.sizes.sm,
    color: Colors.error,
    marginTop: Spacing.xs,
  },

  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },

  subtitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing.md,
  },
});
