# GetPayIn Task App

A modern React Native e-commerce application built with Expo, featuring secure authentication, biometric lock, dark mode, and offline-first capabilities.

## Features

### Authentication & Security

- Secure login with token-based authentication
- Biometric authentication (Face ID/Touch ID/Iris)
- Auto-lock after 1 hour of inactivity
- Test credentials: `emilys / emilyspass`

### Product Management

- Browse products with infinite scroll
- Filter products by categories
- Search and view product details
- SuperAdmin can delete products

### User Experience

- Dark mode with system preference sync
- Offline support with automatic data caching
- Network status indicator
- Smooth animations and haptic feedback

## Tech Stack

- **Framework**: React Native + Expo
- **State Management**: Redux Toolkit + React Query
- **Storage**: MMKV (high-performance local storage)
- **UI**: React Navigation, Expo Components
- **Forms**: Formik + Yup validation
- **API**: Axios with interceptors

## Setup and How to Run

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **iOS Simulator** (Mac only) or **Android Emulator**
- **Expo CLI** (optional, will be installed automatically)

### Step-by-Step Setup

1. **Clone or download the project**

   ```bash
   cd GetPayIn-task-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

   This will open the Expo developer tools in your browser.

4. **Run on your preferred platform**

   Press the corresponding key in the terminal:

   - Press **`i`** for iOS Simulator (Mac only)
   - Press **`a`** for Android Emulator
   - Press **`w`** for Web browser

   Or run directly:

   ```bash
   npm run ios       # iOS Simulator
   npm run android   # Android Emulator
   npm run web       # Web browser
   ```

5. **Login to the app**

   Use the test credentials:

   - **Username**: `emilys`
   - **Password**: `emilyspass`

   This user has **SuperAdmin** role and can delete products.

### Troubleshooting

- If you encounter module errors, try clearing cache:

  ```bash
  npm start -- --clear
  ```

- For iOS: Make sure Xcode is installed
- For Android: Make sure Android Studio and an emulator are set up

## Project Structure

```
app/                  # File-based routing
├── auth/            # Authentication screens
└── (tabs)/          # Main app tabs (Home, Category, Sign Out)

components/           # Reusable UI components
├── products/        # Product-related components
├── shared/          # Shared theme-aware components
└── dialogs/         # Dialog components

store/               # Redux slices
├── authSlice.ts     # Authentication state
├── biometricSlice.ts # Biometric lock state
└── themeSlice.ts    # Dark mode theme state

api/                 # API service layer
├── auth/            # Auth endpoints
└── products/        # Product endpoints

hooks/               # Custom React hooks
services/            # Business logic & configuration
constants/           # Theme, config, and constants
utils/               # Helper functions and validation
```

## Key Features Explained

### Offline-First Caching

The app uses React Query with persistent storage to cache all data locally. This means:

- Products load instantly from cache
- App works without internet connection
- Data automatically syncs when online

### Biometric Lock

The app automatically locks after 1 hour of inactivity or when backgrounded, requiring biometric authentication to unlock.

### Dark Mode

Three theme modes available:

- Light mode
- Dark mode
- System (follows device settings)

Theme preference is saved and restored on app restart.

### Role-Based Access

- **SuperAdmin**: Can view and delete products
- **Regular User**: Can view products only

## Implementation Details

### Chosen Category for Category Screen

The **Category Screen** dynamically loads all available categories from the API and displays them as horizontal scrollable chips. The **first category** in the list is automatically selected on load. Users can:

- Scroll through all available categories (beauty, fragrances, furniture, groceries, etc.)
- Tap any category to filter products
- See the total count of products in the selected category

### SuperAdmin User

The SuperAdmin user for testing is:

- **Username**: `emilys`
- **Password**: `emilyspass`
- **Role**: `superadmin`

This user has delete permissions and can remove products from the product list in the Category screen.

## Build for Production

```bash
npm run build:android  # Build Android APK
npm run build:ios      # Build iOS IPA
```

## Scripts

```bash
npm start              # Start Expo dev server
npm run android        # Run on Android
npm run ios           # Run on iOS
npm run web           # Run on web
npm run lint          # Run ESLint
```

## API Integration

The app connects to the DummyJSON API:

- Base URL: `https://dummyjson.com`
- Endpoints: Auth, Products, Categories
- Automatic token refresh on expiration

## Storage

All data is stored locally using MMKV for optimal performance:

- Authentication tokens
- User preferences (theme, biometric)
- Product cache (React Query)
- Session data

## Trade-offs and Design Decisions

### Trade-offs Made

1. **React Query vs Custom API Layer**

   - **Chosen**: React Query for data fetching and caching
   - **Trade-off**: Added library dependency but gained automatic caching, refetching, and offline support with minimal code
   - **Benefit**: Reduced boilerplate code by ~60% compared to custom fetch logic

2. **MMKV vs AsyncStorage**

   - **Chosen**: MMKV for storage
   - **Trade-off**: Slightly larger bundle size
   - **Benefit**: 30x faster read/write operations, synchronous API

3. **Expo Router vs React Navigation**

   - **Chosen**: Expo Router (file-based routing)
   - **Trade-off**: Less flexible for complex routing patterns
   - **Benefit**: Cleaner project structure, automatic deep linking, type-safe navigation

4. **Redux Toolkit + React Query**

   - **Chosen**: Both together (Redux for client state, React Query for server state)
   - **Trade-off**: Two state management libraries
   - **Benefit**: Clear separation of concerns - Redux handles auth/theme/biometric, React Query handles API data

5. **Optimistic Updates**
   - **Chosen**: Implemented for product deletion
   - **Trade-off**: More complex error handling
   - **Benefit**: Instant UI feedback, better perceived performance

### If I Had More Time

1.  I would improve the persistent storage by using only MMKV for better performance and consistency.
2.  I would test the admin user flow thoroughly to ensure everything works as expected.

#### Features I Would Add

- **Search Functionality**: Product search with debounced input and search history
- **Product Details Screen**: Full product page with images carousel, reviews, and related products
- **Cart & Checkout**: Shopping cart functionality with persistent state
- **User Profile**: Profile screen with order history and settings

## License

Private project
