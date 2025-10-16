import { useEffect, useRef, useCallback } from "react";
import { AppState, PanResponder } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLocked, updateLastActiveTime } from "@/store/biometricSlice";
import { BIOMETRIC_LOCK_TIMEOUT } from "@/constants/config";

export function useInactivity() {
  const dispatch = useAppDispatch();
  const { isEnabled, isLocked, isAuthenticated } = useAppSelector((state) => ({
    isEnabled: state.biometric.isEnabled,
    isLocked: state.biometric.isLocked,
    isAuthenticated: state.auth.isAuthenticated,
  }));

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = useCallback(() => {
    // Don't reset timer if biometric is disabled or user is not authenticated
    if (!isEnabled || !isAuthenticated) {
      return;
    }

    // Clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Update last active time in Redux
    if (!isLocked) {
      dispatch(updateLastActiveTime());
    }

    // Set new timer
    inactivityTimerRef.current = setTimeout(() => {
      if (isEnabled && isAuthenticated && !isLocked) {
        dispatch(setLocked(true));
      }
    }, BIOMETRIC_LOCK_TIMEOUT);
  }, [dispatch, isEnabled, isAuthenticated, isLocked]);

  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Start inactivity timer when component mounts
    if (isEnabled && isAuthenticated && !isLocked) {
      resetInactivityTimer();
    }

    return () => {
      clearInactivityTimer();
    };
  }, [isEnabled, isAuthenticated, isLocked, resetInactivityTimer, clearInactivityTimer]);

  // Create pan responder to detect touch events
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        resetInactivityTimer();
        return false;
      },
      onMoveShouldSetPanResponder: () => {
        resetInactivityTimer();
        return false;
      },
      onStartShouldSetPanResponderCapture: () => {
        resetInactivityTimer();
        return false;
      },
      onMoveShouldSetPanResponderCapture: () => {
        resetInactivityTimer();
        return false;
      },
    })
  ).current;

  return {
    panResponder,
    resetInactivityTimer,
    clearInactivityTimer,
  };
}
