export const API_BASE_URL = "https://innermapai-production.up.railway.app/api";

//  Visitor (Guest) Identity
export function getOrCreateVisitorId(): string | null {
  if (typeof window === "undefined") return null;

  let id = localStorage.getItem("visitorId");

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("visitorId", id);
  }

  return id;
}

//  Wallet Identity
export function getWalletAddress(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("walletAddress");
}

export function setWalletAddress(address: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("walletAddress", address);
}

export function clearWalletAddress() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("walletAddress");
}

//  API Client
export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const walletAddress = getWalletAddress();
  const visitorId = getOrCreateVisitorId();


  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (visitorId) {
    headers["visitor-id"] = visitorId;
  }

  if (walletAddress) {
    headers["wallet-address"] = walletAddress;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
};