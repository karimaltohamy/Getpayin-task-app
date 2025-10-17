import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // initial check
    NetInfo.fetch().then((state) => {
      const online = state.isConnected ?? true;
      setIsOnline(online);
      onlineManager.setOnline(online);
    });

    // set up React Query online manager to use netInfo
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = state.isConnected ?? true;
      setIsOnline(online);
      onlineManager.setOnline(online);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return isOnline;
}
