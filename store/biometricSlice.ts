import { StorageKeys } from "@/constants/config";
import { storageHelper } from "@/services/mmkvStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BiometricState {
  isLocked: boolean;
  isEnabled: boolean;
  isBiometricSupported: boolean;
  lastActiveTime: number | null;
  requiresUnlock: boolean;
}

const initialState: BiometricState = {
  isLocked: false,
  isEnabled: true,
  isBiometricSupported: false,
  lastActiveTime: Date.now(),
  requiresUnlock: false,
};

const biometricSlice = createSlice({
  name: "biometric",
  initialState,
  reducers: {
    setLocked: (state, action: PayloadAction<boolean>) => {
      state.isLocked = action.payload;
      if (action.payload) {
        state.requiresUnlock = true;
      }
    },

    setUnlocked: (state) => {
      state.isLocked = false;
      state.requiresUnlock = false;
      state.lastActiveTime = Date.now();
    },

    setBiometricEnabled: (state, action: PayloadAction<boolean>) => {
      state.isEnabled = action.payload;
      storageHelper.setBoolean(StorageKeys.BIOMETRIC_ENABLED, action.payload);
    },

    setBiometricSupported: (state, action: PayloadAction<boolean>) => {
      state.isBiometricSupported = action.payload;
    },

    updateLastActiveTime: (state) => {
      state.lastActiveTime = Date.now();
      // Reset lock requirement if user is active
      if (!state.isLocked) {
        state.requiresUnlock = false;
      }
    },

    setRequiresUnlock: (state, action: PayloadAction<boolean>) => {
      state.requiresUnlock = action.payload;
    },

    restoreBiometricSettings: (state) => {
      const isEnabled = storageHelper.getBoolean(StorageKeys.BIOMETRIC_ENABLED);
      state.isEnabled = isEnabled !== undefined ? isEnabled : true;
    },
  },
});

export const {
  setLocked,
  setUnlocked,
  setBiometricEnabled,
  setBiometricSupported,
  updateLastActiveTime,
  setRequiresUnlock,
  restoreBiometricSettings,
} = biometricSlice.actions;

export default biometricSlice.reducer;
