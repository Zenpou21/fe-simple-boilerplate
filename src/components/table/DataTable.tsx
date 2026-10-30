import type { ReactNode } from "react";
import {
  Input,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn as HeroTableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Search } from "lucide-react";
import type useServerTable from "../../hooks/useServerTable";
import { ROWS_PER_PAGE_OPTIONS } from "../../hooks/useServerTable";
import type { TableColumn } from "./types";

type DataTableProps<T> = {
  columns: TableColumn[];
  /** The table state: `const table = useServerTable<Product>("products/list");` */
  table: ReturnType<typeof useServerTable<T>>;
  /** What to show in one cell. Called for every row and column. */
  renderCell: (item: T, columnKey: string) => ReactNode;
  /** Extra controls next to the search box, e.g. a filter dropdown. */
  toolbar?: ReactNode;
  emptyContent?: string;
};

/**
 * The standard table: search box, rows per page, sortable headers and paging.
 * All the state lives in useServerTable; this component only draws it.
 *
 *   const table = useServerTable<Product>("products/list");
 *   <DataTable columns={columns} table={table} renderCell={renderCell} />
 */
export default function DataTable<T extends { id: number }>({
  columns,
  table,
  renderCell,
  toolbar,
  emptyContent = "No records found.",
}: DataTableProps<T>) {
  const firstRow = table.total === 0 ? 0 : (table.page - 1) * table.rowsPerPage + 1;
  const lastRow = Math.min(table.page * table.rowsPerPage, table.total);

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          size="sm"
          isClearable
          className="w-full sm:max-w-xs"
          placeholder="Search..."
          startContent={<Search size={16} className="text-default-400" />}
          value={table.search}
          onValueChange={table.setSearch}
          onClear={() => table.setSearch("")}
        />
        {toolbar}
        <Select
          size="sm"
          aria-label="Rows per page"
          className="ml-auto w-28"
          selectedKeys={[String(table.rowsPerPage)]}
          onSelectionChange={(keys) => table.setRowsPerPage(Number(Array.from(keys)[0] ?? ROWS_PER_PAGE_OPTIONS[0]))}
        >
          {ROWS_PER_PAGE_OPTIONS.map((size) => (
            <SelectItem key={String(size)}>{`${size} rows`}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Table */}
      <Table
        aria-label="Data table"
        sortDescriptor={table.sortDescriptor}
        onSortChange={table.setSortDescriptor}
        classNames={{ wrapper: "p-0 shadow-none border border-divider", th: "text-xs" }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <HeroTableColumn key={column.uid} allowsSorting={column.sortable} align={column.align ?? "start"}>
              {column.name}
            </HeroTableColumn>
          )}
        </TableHeader>
        <TableBody
          items={table.items}
          isLoading={table.isLoading}
          loadingContent={<Spinner />}
          emptyContent={table.isLoading ? " " : emptyContent}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, String(columnKey))}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-default-500">
        <span>
          Showing {firstRow}–{lastRow} of {table.total}
        </span>
        {table.pages > 1 && (
          <Pagination size="sm" showControls page={table.page} total={table.pages} onChange={table.setPage} />
        )}
      </div>
    </div>
  );
}
