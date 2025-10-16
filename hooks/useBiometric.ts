import {
  restoreBiometricSettings,
  setBiometricSupported,
  setUnlocked,
} from "@/store/biometricSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import * as LocalAuthentication from "expo-local-authentication";
import { useCallback, useEffect, useState } from "react";

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  biometricType?: LocalAuthentication.AuthenticationType[];
}

export function useBiometric() {
  const dispatch = useAppDispatch();
  const { isBiometricSupported, isEnabled } = useAppSelector(
    (state) => state.biometric
  );

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // check if device supports biometric authentication
  const checkBiometricSupport = useCallback(async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const isSupported = compatible && enrolled;

      dispatch(setBiometricSupported(isSupported));

      if (isSupported) {
        const types =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
        return {
          isSupported: true,
          types,
        };
      }

      return {
        isSupported: false,
        types: [],
      };
    } catch (error) {
      console.error("Error checking biometric support:", error);
      dispatch(setBiometricSupported(false));
      return {
        isSupported: false,
        types: [],
      };
    }
  }, [dispatch]);

  // authenticate with biometrics
  const authenticate = useCallback(
    async (options?: {
      promptMessage?: string;
      cancelLabel?: string;
      disableDeviceFallback?: boolean;
    }): Promise<BiometricAuthResult> => {
      setIsAuthenticating(true);

      try {
        //check if device supports biometric
        const support = await checkBiometricSupport();

        if (!support.isSupported) {
          setIsAuthenticating(false);
          return {
            success: false,
            error: "Biometric authentication is not available on this device",
          };
        }

        // attempt authentication
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: options?.promptMessage || "Authenticate to unlock",
          cancelLabel: options?.cancelLabel || "Cancel",
          disableDeviceFallback: options?.disableDeviceFallback || false,
          fallbackLabel: "Use Password",
        });

        setIsAuthenticating(false);

        if (result.success) {
          dispatch(setUnlocked());
          return {
            success: true,
            biometricType: support.types,
          };
        } else {
          return {
            success: false,
            error: result.error || "Authentication failed",
          };
        }
      } catch (error) {
        setIsAuthenticating(false);
        console.error("Biometric authentication error:", error);
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Authentication failed",
        };
      }
    },
    [dispatch, checkBiometricSupport]
  );

  // get biometric type name for display
  const getBiometricTypeName = useCallback(async (): Promise<string> => {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

    if (
      types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
    ) {
      return "Face ID";
    } else if (
      types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
    ) {
      return "Touch ID";
    } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return "Iris";
    }

    return "Biometric";
  }, []);

  // Initialize biometric on mount
  useEffect(() => {
    checkBiometricSupport();
    dispatch(restoreBiometricSettings());
  }, [checkBiometricSupport, dispatch]);

  return {
    isBiometricSupported,
    isEnabled,
    isAuthenticating,
    authenticate,
    checkBiometricSupport,
    getBiometricTypeName,
  };
}
