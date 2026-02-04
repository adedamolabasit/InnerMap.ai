"use client";

import { useEffect, useRef } from "react";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";

import { setWalletAddress} from "@/api/config";
import { useAuthUser } from "@/api/hooks/useMutate";

export function ConnectWallet() {
  const { user, primaryWallet } = useDynamicContext();
  const walletAddress = primaryWallet?.address;
  const connected = Boolean(user && primaryWallet);
  const { mutate: authenticateUser} = useAuthUser();

  const hasAuthedRef = useRef(false);

  const handleAuthentication = () => {
    authenticateUser({
      onSuccess: (data: any) => {
        console.log(data, "kkk")
         if (data.token) {
          localStorage.setItem("token", data.token);
          console.log("Token saved to localStorage");
        }

 
      },
    });
  };

  useEffect(() => {
    if (!connected) {
      localStorage.removeItem("walletAddress");
    }

    setWalletAddress(walletAddress as string);

    if (!hasAuthedRef.current) {
      hasAuthedRef.current = true;
      handleAuthentication();
    }
  }, [walletAddress, connected, handleAuthentication]);

  return <DynamicWidget />;
}
