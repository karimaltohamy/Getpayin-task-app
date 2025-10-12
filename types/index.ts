// App State Types
export interface AppState {
  isLocked: boolean;
  lastActivityTime: number;
  isOffline: boolean;
}

// Navigation Types
export type RootStackParamList = {
  index: undefined;
  "(tabs)": undefined;
  "auth/login": undefined;
};

export type TabsParamList = {
  index: undefined;
  category: undefined;
};
