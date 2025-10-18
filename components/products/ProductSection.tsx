import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { useAllProducts, useDeleteProduct } from "@/hooks/useProducts";
import { useTheme } from "@/hooks/useTheme";
import { useAppSelector } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Text } from "../shared/ThemedText";
import { View } from "../shared/ThemedView";
import ProductList from "./ProductList";

interface ProductSectionProps {
  HeroComponent?: React.ComponentType;
}

const ProductSection = ({ HeroComponent }: ProductSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const limit = 20;
  const { colors } = useTheme();

  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAllProducts(limit);

  const deleteProductMutation = useDeleteProduct();
  const [deletingProducts, setDeletingProducts] = useState<Set<number>>(
    new Set()
  );
  const user = useAppSelector((state) => state.auth.user);
  const isSuperAdmin = user?.role === "superadmin";

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

  const isDeletingProduct = (productId: number) =>
    deletingProducts.has(productId);

  // flatten all pages into a single array of products
  const allProducts = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.products);
  }, [data?.pages]);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [allProducts, searchQuery]);

  const handleLoadMore = async () => {
    if (!hasNextPage || isFetchingNextPage || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);
    try {
      await fetchNextPage();
      console.log("Load more complete");
    } finally {
      setIsLoadingMore(false);
    }
  };

  // create styles with current theme colors
  const styles = createStyles(colors);

  // header component for the FlatList
  const ListHeader = () => (
    <>
      {/* hero Section */}
      {HeroComponent && <HeroComponent />}

      {/* search Section */}
      <View variant="secondary" style={styles.searchSection}>
        <View variant="card" style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color={colors.text.secondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* section Header */}
      <View variant="secondary" style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>All Products</Text>
      </View>
    </>
  );

  return (
    <View variant="secondary" style={styles.productsSection}>
      <ProductList
        products={filteredProducts}
        isLoading={isLoading}
        onRefresh={refetch}
        onEndReached={handleLoadMore}
        isFetchingMore={isFetchingNextPage || isLoadingMore}
        error={error}
        showDeleteButton={isSuperAdmin}
        onDeleteProduct={handleDeleteProduct}
        isDeletingProduct={isDeletingProduct}
        emptyMessage={
          searchQuery
            ? "No products found matching your search"
            : "No products available"
        }
        ListHeaderComponent={ListHeader}
      />
    </View>
  );
};

export default ProductSection;

const createStyles = (colors: any) =>
  StyleSheet.create({
    searchSection: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      backgroundColor: colors.background.tertiary,
    },
    searchIcon: {
      marginRight: Spacing.sm,
    },
    searchInput: {
      flex: 1,
      ...Typography.body,
      color: colors.text.primary,
      padding: 0,
    },
    productsSection: {
      flex: 1,
      backgroundColor: colors.background.secondary,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.md,
    },
    sectionTitle: {
      ...Typography.heading2,
      fontWeight: "700",
    },
    productCount: {
      ...Typography.body,
      color: colors.text.secondary,
      fontWeight: "500",
    },
  });
