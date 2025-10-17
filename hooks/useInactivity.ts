import { BIOMETRIC_LOCK_TIMEOUT } from "@/constants/config";
import { setLocked, updateLastActiveTime } from "@/store/biometricSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useCallback, useEffect, useRef } from "react";
import { PanResponder } from "react-native";

export function useInactivity() {
  const dispatch = useAppDispatch();
  const { isEnabled, isLocked, isAuthenticated } = useAppSelector((state) => ({
    isEnabled: state.biometric.isEnabled,
    isLocked: state.biometric.isLocked,
    isAuthenticated: state.auth.isAuthenticated,
  }));

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = useCallback(() => {
    // don't reset timer if biometric is disabled or user is not authenticated
    if (!isEnabled || !isAuthenticated) {
      return;
    }

    // clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // update last active time in Redux
    if (!isLocked) {
      dispatch(updateLastActiveTime());
    }

    // set new timer
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
    // start inactivity timer when component mounts
    if (isEnabled && isAuthenticated && !isLocked) {
      resetInactivityTimer();
    }

    return () => {
      clearInactivityTimer();
    };
  }, [
    isEnabled,
    isAuthenticated,
    isLocked,
    resetInactivityTimer,
    clearInactivityTimer,
  ]);

  // create pan responder to detect touch events
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
