export const API_BASE_URL = "http://localhost:4000/api";

export function getOrCreateVisitorId(): string | null {
  if (typeof window === "undefined") return null;

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

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    ...options,
    headers: {
      "visitor-id": getOrCreateVisitorId() as string,
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
