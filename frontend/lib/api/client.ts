function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "");
  }

  // In browser, if deployed on a public host (not localhost), warn or handle relative fallback
  if (typeof window !== "undefined") {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (!isLocalhost) {
      // Production deployed on Vercel/cloud without NEXT_PUBLIC_API_BASE_URL
      // Return empty string or same origin so it doesn't try calling localhost on client device
      return "";
    }
  }

  return "http://localhost:5001/api";
}

export const API_BASE_URL = getApiBaseUrl();

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl();

  // If deployed in production and no public backend URL is configured
  if (!baseUrl && typeof window !== "undefined") {
    throw new ApiError(
      "Unable to connect to DIKSHA backend: NEXT_PUBLIC_API_BASE_URL is not configured for this deployment. Please set the public FastAPI backend URL in your deployment environment variables.",
      503
    );
  }

  // Ensure path starts with slash and join cleanly
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const fullUrl = `${baseUrl}${cleanPath}`;

  let response: Response;
  try {
    response = await fetch(fullUrl, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers
      }
    });
  } catch (networkError: unknown) {
    const errorMsg =
      networkError instanceof Error ? networkError.message : String(networkError);
    throw new ApiError(
      `Unable to connect to the DIKSHA backend at ${fullUrl || "server"}. Please verify that the API server is running and accessible. (${errorMsg})`,
      0
    );
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = (await response.json()) as { detail?: string };
      if (data.detail) {
        message = data.detail;
      }
    } catch {
      // Keep the generic message when the backend does not return JSON.
    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

