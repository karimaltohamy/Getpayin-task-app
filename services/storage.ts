import { MMKV } from "react-native-mmkv";
import { Platform } from "react-native";

// Lazy initialization to avoid crashes when JSI is not available
let storage: MMKV | null = null;

const initStorage = (): MMKV | null => {
  if (storage) return storage;

  // Only initialize MMKV on native platforms
  if (Platform.OS === "web") {
    console.warn("MMKV is not available on web platform. Using fallback storage.");
    return null;
  }

  try {
    storage = new MMKV({
      id: "getpayin-app-storage",
      encryptionKey: "secure-encryption-key-change-in-production",
    });
    return storage;
  } catch (error) {
    console.error("Failed to initialize MMKV:", error);
    console.warn("Falling back to in-memory storage. Data will not persist.");
    return null;
  }
};

// Fallback in-memory storage for web or when MMKV fails
const fallbackStorage: Record<string, string> = {};

// storage helper with fallback support
export const storageHelper = {
  setString: (key: string, value: string) => {
    const mmkv = initStorage();
    if (mmkv) {
      mmkv.set(key, value);
    } else {
      fallbackStorage[key] = value;
    }
  },

  getString: (key: string): string | undefined => {
    const mmkv = initStorage();
    if (mmkv) {
      return mmkv.getString(key);
    } else {
      return fallbackStorage[key];
    }
  },

  setObject: <T>(key: string, value: T) => {
    const mmkv = initStorage();
    const jsonValue = JSON.stringify(value);
    if (mmkv) {
      mmkv.set(key, jsonValue);
    } else {
      fallbackStorage[key] = jsonValue;
    }
  },

  getObject: <T>(key: string): T | null => {
    const mmkv = initStorage();
    const value = mmkv ? mmkv.getString(key) : fallbackStorage[key];
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error("Error parsing stored object:", error);
      return null;
    }
  },

  delete: (key: string) => {
    const mmkv = initStorage();
    if (mmkv) {
      mmkv.delete(key);
    } else {
      delete fallbackStorage[key];
    }
  },

  contains: (key: string): boolean => {
    const mmkv = initStorage();
    if (mmkv) {
      return mmkv.contains(key);
    } else {
      return key in fallbackStorage;
    }
  },

  clearAll: () => {
    const mmkv = initStorage();
    if (mmkv) {
      mmkv.clearAll();
    } else {
      Object.keys(fallbackStorage).forEach(key => delete fallbackStorage[key]);
    }
  },
};

export const mmkvPersister = {
  persistClient: (client: any) => {
    storageHelper.setString("react-query-cache", JSON.stringify(client));
  },

  restoreClient: () => {
    const cached = storageHelper.getString("react-query-cache");
    return cached ? JSON.parse(cached) : undefined;
  },

  removeClient: () => {
    storageHelper.delete("react-query-cache");
  },
};

// Export a getter function instead of the instance directly
export const getStorage = () => initStorage();

export default storageHelper;
