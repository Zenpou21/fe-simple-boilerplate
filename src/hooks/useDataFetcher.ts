import useSWR, { mutate, type SWRConfiguration } from "swr";
import { ApiError, apiRequest } from "../services/apiClient";

/**
 * Cached reads with SWR. The API path is the cache key, so two components reading the same
 * path share one request, and the data refreshes on its own (see globals/swrConfig.ts).
 *
 *   const { data, isLoading } = useDataFetcher<Product[]>("products/options");
 *
 * Pass null instead of a path to wait, e.g. `useDataFetcher(id ? `products/${id}` : null)`.
 */
async function fetcher<T>(path: string): Promise<T> {
  const result = await apiRequest<T>("GET", path);
  if (!result.ok) throw new ApiError(result);
  return result.data as T;
}

export default function useDataFetcher<T = unknown>(path: string | null, options?: SWRConfiguration<T, ApiError>) {
  const { data, error, isLoading, mutate: refresh } = useSWR<T, ApiError>(path, fetcher<T>, options);
  return { data, error, isLoading, refresh };
}

/**
 * Refreshes every cached read whose path starts with the prefix.
 * "products" refreshes "products/list?page=2" and "products/options", but not "productsXYZ".
 * useCrud calls this for you with its `invalidate` option.
 */
export function invalidateQueries(prefix: string) {
  return mutate((key) => typeof key === "string" && (key === prefix || key.startsWith(`${prefix}/`)));
}
