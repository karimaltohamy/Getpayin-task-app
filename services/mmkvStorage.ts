import AsyncStorage from "@react-native-async-storage/async-storage";
import { MMKV } from "react-native-mmkv";

let mmkvStorage: MMKV | null = null;
let useAsyncStorage = false;

try {
  mmkvStorage = new MMKV({
    id: "GetPayIn-storage",
  });
} catch (error) {
  console.error(
    "MMKV initialization failed, falling back to AsyncStorage:",
    error
  );
  mmkvStorage = null;
  useAsyncStorage = true;
}

export const storageHelper = {
  setString: (key: string, value: string) => {
    try {
      if (mmkvStorage) {
        mmkvStorage.set(key, value);
        console.log(`MMKV: Saved string to key "${key}"`);
      } else {
        AsyncStorage.setItem(key, value).catch((err) =>
          console.error(`AsyncStorage setItem failed for "${key}":`, err)
        );
        console.log(`AsyncStorage: Queued save for key "${key}"`);
      }
    } catch (error) {
      console.error(`Error saving string to key "${key}":`, error);
    }
  },

  getString: (key: string): string | undefined => {
    try {
      if (mmkvStorage) {
        const value = mmkvStorage.getString(key);
        console.log(
          `MMKV: Retrieved string from key "${key}":`,
          value ? "Found" : "Not found"
        );
        return value;
      }

      // For AsyncStorage fallback, use async helper instead
      console.log(
        `AsyncStorage: Cannot retrieve "${key}" synchronously, use asyncStorageHelper instead`
      );
      return undefined;
    } catch (error) {
      console.error(`Error getting string from key "${key}":`, error);
      return undefined;
    }
  },

  setObject: <T>(key: string, value: T) => {
    try {
      const jsonValue = JSON.stringify(value);
      if (mmkvStorage) {
        mmkvStorage.set(key, jsonValue);
        console.log(`MMKV: Saved object to key "${key}"`);
      } else {
        AsyncStorage.setItem(key, jsonValue).catch((err) =>
          console.error(`AsyncStorage setItem failed for "${key}":`, err)
        );
        console.log(`AsyncStorage: Queued save for key "${key}"`);
      }
    } catch (error) {
      console.error(`Error saving object to key "${key}":`, error);
    }
  },

  getObject: <T>(key: string): T | null => {
    try {
      if (mmkvStorage) {
        const value = mmkvStorage.getString(key);
        if (!value) {
          console.log(`MMKV: Object not found for key "${key}"`);
          return null;
        }
        console.log(`MMKV: Retrieved object from key "${key}"`);
        return JSON.parse(value) as T;
      }
      // For AsyncStorage fallback, return null and load async
      console.log(
        `AsyncStorage: Cannot retrieve "${key}" synchronously, use asyncStorageHelper instead`
      );
      return null;
    } catch (error) {
      console.error(`Error getting object from key "${key}":`, error);
      return null;
    }
  },

  setBoolean: (key: string, value: boolean) => {
    try {
      if (mmkvStorage) {
        mmkvStorage.set(key, value);
        console.log(`MMKV: Saved boolean to key "${key}"`);
      } else {
        AsyncStorage.setItem(key, value.toString()).catch((err) =>
          console.error(`AsyncStorage setItem failed for "${key}":`, err)
        );
        console.log(`AsyncStorage: Queued save for key "${key}"`);
      }
    } catch (error) {
      console.error(`Error saving boolean to key "${key}":`, error);
    }
  },

  getBoolean: (key: string): boolean | undefined => {
    try {
      if (mmkvStorage) {
        const value = mmkvStorage.getString(key);
        console.log(
          `MMKV: Retrieved boolean from key "${key}":`,
          value ? "Found" : "Not found"
        );
        return value === "true";
      }

      return undefined;
    } catch (error) {
      console.error(`Error getting boolean from key "${key}":`, error);
      return undefined;
    }
  },

  delete: (key: string) => {
    try {
      if (mmkvStorage) {
        mmkvStorage.delete(key);
        console.log(`MMKV: Deleted key "${key}"`);
      } else {
        AsyncStorage.removeItem(key).catch((err) =>
          console.error(`AsyncStorage removeItem failed for "${key}":`, err)
        );
        console.log(`AsyncStorage: Queued delete for key "${key}"`);
      }
    } catch (error) {
      console.error(`Error deleting key "${key}":`, error);
    }
  },

  contains: (key: string): boolean => {
    try {
      if (mmkvStorage) {
        return mmkvStorage.contains(key);
      }
      // For AsyncStorage, we can't check synchronously
      return false;
    } catch (error) {
      console.error(`Error checking if key "${key}" exists:`, error);
      return false;
    }
  },

  clearAll: () => {
    try {
      if (mmkvStorage) {
        mmkvStorage.clearAll();
        console.log("MMKV: Cleared all storage");
      } else {
        AsyncStorage.clear().catch((err) =>
          console.error("AsyncStorage clear failed:", err)
        );
        console.log("AsyncStorage: Queued clear all");
      }
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },
};

// Async storage helper for AsyncStorage fallback
export const asyncStorageHelper = {
  setString: async (key: string, value: string) => {
    try {
      if (mmkvStorage) {
        mmkvStorage.set(key, value);
        console.log(`MMKV: Saved string to key "${key}"`);
      } else {
        await AsyncStorage.setItem(key, value);
        console.log(`AsyncStorage: Saved string to key "${key}"`);
      }
    } catch (error) {
      console.error(`Error saving string to key "${key}":`, error);
    }
  },

  getString: async (key: string): Promise<string | undefined> => {
    try {
      if (mmkvStorage) {
        const value = mmkvStorage.getString(key);
        console.log(
          `MMKV: Retrieved string from key "${key}":`,
          value ? "Found" : "Not found"
        );
        return value;
      }
      const value = await AsyncStorage.getItem(key);
      console.log(
        `AsyncStorage: Retrieved string from key "${key}":`,
        value ? "Found" : "Not found"
      );
      return value ?? undefined;
    } catch (error) {
      console.error(`Error getting string from key "${key}":`, error);
      return undefined;
    }
  },

  setObject: async <T>(key: string, value: T) => {
    try {
      const jsonValue = JSON.stringify(value);
      if (mmkvStorage) {
        mmkvStorage.set(key, jsonValue);
        console.log(`MMKV: Saved object to key "${key}"`);
      } else {
        await AsyncStorage.setItem(key, jsonValue);
        console.log(`AsyncStorage: Saved object to key "${key}"`);
      }
    } catch (error) {
      console.error(`Error saving object to key "${key}":`, error);
    }
  },

  getObject: async <T>(key: string): Promise<T | null> => {
    try {
      let value: string | null | undefined;
      if (mmkvStorage) {
        value = mmkvStorage.getString(key);
      } else {
        value = await AsyncStorage.getItem(key);
      }
      if (!value) {
        console.log(`Storage: Object not found for key "${key}"`);
        return null;
      }
      console.log(`Storage: Retrieved object from key "${key}"`);
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error getting object from key "${key}":`, error);
      return null;
    }
  },

  delete: async (key: string) => {
    try {
      if (mmkvStorage) {
        mmkvStorage.delete(key);
        console.log(`MMKV: Deleted key "${key}"`);
      } else {
        await AsyncStorage.removeItem(key);
        console.log(`AsyncStorage: Deleted key "${key}"`);
      }
    } catch (error) {
      console.error(`Error deleting key "${key}":`, error);
    }
  },

  contains: async (key: string): Promise<boolean> => {
    try {
      if (mmkvStorage) {
        return mmkvStorage.contains(key);
      }
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch (error) {
      console.error(`Error checking if key "${key}" exists:`, error);
      return false;
    }
  },

  clearAll: async () => {
    try {
      if (mmkvStorage) {
        mmkvStorage.clearAll();
        console.log("MMKV: Cleared all storage");
      } else {
        await AsyncStorage.clear();
        console.log("AsyncStorage: Cleared all storage");
      }
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },
};

export const mmkvPersister = {
  persistClient: async (client: any) => {
    await asyncStorageHelper.setString(
      "react-query-cache",
      JSON.stringify(client)
    );
  },

  restoreClient: async () => {
    const cached = await asyncStorageHelper.getString("react-query-cache");
    return cached ? JSON.parse(cached) : undefined;
  },

  removeClient: async () => {
    await asyncStorageHelper.delete("react-query-cache");
  },
};

// Export the MMKV instance for debugging purposes
export { mmkvStorage, useAsyncStorage };

export default storageHelper;
