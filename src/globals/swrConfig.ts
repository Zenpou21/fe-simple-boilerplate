import type { SWRConfiguration } from "swr";

/**
 * Defaults for every cached read (useDataFetcher). One call can override any of them, e.g.
 * `useDataFetcher("products/list", { refreshInterval: 0 })`.
 */
const swrConfig: SWRConfiguration = {
  // Refresh lists every 30 seconds, but only while the browser tab is visible.
  refreshInterval: 30000,
  refreshWhenHidden: false,
  // Refresh as soon as the user comes back to the tab.
  revalidateOnFocus: true,
  // Components asking for the same path within 5 seconds share one request.
  dedupingInterval: 5000,
};

export default swrConfig;
