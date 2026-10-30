import { useCallback, useMemo, useState } from "react";
import { apiRequest, type ApiResult, type HttpMethod } from "../services/apiClient";
import { invalidateQueries } from "./useDataFetcher";
import { showToast } from "../utils/toast";

export type CrudOptions = {
  /** Show a toast with the server's message. Default: yes for writes, no for GET. */
  toast?: boolean;
  /**
   * Cached reads to refresh after the request, by path prefix.
   * e.g. "products" refreshes "products/list?page=1...", so the table shows the change.
   */
  invalidate?: string;
};

/**
 * How components talk to the API. Every method returns an ApiResult and never throws,
 * so you only check `result.ok`:
 *
 *   const { post, put, remove, isLoading } = useCrud();
 *
 *   const result = await post("products", values, { invalidate: "products" });
 *   if (result.ok) closeDrawer();
 *
 * `isLoading` is true while a request is running (use it for spinners on buttons).
 */
export default function useCrud() {
  const [pending, setPending] = useState(0);

  const request = useCallback(
    async <T = unknown>(method: HttpMethod, path: string, body?: unknown, options: CrudOptions = {}): Promise<ApiResult<T>> => {
      setPending((count) => count + 1);
      try {
        const result = await apiRequest<T>(method, path, body);

        const toast = options.toast ?? method !== "GET";
        if (toast && result.message) showToast(result.message, result.ok ? "success" : "danger");

        if (options.invalidate) invalidateQueries(options.invalidate);
        return result;
      } finally {
        setPending((count) => count - 1);
      }
    },
    []
  );

  // useMemo keeps the same functions between renders, so they are safe in useEffect dependencies.
  const methods = useMemo(
    () => ({
      get: <T = unknown>(path: string, options?: CrudOptions) => request<T>("GET", path, undefined, options),
      post: <T = unknown>(path: string, body?: unknown, options?: CrudOptions) => request<T>("POST", path, body, options),
      put: <T = unknown>(path: string, body?: unknown, options?: CrudOptions) => request<T>("PUT", path, body, options),
      remove: <T = unknown>(path: string, options?: CrudOptions) => request<T>("DELETE", path, undefined, options),
    }),
    [request]
  );

  return { ...methods, isLoading: pending > 0 };
}
