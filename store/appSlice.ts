import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../types';

const initialState: AppState = {
  isLocked: false,
  lastActivityTime: Date.now(),
  isOffline: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLocked: (state, action: PayloadAction<boolean>) => {
      state.isLocked = action.payload;
    },

    updateLastActivity: (state) => {
      state.lastActivityTime = Date.now();
    },

    setOffline: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
  },
});

export const { setLocked, updateLastActivity, setOffline } = appSlice.actions;

export default appSlice.reducer;
