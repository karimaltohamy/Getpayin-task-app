import { apiEndpoints } from "@/constants/config";
import axiosService from "../axiosService";
import { Product, ProductsResponse } from "./types";

export const productsApi = {
  getAllProducts: async () => {
    const response = await axiosService.get(apiEndpoints.PRODUCTS);
    return response.data as ProductsResponse;
  },

  getProductsByCategory: async (category: string) => {
    const response = await axiosService.get(
      apiEndpoints.PRODUCTS_BY_CATEGORY(category)
    );
    return response.data as ProductsResponse;
  },

  deleteProduct: async (id: number) => {
    const response = await axiosService.delete(apiEndpoints.PRODUCT_BY_ID(id));
    return response.data as Product;
  },

  getCategories: async () => {
    const response = await axiosService.get(apiEndpoints.CATEGORIES);
    return response.data as string[];
  },
};
