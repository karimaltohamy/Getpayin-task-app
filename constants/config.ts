export const API_BASE_URL = "https://dummyjson.com";

export const apiEndpoints = {
  LOGIN: "/auth/login",
  ME: "/auth/me",
  PRODUCTS: "/products",
  CATEGORIES: "/products/categories",
  PRODUCT_BY_ID: (id: number) => `/products/${id}`,
  PRODUCTS_BY_CATEGORY: (category: string) => `/products/category/${category}`,
};

// storage keys
export const StorageKeys = {
  AUTH_TOKEN: "auth.token",
  AUTH_USER: "auth.user",
  REACT_QUERY_CACHE: "react-query-cache",
};
