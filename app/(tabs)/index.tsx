import HeroSection from "@/components/HeroSection";
import ProductSection from "@/components/products/ProductSection";
import { BorderRadius, Colors, Spacing, Typography } from "@/constants/theme";
import { useAppSelector } from "@/store/hooks";
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const { user } = useAppSelector((state) => state.auth);

  console.log("Logged in user:", user);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent
      />
      <ProductSection HeroComponent={HeroSection} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
