# Milestone 2 - Authentication System

This document outlines the implementation of the authentication system for the GetPayIn Task App.

## Features Implemented

### 1. DummyJSON API Integration

#### API Client Setup
- **Location**: [api/axiosService.ts](../api/axiosService.ts)
- **Features**:
  - Axios instance with base URL configuration
  - Request interceptor to automatically add auth tokens
  - Response interceptor for centralized error handling
  - 10-second timeout for all requests

#### Authentication Endpoints
- **Location**: [api/auth/index.ts](../api/auth/index.ts)
- **Endpoints**:
  - `POST /auth/login` - User login with username/password
  - `GET /auth/me` - Validate token and get current user data

#### Type Definitions
- **Location**: [api/auth/types.ts](../api/auth/types.ts)
- **Types**:
  - `User` - User profile data
  - `LoginCredentials` - Login form data
  - `LoginResponse` - API response from login
  - `AuthState` - Redux auth state shape

### 2. Token Storage with MMKV

#### Storage Service
- **Location**: [services/storage.ts](../services/storage.ts)
- **Features**:
  - MMKV-based persistent storage with encryption
  - Fallback to in-memory storage for web platform
  - Helper methods: `setString`, `getString`, `setObject`, `getObject`, `delete`, `clearAll`
  - Automatic JSON serialization/deserialization

#### Storage Keys
- **Location**: [constants/config.ts](../constants/config.ts)
- **Keys**:
  - `auth.token` - JWT authentication token
  - `auth.user` - User profile data
  - `react-query-cache` - React Query cache persistence

### 3. Login Screen

#### Implementation
- **Location**: [app/auth/login/index.tsx](../app/auth/login/index.tsx)
- **Features**:
  - Username and password input fields
  - Client-side form validation using Yup
  - Real-time error display
  - Loading states during API calls
  - API error handling with user-friendly messages
  - Test credentials display for convenience
  - Keyboard-aware scroll view
  - Responsive design

#### Form Validation
- **Location**: [utils/validations/auth.ts](../utils/validations/auth.ts)
- **Rules**:
  - Username: Required
  - Password: Required

#### Test Credentials
For testing purposes, use these DummyJSON credentials:
- **Username**: `emilys`
- **Password**: `emilyspass`

### 4. Redux Auth State Management

#### Auth Slice
- **Location**: [store/authSlice.ts](../store/authSlice.ts)
- **Actions**:
  - `setCredentials({ user, token })` - Set user and token, persist to MMKV
  - `setUser(user)` - Update user data
  - `logout()` - Clear auth state and MMKV storage
  - `restoreAuth()` - Restore session from MMKV on app launch
  - `setLoading(boolean)` - Set loading state

#### State Shape
```typescript
{
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

### 5. Protected Routes & Auth Guard

#### Auth Guard Component
- **Location**: [components/AuthGuard.tsx](../components/AuthGuard.tsx)
- **Features**:
  - Token validation on app launch
  - Automatic token refresh check via `/auth/me` endpoint
  - Auto-logout on token expiration
  - Loading state management
  - Automatic route redirection

#### Protected Route Hook
- **Location**: [hooks/useProtectedRoute.ts](../hooks/useProtectedRoute.ts)
- **Usage**:
```typescript
const { isAuthenticated, isLoading } = useProtectedRoute();
```

#### Root Layout
- **Location**: [app/_layout.tsx](../app/_layout.tsx)
- **Features**:
  - Redux store provider
  - React Query client provider
  - Session restoration on app launch
  - Stack navigation configuration

#### Index Screen
- **Location**: [app/index.tsx](../app/index.tsx)
- **Features**:
  - Entry point for the app
  - Automatic routing based on auth state
  - Loading indicator during initialization

### 6. User Interface

#### Home Screen
- **Location**: [app/(tabs)/index.tsx](../app/(tabs)/index.tsx)
- **Features**:
  - Display user profile information
  - User avatar, name, email, and username
  - Logout button with confirmation dialog
  - Clean, card-based UI design

#### Theme System
- **Location**: [constants/theme.ts](../constants/theme.ts)
- **Updates**:
  - Added typography presets (heading1, body, bodyBold, caption, buttonText)
  - Added border.primary color
  - Consistent color palette
  - Reusable spacing and shadow constants

## Authentication Flow

### 1. App Launch
```
App Start
   ↓
_layout.tsx dispatches restoreAuth()
   ↓
Check MMKV for token & user
   ↓
If found → Set authenticated state
If not found → Set unauthenticated state
   ↓
index.tsx redirects based on auth state
   ↓
Authenticated → /(tabs)
Unauthenticated → /auth/login
```

### 2. Login Flow
```
User enters credentials
   ↓
Client-side validation (Yup)
   ↓
If valid → Call POST /auth/login
   ↓
Receive response with user & token
   ↓
Dispatch setCredentials({ user, token })
   ↓
Store token & user in MMKV
   ↓
Update Redux state
   ↓
