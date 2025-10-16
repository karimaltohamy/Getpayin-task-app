# Storage Implementation with AsyncStorage Fallback

## Overview

The app now uses a hybrid storage approach that automatically falls back to AsyncStorage when MMKV is not available (e.g., when using remote debugging).

## Architecture

### Storage Helpers

The app provides two storage helpers in [services/mmkvStorage.ts](../services/mmkvStorage.ts):

1. **`storageHelper`** (Synchronous)
   - Primary: Uses MMKV when available (fast, synchronous)
   - Fallback: Queues AsyncStorage operations (persists data but doesn't return it synchronously)
   - Used by: Redux slices for state persistence

2. **`asyncStorageHelper`** (Asynchronous)
   - Primary: Uses MMKV when available
   - Fallback: Uses AsyncStorage (awaitable, returns data)
   - Used by: Auth restoration, queries, and async operations

### Implementation Details

#### MMKV Available (Default)
```typescript
// MMKV is synchronous and fast
storageHelper.setString('key', 'value');
const value = storageHelper.getString('key'); // Returns immediately
```

#### MMKV Not Available (Fallback)
```typescript
// AsyncStorage operations are queued
storageHelper.setString('key', 'value'); // Queues the operation
const value = storageHelper.getString('key'); // Returns undefined

// Use async helper instead
await asyncStorageHelper.setString('key', 'value');
const value = await asyncStorageHelper.getString('key'); // Returns actual value
```

### Auth State Restoration

The auth state restoration now uses an async thunk to properly handle AsyncStorage:

**File**: [store/authSlice.ts](../store/authSlice.ts)

```typescript
// New async thunk
export const restoreAuthAsync = createAsyncThunk(
  "auth/restoreAsync",
  async () => {
    if (useAsyncStorage) {
      // Use async storage when MMKV fails
      const token = await asyncStorageHelper.getString(StorageKeys.AUTH_TOKEN);
      const refreshToken = await asyncStorageHelper.getString(StorageKeys.AUTH_REFRESH_TOKEN);
      const user = await asyncStorageHelper.getObject<User>(StorageKeys.AUTH_USER);
      return { token, refreshToken, user };
    } else {
      // Use sync storage when MMKV works
      const token = storageHelper.getString(StorageKeys.AUTH_TOKEN);
      const refreshToken = storageHelper.getString(StorageKeys.AUTH_REFRESH_TOKEN);
      const user = storageHelper.getObject<User>(StorageKeys.AUTH_USER);
      return { token, refreshToken, user };
    }
  }
);
```

**Usage in AuthGuard** ([components/AuthGuard.tsx](../components/AuthGuard.tsx)):
```typescript
useEffect(() => {
  dispatch(restoreAuthAsync());
}, []);
```

## API Reference

### storageHelper (Sync)

- `setString(key: string, value: string): void`
- `getString(key: string): string | undefined`
- `setObject<T>(key: string, value: T): void`
- `getObject<T>(key: string): T | null`
- `delete(key: string): void`
- `contains(key: string): boolean`
- `clearAll(): void`

### asyncStorageHelper (Async)

- `setString(key: string, value: string): Promise<void>`
- `getString(key: string): Promise<string | undefined>`
- `setObject<T>(key: string, value: T): Promise<void>`
- `getObject<T>(key: string): Promise<T | null>`
- `delete(key: string): Promise<void>`
- `contains(key: string): Promise<boolean>`
- `clearAll(): Promise<void>`

## When to Use Which Helper

### Use `storageHelper` when:
- In Redux reducers (must be synchronous)
- Setting values (works with both MMKV and AsyncStorage)
- MMKV is guaranteed to be available

### Use `asyncStorageHelper` when:
- Reading values during app initialization
- In async functions or useEffect hooks
- You need the actual stored value (not just setting it)
- MMKV might not be available (e.g., debugging mode)

## Storage Keys

All storage keys are defined in [constants/config.ts](../constants/config.ts):

```typescript
export const StorageKeys = {
  AUTH_TOKEN: '@auth_token',
  AUTH_REFRESH_TOKEN: '@auth_refresh_token',
  AUTH_USER: '@auth_user',
};
```

## Testing the Fallback

To test AsyncStorage fallback:

1. Enable remote debugging in your React Native app
2. MMKV will fail to initialize (it doesn't work with Chrome debugger)
3. The app will automatically fall back to AsyncStorage
4. Check console logs for confirmation:
   ```
   ⚠️ MMKV initialization failed, falling back to AsyncStorage
   ```

## Benefits

1. **Resilience**: App works even when MMKV fails
2. **Developer Experience**: Can debug with remote debugger
3. **Performance**: Uses fast MMKV when available
4. **Compatibility**: Falls back to AsyncStorage when needed
5. **Transparent**: Automatic switching based on availability
