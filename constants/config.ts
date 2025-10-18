export const API_BASE_URL = "https://dummyjson.com";

export const apiEndpoints = {
  LOGIN: "/auth/login",
  ME: "/auth/me",
  REFRESH: "/auth/refresh",
  PRODUCTS: "/products",
  CATEGORIES: "/products/categories",
  PRODUCT_BY_ID: (id: number) => `/products/${id}`,
  PRODUCTS_BY_CATEGORY: (category: string) => `/products/category/${category}`,
};

// storage keys
export const StorageKeys = {
  AUTH_TOKEN: "auth.token", // accessToken
  AUTH_REFRESH_TOKEN: "auth.refreshToken",
  AUTH_USER: "auth.user",
  REACT_QUERY_CACHE: "react-query-cache",
  BIOMETRIC_ENABLED: "biometric.enabled",
  THEME_MODE: "theme.mode",
};

// biometric lock settings
export const BIOMETRIC_LOCK_TIMEOUT = 60 * 60 * 1000; // 1 hour
