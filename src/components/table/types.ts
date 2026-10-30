/** One column of a DataTable. */
export type TableColumn = {
  /** The header text. */
  name: string;
  /** The key renderCell() gets. For sortable columns it is also the API's `sort_by` value. */
  uid: string;
  sortable?: boolean;
  align?: "start" | "center" | "end";
};
