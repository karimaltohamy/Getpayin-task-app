import { BorderRadius, Colors, Spacing, Typography } from "@/constants/theme";
import { useAppSelector } from "@/store/hooks";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HeroSection = () => {
  const user = useAppSelector((state) => state.auth.user);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.heroSection}>
      <View style={[styles.statusBarSpace, { height: insets.top + 10 }]} />
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Hello, {user?.username}!</Text>
        <Text style={styles.heroTitle}>Discover Amazing Products</Text>
        <Text style={styles.heroSubtitle}>
          Browse through our collection of quality items
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroSection: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xl + Spacing.md,
    borderBottomRightRadius: BorderRadius.xl + Spacing.md,
    marginBottom: Spacing.lg,
  },
  statusBarSpace: {
    backgroundColor: Colors.primary,
  },
  welcomeContainer: {
    marginBottom: Spacing.lg,
  },
  welcomeText: {
    ...Typography.body,
    color: Colors.text.inverse,
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },
  heroTitle: {
    ...Typography.heading1,
    color: Colors.text.inverse,
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    ...Typography.body,
    color: Colors.text.inverse,
    opacity: 0.8,
  },
});

export default HeroSection;
