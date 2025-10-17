import {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";
import {
  asyncStorageHelper,
  storageHelper,
  useAsyncStorage,
} from "./mmkvStorage";

const QUERY_CACHE_KEY = "REACT_QUERY_CACHE";

export const createMMKVPersister = (): Persister => {
  return {
    persistClient: async (client: PersistedClient) => {
      try {
        const serialized = JSON.stringify(client);

        if (useAsyncStorage) {
          await asyncStorageHelper.setString(QUERY_CACHE_KEY, serialized);
        } else {
          storageHelper.setString(QUERY_CACHE_KEY, serialized);
        }
      } catch (error) {
        console.error("Failed to persist query client:", error);
      }
    },

    restoreClient: async () => {
      try {
        let serialized: string | undefined = undefined;

        if (useAsyncStorage) {
          serialized = await asyncStorageHelper.getString(QUERY_CACHE_KEY);
        } else {
          serialized = storageHelper.getString(QUERY_CACHE_KEY);
        }

        if (!serialized) {
          return undefined;
        }

        return JSON.parse(serialized) as PersistedClient;
      } catch (error) {
        console.error("Failed to restore query client:", error);
        return undefined;
      }
    },

    removeClient: async () => {
      try {
        if (useAsyncStorage) {
          await asyncStorageHelper.delete(QUERY_CACHE_KEY);
        } else {
          storageHelper.delete(QUERY_CACHE_KEY);
        }
      } catch (error) {
        console.error("Failed to remove query client:", error);
      }
    },
  };
};
