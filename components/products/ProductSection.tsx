import { BorderRadius, Colors, Spacing, Typography } from "@/constants/theme";
import { useAllProducts, useDeleteProduct } from "@/hooks/useProducts";
import { useAppSelector } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ProductList from "./ProductList";

interface ProductSectionProps {
  HeroComponent?: React.ComponentType;
}

const ProductSection = ({ HeroComponent }: ProductSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const limit = 20;

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

  // get total count from first page
  const totalCount = data?.pages?.[0]?.total || 0;

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
    // Prevent multiple simultaneous fetches
    if (!hasNextPage || isFetchingNextPage || isLoadingMore) {
      console.log("Load more blocked:", {
        hasNextPage,
        isFetchingNextPage,
        isLoadingMore,
      });
      return;
    }

    console.log("Loading more products...", {
      currentCount: allProducts.length,
      total: totalCount,
    });
    setIsLoadingMore(true);
    try {
      await fetchNextPage();
      console.log("Load more complete");
    } finally {
      setIsLoadingMore(false);
    }
  };

  // header component for the FlatList
  const ListHeader = () => (
    <>
      {/* hero Section */}
      {HeroComponent && <HeroComponent />}

      {/* search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color={Colors.text.secondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={Colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={Colors.text.secondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>All Products</Text>
      </View>
    </>
  );

  return (
    <View style={styles.productsSection}>
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

const styles = StyleSheet.create({
  searchSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.secondary,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.text.primary,
    padding: 0,
  },
  productsSection: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
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
    color: Colors.text.primary,
    fontWeight: "700",
  },
  productCount: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontWeight: "500",
  },
});
