import { useMemo } from "react";
import { UserProfileResponse } from "@/api/types";



export function useProfileConnection(profile?: UserProfileResponse) {
  const hasProfile = Boolean(profile?._id);

  const isTokenExpired = useMemo(() => {
    if (!profile?.todoistTokenExpiry || !profile?.todoistConnectedAt) {
      return true;
    }

    const expirySeconds = Number(profile.todoistTokenExpiry);
    if (!Number.isFinite(expirySeconds)) return true;

    const expiryTime =
      new Date(profile.todoistConnectedAt).getTime() + expirySeconds * 1000;

    return Date.now() > expiryTime;
  }, [profile]);

  const isTodoistConnected =
    Boolean(profile?.todoistAccessToken) && !isTokenExpired;

  return {
    profile,
    hasProfile,
    isTodoistConnected,
    isTokenExpired,
  };
}
