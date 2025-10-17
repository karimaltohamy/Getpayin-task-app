import type { Product } from "@/api/products/types";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const [isFavorite, setIsFavorite] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleCardPress = () => {
    console.log("Navigate to product:", product.id);
  };

  // Calculate discount percentage
  const hasDiscount = product.discountPercentage > 0;
  const originalPrice = hasDiscount
    ? product.price / (1 - product.discountPercentage / 100)
    : 0;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
    >
      <Pressable
        onPress={handleCardPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.thumbnail }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* gradient Overlay */}
          <View style={styles.imageGradient} />

          {/* discount Badge */}
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                -{Math.round(product.discountPercentage)}%
              </Text>
            </View>
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
                color={isDeleting ? Colors.disabled : Colors.error}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* content Section */}
        <View style={styles.content}>
          {/* category*/}
          <View style={styles.categoryRow}>
            <View style={styles.categoryChip}>
              <Text style={styles.category} numberOfLines={1}>
                {product.category}
              </Text>
            </View>
          </View>

          {product.brand && (
            <Text style={styles.brand} numberOfLines={1}>
              {product.brand}
            </Text>
          )}

          {/* title */}
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>

          {/* t=rating */}
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={Colors.warning} />
            <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>({product.stock})</Text>
          </View>

          {/* Pri */}
          <View style={styles.priceSection}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
              {hasDiscount && (
                <Text style={styles.originalPrice}>
                  ${originalPrice.toFixed(2)}
                </Text>
              )}
            </View>
          </View>

          {/* Stock Warning */}
          {product.stock < 10 && product.stock > 0 && (
            <View style={styles.stockWarning}>
              <Ionicons name="alert-circle" size={12} color={Colors.warning} />
              <Text style={styles.stockWarningText}>
                Only {product.stock} left
              </Text>
            </View>
          )}

          {product.stock === 0 && (
            <View style={styles.outOfStock}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: Spacing.md,
  },
  pressable: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: CARD_WIDTH * 1.1,
    backgroundColor: Colors.background.secondary,
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
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  discountBadge: {
    position: "absolute",
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.error,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    ...Shadows.sm,
  },
  discountText: {
    ...Typography.caption,
    color: Colors.text.inverse,
    fontWeight: "700",
    fontSize: 11,
  },
  favoriteButton: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: BorderRadius.full,
    padding: Spacing.sm,
    ...Shadows.sm,
  },
  deleteButton: {
    position: "absolute",
    top: Spacing.sm + 36,
    right: Spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
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
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  category: {
    ...Typography.caption,
    color: Colors.text.secondary,
    textTransform: "uppercase",
    fontWeight: "600",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  brand: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.body,
    fontWeight: "600",
    color: Colors.text.primary,
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
    color: Colors.text.primary,
    fontWeight: "700",
    fontSize: 13,
  },
  ratingCount: {
    ...Typography.caption,
    color: Colors.text.tertiary,
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
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 18,
  },
  originalPrice: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    textDecorationLine: "line-through",
    fontSize: 12,
  },
  stockWarning: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: "#FFF3CD",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: "flex-start",
    marginTop: Spacing.xs,
  },
  stockWarningText: {
    ...Typography.caption,
    color: Colors.warning,
    fontSize: 10,
    fontWeight: "600",
  },
  outOfStock: {
    backgroundColor: Colors.background.tertiary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: "flex-start",
    marginTop: Spacing.xs,
  },
  outOfStockText: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
