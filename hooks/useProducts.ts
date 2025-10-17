import { productsApi } from "@/api/products";
import { useAppSelector } from "@/store/hooks";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Alert, Platform } from "react-native";

export const PRODUCTS_QUERY_KEY = "products";
export const CATEGORIES_QUERY_KEY = "categories";

// get all products with infinite scroll
export function useAllProducts(limit: number = 30) {
  return useInfiniteQuery({
    queryKey: [PRODUCTS_QUERY_KEY, "infinite", limit],
    queryFn: ({ pageParam = 1 }) =>
      productsApi.getAllProducts({ page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce(
        (sum, page) => sum + page.products.length,
        0
      );
      return totalLoaded < lastPage.total ? allPages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// get products by category
export function useProductsByCategory(category: string) {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, "category", category],
    queryFn: () => productsApi.getProductsByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// get categories
export function useCategories() {
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY],
    queryFn: productsApi.getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// delete product with optimistic updates
export function useDeleteProduct() {
  const user = useAppSelector((state) => state.auth.user);
  const isSuperAdmin = user?.role === "superadmin";
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: number) => {
      if (!isSuperAdmin) {
        throw new Error("You don't have permission to delete products");
      }
      return await productsApi.deleteProduct(productId);
    },

    onMutate: async (productId) => {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      await queryClient.cancelQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      const previousData = queryClient.getQueryData<any>([PRODUCTS_QUERY_KEY]);

      // optimistic update
      if (previousData) {
        queryClient.setQueryData([PRODUCTS_QUERY_KEY], {
          ...previousData,
          products: previousData.products.filter(
            (p: any) => p.id !== productId
          ),
          total: (previousData.total || 1) - 1,
        });
      }

      return { previousData };
    },

    onError: (error, _, context) => {
      if (context?.previousData) {
        queryClient.setQueryData([PRODUCTS_QUERY_KEY], context.previousData);
      }

      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete product. Please try again.";

      Alert.alert("Delete Failed", message);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    },

    onSuccess: () => {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert("Success", "Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
}