Navigate to /(tabs)
```

### 3. Token Validation Flow
```
App opens with existing token
   ↓
AuthGuard validates token via GET /auth/me
   ↓
If valid → Update user data
If invalid → Dispatch logout()
   ↓
Continue to authenticated screens
```

### 4. Logout Flow
```
User clicks Logout
   ↓
Show confirmation dialog
   ↓
If confirmed → Dispatch logout()
   ↓
Clear token & user from MMKV
   ↓
Reset Redux auth state
   ↓
Navigate to /auth/login
```

## API Error Handling

The authentication system handles various error scenarios:

1. **Network Errors**: Timeout after 10 seconds
2. **Invalid Credentials**: Display error message from API
3. **Token Expiration**: Auto-logout and redirect to login
4. **Validation Errors**: Real-time field-level error display
5. **API Errors**: User-friendly error messages with alerts

## Security Features

1. **Encrypted Storage**: MMKV with encryption key
2. **Automatic Token Refresh**: Validates token on app launch
3. **Secure Token Transmission**: Bearer token in Authorization header
4. **Auto-logout**: On token validation failure
5. **No Credential Storage**: Only tokens are persisted, not passwords

## File Structure

```
api/
├── auth/
│   ├── index.ts          # Auth API endpoints
│   └── types.ts          # Auth type definitions
├── axiosService.ts       # Axios configuration
└── queryClient.ts        # React Query setup

app/
├── auth/
│   └── login/
│       └── index.tsx     # Login screen
├── (tabs)/
│   ├── index.tsx         # Home screen with user info
│   └── _layout.tsx       # Tab navigation
├── _layout.tsx           # Root layout with providers
└── index.tsx             # Entry point with auth routing

components/
└── AuthGuard.tsx         # Auth guard component

hooks/
└── useProtectedRoute.ts  # Protected route hook

store/
├── authSlice.ts          # Redux auth slice
├── index.ts              # Redux store configuration
└── hooks.ts              # Typed Redux hooks

services/
└── storage.ts            # MMKV storage service

utils/
└── validations/
    └── auth.ts           # Auth form validation

constants/
├── config.ts             # API endpoints & storage keys
└── theme.ts              # Theme constants
```

## Testing the Authentication

### Manual Testing Steps

1. **First Launch (Unauthenticated)**
   - App should redirect to login screen
   - No user data should be present

2. **Login with Valid Credentials**
   - Use: `emilys` / `emilyspass`
   - Should show loading indicator
   - Should navigate to home screen
   - Should display user information

3. **Login with Invalid Credentials**
   - Enter wrong username/password
   - Should show error message
   - Should not navigate away

4. **Form Validation**
   - Leave fields empty and submit
   - Should show validation errors
   - Errors should clear when typing

5. **Session Persistence**
   - Login successfully
   - Close and reopen app
   - Should remain logged in
   - Should show home screen immediately

6. **Logout**
   - Click logout button
   - Confirm in dialog
   - Should redirect to login
   - Should clear all stored data

7. **Token Validation**
   - Login successfully
   - Manually clear token from MMKV (if possible)
   - Restart app
   - Should auto-logout and redirect to login

## Next Steps

Potential enhancements for the authentication system:

1. **Refresh Token Flow**: Implement automatic token refresh
2. **Biometric Authentication**: Add fingerprint/face ID support
3. **Remember Me**: Option to stay logged in
4. **Password Reset**: Forgot password functionality
5. **Social Login**: OAuth integration (Google, Facebook, etc.)
6. **Multi-factor Authentication**: SMS/Email verification
7. **Session Timeout**: Auto-logout after inactivity
8. **Login History**: Track login attempts and devices

## Troubleshooting

### Common Issues

**Issue**: MMKV crashes on web
- **Solution**: The app uses fallback in-memory storage on web platforms

**Issue**: Token validation fails on startup
- **Solution**: Check internet connection and API availability

**Issue**: User gets stuck on loading screen
- **Solution**: Check Redux state initialization in _layout.tsx

**Issue**: Navigation doesn't work after login
- **Solution**: Verify router.replace() calls in login screen and index.tsx

## Dependencies

- `axios`: ^1.12.2 - HTTP client
- `react-native-mmkv`: ^2.12.2 - Fast, encrypted storage
- `@reduxjs/toolkit`: ^2.9.0 - State management
- `react-redux`: ^9.2.0 - React bindings for Redux
- `yup`: ^1.7.1 - Form validation
- `expo-router`: ~6.0.11 - File-based routing

## Conclusion

The authentication system is fully implemented with:
- ✅ DummyJSON API integration
- ✅ Secure token storage with MMKV
- ✅ Login screen with validation
- ✅ Redux state management
- ✅ Protected routes
- ✅ Session restoration
- ✅ Token validation
- ✅ User profile display
- ✅ Logout functionality
- ✅ Error handling
- ✅ Loading states

The system is production-ready and follows React Native best practices.
