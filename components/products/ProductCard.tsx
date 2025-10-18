import type { Product } from "@/api/products/types";
import { BorderRadius, Shadows, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  View as RNView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text } from "../shared/ThemedText";
import { View } from "../shared/ThemedView";

interface ProductCardProps {
  product: Product;
  onDelete?: (productId: number) => void;
  showDeleteButton?: boolean;
  isDeleting?: boolean;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - Spacing.lg * 3) / 2;

export default function ProductCard({
  product,
  onDelete,
  showDeleteButton = false,
  isDeleting = false,
}: ProductCardProps) {
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors, isDarkMode);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const handleCardPress = () => {
    console.log("Navigate to product:", product.id);
  };

  // calculate discount percentage
  const hasDiscount = product.discountPercentage > 0;
  const originalPrice = hasDiscount
    ? product.price / (1 - product.discountPercentage / 100)
    : 0;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
    >
      <Pressable onPress={handleCardPress} style={styles.pressable}>
        {/* image Section */}
        <View variant="secondary" style={styles.imageContainer}>
          <Image
            source={{ uri: product.thumbnail }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* gradient Overlay */}
          <RNView style={styles.imageGradient} />

          {/* discount Badge */}
          {hasDiscount && (
            <RNView style={styles.discountBadge}>
              <Text variant="inverse" style={styles.discountText}>
                -{Math.round(product.discountPercentage)}%
              </Text>
            </RNView>
          )}

          {/* delete Button */}
          {showDeleteButton && onDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(product.id)}
              disabled={isDeleting}
              activeOpacity={0.7}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color={isDeleting ? colors.disabled : colors.error}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* content Section */}
        <View variant="card" style={styles.content}>
          {/* category*/}
          <RNView style={styles.categoryRow}>
            <View variant="secondary" style={styles.categoryChip}>
              <Text
                variant="secondary"
                style={styles.category}
                numberOfLines={1}
              >
                {product.category}
              </Text>
            </View>
          </RNView>

          {product.brand && (
            <Text style={styles.brand} numberOfLines={1}>
              {product.brand}
            </Text>
          )}

          {/* title */}
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>

          {/* rating */}
          <RNView style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={colors.warning} />
            <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
            <Text variant="tertiary" style={styles.ratingCount}>
              ({product.stock})
            </Text>
          </RNView>

          {/* price */}
          <RNView style={styles.priceSection}>
            <RNView style={styles.priceContainer}>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
              {hasDiscount && (
                <Text variant="tertiary" style={styles.originalPrice}>
                  ${originalPrice.toFixed(2)}
                </Text>
              )}
            </RNView>
          </RNView>

          {/* stock Warning */}
          {product.stock < 10 && product.stock > 0 && (
            <RNView style={styles.stockWarning}>
              <Ionicons name="alert-circle" size={12} color={colors.warning} />
              <Text style={styles.stockWarningText}>
                Only {product.stock} left
              </Text>
            </RNView>
          )}

          {product.stock === 0 && (
            <View variant="tertiary" style={styles.outOfStock}>
              <Text variant="secondary" style={styles.outOfStockText}>
                Out of Stock
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const createStyles = (colors: any, isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      width: CARD_WIDTH,
      marginBottom: Spacing.md,
    },
    pressable: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      ...Shadows.md,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border.light,
    },
    imageContainer: {
      position: "relative",
      width: "100%",
      height: CARD_WIDTH * 1.1,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    imageGradient: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "30%",
      backgroundColor: isDarkMode
        ? "rgba(0, 0, 0, 0.3)"
        : "rgba(0, 0, 0, 0.05)",
    },
    discountBadge: {
      position: "absolute",
      top: Spacing.sm,
      left: Spacing.sm,
      backgroundColor: colors.error,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
      ...Shadows.sm,
    },
    discountText: {
      ...Typography.caption,
      fontWeight: "700",
      fontSize: 11,
    },

    deleteButton: {
      position: "absolute",
      top: Spacing.sm + 36,
      right: Spacing.sm,
      backgroundColor: isDarkMode
        ? "rgba(28, 28, 30, 0.95)"
        : "rgba(255, 255, 255, 0.95)",
      borderRadius: BorderRadius.full,
      padding: Spacing.sm,
      ...Shadows.sm,
    },
    content: {
      padding: Spacing.md,
    },
    categoryRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: Spacing.xs,
    },
    categoryChip: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 2,
      borderRadius: BorderRadius.sm,
    },
    category: {
      ...Typography.caption,
      textTransform: "uppercase",
      fontWeight: "600",
      fontSize: 10,
      letterSpacing: 0.5,
    },
    brand: {
      ...Typography.caption,
      color: colors.primary,
      fontWeight: "600",
      marginBottom: Spacing.xs,
    },
    title: {
      ...Typography.body,
      fontWeight: "600",
      marginBottom: Spacing.sm,
      minHeight: 38,
      lineHeight: 20,
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
      marginBottom: Spacing.sm,
    },
    rating: {
      ...Typography.caption,
      fontWeight: "700",
      fontSize: 13,
    },
    ratingCount: {
      ...Typography.caption,
      fontSize: 11,
    },
    priceSection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: Spacing.xs,
    },
    priceContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
    },
    price: {
      ...Typography.heading3,
      color: colors.primary,
      fontWeight: "700",
      fontSize: 18,
    },
    originalPrice: {
      ...Typography.caption,
      textDecorationLine: "line-through",
      fontSize: 12,
    },
    stockWarning: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
      backgroundColor: isDarkMode ? "rgba(255, 159, 10, 0.2)" : "#FFF3CD",
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
      alignSelf: "flex-start",
      marginTop: Spacing.xs,
    },
    stockWarningText: {
      ...Typography.caption,
      color: colors.warning,
      fontSize: 10,
      fontWeight: "600",
    },
    outOfStock: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
      alignSelf: "flex-start",
      marginTop: Spacing.xs,
    },
    outOfStockText: {
      ...Typography.caption,
      fontSize: 10,
      fontWeight: "600",
      textTransform: "uppercase",
    },
  });
