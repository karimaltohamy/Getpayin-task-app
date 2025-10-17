import ProductList from "@/components/products/ProductList";
import { BorderRadius, Colors, Spacing, Typography } from "@/constants/theme";
import {
  useCategories,
  useDeleteProduct,
  useProductsByCategory,
} from "@/hooks/useProducts";
import { useAppSelector } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoryProductsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategories();
  const { data, isLoading, error, refetch, isRefetching } =
    useProductsByCategory(selectedCategory);
  const deleteProductMutation = useDeleteProduct();
  const user = useAppSelector((state) => state.auth.user);
  const isSuperAdmin = user?.role === "superadmin";

  const [deletingProducts, setDeletingProducts] = useState<Set<number>>(
    new Set()
  );

  const handleDeleteProduct = async (productId: number) => {
    setDeletingProducts((prev) => new Set(prev).add(productId));

    try {
      await deleteProductMutation.mutateAsync(productId);
    } finally {
      setDeletingProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const isDeletingProduct = (productId: number) => {
    return deletingProducts.has(productId);
  };

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
  };

  // select first category if none selected
  useEffect(() => {
    if (!selectedCategory) {
      setSelectedCategory(categoriesData?.[0]?.slug || "");
    }
  }, [categoriesData, selectedCategory]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Products by Category</Text>
        {selectedCategory && data && (
          <Text style={styles.subtitle}>
            {data.total} product{data.total !== 1 ? "s" : ""} in{" "}
            {categoriesData?.find((cat) => cat.slug === selectedCategory)
              ?.name || selectedCategory}
          </Text>
        )}
      </View>

      {/* Categories Filter */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {isCategoriesLoading ? (
            <View style={styles.categoryChipSkeleton} />
          ) : (
            categoriesData?.map((category) => (
              <TouchableOpacity
                key={category.slug}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.slug &&
                    styles.categoryChipActive,
                ]}
                onPress={() => handleCategorySelect(category.slug)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category.slug &&
                      styles.categoryChipTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      {/* Products List */}
      {!selectedCategory ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="grid-outline" size={64} color={Colors.disabled} />
          <Text style={styles.emptyTitle}>Select a Category</Text>
          <Text style={styles.emptyMessage}>
            Choose a category from above to view products
          </Text>
        </View>
      ) : (
        <ProductList
          products={data?.products || []}
          isLoading={isLoading}
          isRefreshing={isRefetching}
          onRefresh={refetch}
          error={error}
          onRetry={refetch}
          showDeleteButton={isSuperAdmin}
          onDeleteProduct={handleDeleteProduct}
          isDeletingProduct={isDeletingProduct}
          emptyMessage={`No products found in ${
            categoriesData?.find((cat) => cat.slug === selectedCategory)
              ?.name || selectedCategory
          }`}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  title: {
    ...Typography.heading1,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  categoriesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
    backgroundColor: Colors.background.secondary,
    marginBottom: Spacing.md,
  },
  categoriesScroll: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    marginRight: Spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    ...Typography.body,
    color: Colors.text.primary,
    fontWeight: "500",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  categoryChipSkeleton: {
    width: 100,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.tertiary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.heading2,
    color: Colors.text.primary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyMessage: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: "center",
  },
});
