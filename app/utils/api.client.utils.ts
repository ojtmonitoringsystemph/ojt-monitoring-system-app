import type { EnvType, UnifiedURLMapping } from "../types/api-clients.types";
import { getUserFromLocalStorage } from "./auth.helper";

class APIClientBuilder {
  private token: string = "";
  private matchedType: EnvType | null = null;

  private clientURLs: Record<EnvType, string> = {
    local: "",
    test: "",
    development: "",
    production: "",
  };

  private serverURLs: Record<EnvType, string> = {
    local: "",
    test: "",
    development: "",
    production: "",
  };

  private customURLs: Record<string, string> = {};

  // ✅ Accept a raw token string
  config(options: { token: string }) {
    this.token = options.token;
    return this;
  }

  // ✅ Save URLs and determine matched environment
  url(mappings: UnifiedURLMapping[]) {
    const currentOrigin = location.origin;

    for (const { key, type, client, server } of mappings) {
      this.clientURLs[type] = client;
      this.serverURLs[type] = server;
      this.customURLs[key] = server;

      try {
        const parsed = new URL(client, location.href);
        if (parsed.origin === currentOrigin) {
          this.matchedType = type;
        }
      } catch {
        // ignore invalid URL
      }
    }

    return this;
  }

  api(envOrKey?: EnvType | string) {
    let baseURL: string;

    if (!envOrKey) {
      baseURL = this.matchedType
        ? this.serverURLs[this.matchedType]
        : this.serverURLs.production;
    } else if (
      ["local", "test", "development", "production"].includes(envOrKey)
    ) {
      baseURL = this.serverURLs[envOrKey as EnvType];
    } else {
      baseURL = this.customURLs[envOrKey] || "";
    }

    const request = async (
      method: string,
      url: string,
      data?: Record<string, any> | FormData,
      options?: { headers?: HeadersInit; withAuth?: boolean }
    ) => {
      const isFormData = data instanceof FormData;
      const withAuth = options?.withAuth !== false;
      const token = withAuth
        ? this.token || getUserFromLocalStorage()?.accessToken
        : undefined;

      const headers: Record<string, string> = {
        ...((token && { Authorization: `Bearer ${token}` }) || {}),
        ...(options?.headers || {}),
      };

      // Only set Content-Type for non-FormData
      if (!isFormData && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }

      const config: RequestInit = {
        method,
        headers,
        credentials: "include",
      };

      let fullUrl = baseURL + url;

      // ✅ Handle GET query parameters
      if (method.toUpperCase() === "GET" && data && !isFormData) {
        const params = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
          }
        });
        const queryString = params.toString();
        fullUrl += queryString ? `?${queryString}` : "";
      } else if (data) {
        config.body = isFormData ? data : JSON.stringify(data);
      }

      const response = await fetch(fullUrl, config);

      if (!response.ok) {
        const contentType = response.headers.get("content-type") || "";
        const errorData = contentType.includes("application/json")
          ? await response.json().catch(() => ({}))
          : { message: await response.text().catch(() => "") };

        throw { status: response.status, ...errorData };
      }

      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        return response.json();
      }

      return null;
    };

    return {
      get: (
        url: string,
        params?: Record<string, any>,
        options?: { headers?: HeadersInit; withAuth?: boolean }
      ) => request("GET", url, params, options),
      getAll: (
        url: string,
        params?: Record<string, any>,
        options?: { headers?: HeadersInit; withAuth?: boolean }
      ) => request("GET", url, params, options),
      post: (
        url: string,
        data: any,
        options?: { headers?: HeadersInit; withAuth?: boolean }
      ) => request("POST", url, data, options),
      put: (
        url: string,
        data: any,
        options?: { headers?: HeadersInit; withAuth?: boolean }
      ) => request("PUT", url, data, options),
      patch: (
        url: string,
        data: any,
        options?: { headers?: HeadersInit; withAuth?: boolean }
      ) => request("PATCH", url, data, options),
      delete: (
        url: string,
        options?: { headers?: HeadersInit; withAuth?: boolean }
      ) => request("DELETE", url, undefined, options),
    };
  }
}

export const apiClient = () => new APIClientBuilder();
