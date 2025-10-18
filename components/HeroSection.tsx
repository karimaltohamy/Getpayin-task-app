import { globalStyles } from "@/constants/styles";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { useAppSelector } from "@/store/hooks";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "./shared/ThemedText";
import { ThemeToggleButton } from "./ThemeToggleButton";

const HeroSection = () => {
  const user = useAppSelector((state) => state.auth.user);
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.heroSection}>
      <View style={[styles.statusBarSpace, { height: insets.top + 10 }]} />
      <View style={styles.welcomeContainer}>
        <View style={globalStyles.rowBetween}>
          <Text variant="inverse" style={styles.welcomeText}>
            Hello, {user?.username}!
          </Text>
          <ThemeToggleButton />
        </View>
        <Text variant="inverse" style={styles.heroTitle}>
          Discover Amazing Products
        </Text>
        <Text variant="inverse" style={styles.heroSubtitle}>
          Browse through our collection of quality items
        </Text>
      </View>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    heroSection: {
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.lg,
      borderBottomLeftRadius: BorderRadius.xl + Spacing.md,
      borderBottomRightRadius: BorderRadius.xl + Spacing.md,
      marginBottom: Spacing.lg,
    },

    statusBarSpace: {
      backgroundColor: colors.primary,
    },
    welcomeContainer: {
      marginBottom: Spacing.lg,
    },
    welcomeText: {
      ...Typography.body,
      opacity: 0.9,
      marginBottom: Spacing.xs,
    },
    heroTitle: {
      ...Typography.heading1,
      marginBottom: Spacing.xs,
    },
    heroSubtitle: {
      ...Typography.body,
      opacity: 0.8,
    },
  });

export default HeroSection;
