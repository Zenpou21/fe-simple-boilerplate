import { useState } from "react";
import type { SortDescriptor } from "@heroui/react";
import useDataFetcher from "./useDataFetcher";
import useDebouncedValue from "./useDebouncedValue";

/** What a list endpoint returns (the API's PaginatedListTrait). */
export type ListResponse<T> = {
  items: T[];
  meta: { total: number; page: number; per_page: number; last_page: number };
};

export const ROWS_PER_PAGE_OPTIONS = [10, 20, 50];

/**
 * The state of a table whose rows come from the API one page at a time: page, rows per page,
 * sort, search and filters. The API does the work, so a table of 100,000 rows loads as fast as 10.
 *
 * Every change builds a new URL like
 *   products/list?page=2&per_page=10&sort_by=name&sort_dir=asc&search=pen&filters[category][]=Office
 * and SWR caches each one.
 *
 * @param path    The list endpoint, e.g. "products/list".
 * @param filters Fixed filters from the page, e.g. { category: "Office" } from a dropdown.
 */
export default function useServerTable<T>(path: string, filters: Record<string, string> = {}) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPageState] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [sortDescriptor, setSortDescriptorState] = useState<SortDescriptor>({ column: "id", direction: "descending" });
  const [search, setSearchState] = useState("");

  // Wait until the user stops typing before searching.
  const debouncedSearch = useDebouncedValue(search.trim());

  const query = new URLSearchParams({
    page: String(page),
    per_page: String(rowsPerPage),
    sort_by: String(sortDescriptor.column),
    sort_dir: sortDescriptor.direction === "descending" ? "desc" : "asc",
  });
  if (debouncedSearch) query.set("search", debouncedSearch);
  Object.entries(filters).forEach(([column, value]) => {
    if (value) query.append(`filters[${column}][]`, value);
  });

  // keepPreviousData: the old page stays on screen while the next one loads (no flicker).
  const { data, isLoading } = useDataFetcher<ListResponse<T>>(`${path}?${query}`, { keepPreviousData: true });

  // A new search, sort or page size starts again at page 1.
  const setSearch = (value: string) => {
    setSearchState(value);
    setPage(1);
  };
  const setSortDescriptor = (descriptor: SortDescriptor) => {
    setSortDescriptorState(descriptor);
    setPage(1);
  };
  const setRowsPerPage = (value: number) => {
    setRowsPerPageState(value);
    setPage(1);
  };

  return {
    items: data?.items ?? [],
    total: data?.meta.total ?? 0,
    pages: data?.meta.last_page ?? 1,
    isLoading,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    sortDescriptor,
    setSortDescriptor,
    search,
    setSearch,
  };
}
