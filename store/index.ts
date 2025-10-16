import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import authReducer from "./authSlice";
import biometricReducer from "./biometricSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    biometric: biometricReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
