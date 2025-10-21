import { BorderRadius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - Spacing.lg * 3) / 2;

export default function ProductSkeleton() {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();
  const styles = createStyles(colors);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnimation]);

  const opacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.image, { opacity }]} />
      <View style={styles.content}>
        <Animated.View style={[styles.category, { opacity }]} />
        <Animated.View style={[styles.title, { opacity }]} />
        <Animated.View style={[styles.titleSecondLine, { opacity }]} />
        <View style={styles.footer}>
          <Animated.View style={[styles.price, { opacity }]} />
          <Animated.View style={[styles.rating, { opacity }]} />
        </View>
      </View>
    </View>
  );
}

export function ProductSkeletonList() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <View style={styles.listContainer}>
      <View style={styles.row}>
        <ProductSkeleton />
        <ProductSkeleton />
      </View>
      <View style={styles.row}>
        <ProductSkeleton />
        <ProductSkeleton />
      </View>
      <View style={styles.row}>
        <ProductSkeleton />
        <ProductSkeleton />
      </View>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      width: CARD_WIDTH,
      backgroundColor: colors.card,
      borderRadius: BorderRadius.md,
      marginBottom: Spacing.md,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: CARD_WIDTH * 0.8,
      backgroundColor: colors.border.light,
    },
    content: {
      padding: Spacing.sm,
    },
    category: {
      height: 12,
      width: "40%",
      backgroundColor: colors.border.light,
      borderRadius: BorderRadius.sm,
      marginBottom: Spacing.xs,
    },
    title: {
      height: 16,
      width: "100%",
      backgroundColor: colors.border.light,
      borderRadius: BorderRadius.sm,
      marginBottom: Spacing.xs,
    },
    titleSecondLine: {
      height: 16,
      width: "70%",
      backgroundColor: colors.border.light,
      borderRadius: BorderRadius.sm,
      marginBottom: Spacing.sm,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    price: {
      height: 20,
      width: 60,
      backgroundColor: colors.border.light,
      borderRadius: BorderRadius.sm,
    },
    rating: {
      height: 14,
      width: 40,
      backgroundColor: colors.border.light,
      borderRadius: BorderRadius.sm,
    },
    listContainer: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: 100, // Space for floating tab bar
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: Spacing.md,
    },
  });
