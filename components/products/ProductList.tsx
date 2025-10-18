import type { Product } from "@/api/products/types";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import DeleteConfirmDialog from "../dialogs/DeleteConfirmDialog";
import { Text } from "../shared/ThemedText";
import { View as ThemedView } from "../shared/ThemedView";
import ProductCard from "./ProductCard";
import { ProductSkeletonList } from "./ProductSkeleton";

interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  error?: Error | null;
  onRetry?: () => void;
  showDeleteButton?: boolean;
  onDeleteProduct?: (productId: number) => void;
  isDeletingProduct?: (productId: number) => boolean;
  emptyMessage?: string;
  onEndReached?: () => void;
  isFetchingMore?: boolean;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export default function ProductList({
  products,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  error,
  onRetry,
  showDeleteButton = false,
  onDeleteProduct,
  isDeletingProduct,
  emptyMessage = "No products found",
  onEndReached,
  isFetchingMore,
  ListHeaderComponent,
}: ProductListProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const handleDeletePress = (productId: number) => {
    setSelectedProductId(productId);
    setDeleteDialogVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedProductId && onDeleteProduct) {
      onDeleteProduct(selectedProductId);
      setDeleteDialogVisible(false);
      setSelectedProductId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogVisible(false);
    setSelectedProductId(null);
  };

  // wrap header component to add negative margin
  const renderHeader = () => {
    if (!ListHeaderComponent) return null;

    const HeaderContent =
      typeof ListHeaderComponent === "function"
        ? ListHeaderComponent
        : () => <>{ListHeaderComponent}</>;

    return (
      <View style={styles.headerWrapper}>
        <HeaderContent />
      </View>
    );
  };

  return (
    <>
      <FlatList
        data={isLoading ? [] : products} // no data while loading
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            showDeleteButton={showDeleteButton}
            onDelete={handleDeletePress}
            isDeleting={isDeletingProduct?.(item.id) || false}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          ) : undefined
        }
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListFooterComponent={
          isFetchingMore ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : undefined
        }
        ListEmptyComponent={() => {
          if (isLoading) {
            return <ProductSkeletonList />; // skeleton while fetching
          }

          if (error) {
            return (
              <ThemedView variant="secondary" style={styles.centerContainer}>
                <Ionicons
                  name="alert-circle-outline"
                  size={64}
                  color={colors.error}
                />
                <Text style={styles.errorTitle}>Failed to load</Text>
                <Text variant="secondary" style={styles.errorMessage}>
                  {error.message || "Something went wrong"}
                </Text>
                {onRetry && (
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={onRetry}
                  >
                    <Ionicons name="refresh" size={18} color="#fff" />
                    <Text variant="inverse" style={styles.retryButtonText}>
                      Retry
                    </Text>
                  </TouchableOpacity>
                )}
              </ThemedView>
            );
          }

          return (
            <ThemedView variant="secondary" style={styles.centerContainer}>
              <Ionicons name="cube-outline" size={64} color={colors.disabled} />
              <Text style={styles.emptyTitle}>No Products</Text>
              <Text variant="secondary" style={styles.emptyMessage}>
                {emptyMessage}
              </Text>
            </ThemedView>
          );
        }}
      />

      <DeleteConfirmDialog
        visible={deleteDialogVisible}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isLoading={
          selectedProductId ? isDeletingProduct?.(selectedProductId) : false
        }
      />
    </>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    listContent: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: 100, // Space for floating tab bar
    },
    headerWrapper: {
      marginHorizontal: -Spacing.lg,
    },
    columnWrapper: {
      justifyContent: "space-between",
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: Spacing.xl,
    },
    errorTitle: {
      ...Typography.heading2,
      marginTop: Spacing.md,
      marginBottom: Spacing.sm,
    },
    errorMessage: {
      ...Typography.body,
      textAlign: "center",
      marginBottom: Spacing.xl,
    },
    retryButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.md,
      borderRadius: 8,
    },
    retryButtonText: {
      ...Typography.body,
      fontWeight: "600",
    },
    emptyTitle: {
      ...Typography.heading2,
      marginTop: Spacing.md,
      marginBottom: Spacing.sm,
    },
    emptyMessage: {
      ...Typography.body,
      textAlign: "center",
    },
  });
