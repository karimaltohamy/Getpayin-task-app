import { setLocked, setRequiresUnlock } from "@/store/biometricSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

export function useAppState() {
  const dispatch = useAppDispatch();
  const { isEnabled, isAuthenticated } = useAppSelector((state) => ({
    isEnabled: state.biometric.isEnabled,
    isAuthenticated: state.auth.isAuthenticated,
  }));

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        // app is going to background
        if (
          appState.current.match(/active/) &&
          nextAppState.match(/inactive|background/)
        ) {
          if (isEnabled && isAuthenticated) {
            // lock immediately when app goes to background
            dispatch(setLocked(true));
          }
        }

        // app is coming to foreground
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          if (isEnabled && isAuthenticated) {
            //require unlock when returning to foreground
            dispatch(setRequiresUnlock(true));
          }
        }

        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [dispatch, isEnabled, isAuthenticated]);

  return {
    currentAppState: appState.current,
  };
}
