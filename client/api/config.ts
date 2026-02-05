export const API_BASE_URL = "https://innermapai-production.up.railway.app/api";

export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "server-visitor";

  let id = localStorage.getItem("visitorId");

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("visitorId", id);
  }

  return id;
}

export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const visitorId = getOrCreateVisitorId();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "visitor-id": visitorId,
    ...((options.headers as Record<string, string>) || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `API request failed with status ${response.status}`,
    );
  }

  return (await response.json()) as T;
};
