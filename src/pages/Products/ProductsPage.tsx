import { useCallback, useState } from "react";
import { Button, Select, SelectItem, useDisclosure } from "@heroui/react";
import { Plus } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import ConfirmModal from "../../components/common/ConfirmModal";
import DataTable from "../../components/table/DataTable";
import RowActions, { type RowAction } from "../../components/table/RowActions";
import StatusDot from "../../components/table/StatusDot";
import type { TableColumn } from "../../components/table/types";
import useCrud from "../../hooks/useCrud";
import useServerTable from "../../hooks/useServerTable";
import { PRODUCT_CATEGORIES, PRODUCT_QUERIES } from "../../constants/product";
import type { Product } from "../../types/product";
import { formatMoney } from "../../utils/format";
import ProductForm, { type FormMode } from "./ProductForm";

/**
 * THE CRUD EXAMPLE. Copy this folder to start a new module.
 *
 *   Read   -> useServerTable("products/list") + <DataTable>      (this file)
 *   Create -> "Add Product" opens <ProductForm mode="Add">         (ProductForm.tsx)
 *   Update -> the Edit icon opens <ProductForm mode="Edit">        (ProductForm.tsx)
 *   Delete -> the Delete icon opens <ConfirmModal>, then remove()  (this file)
 */

// `uid` must match the API's column keys (ProductController::onGetList) to sort by it.
const columns: TableColumn[] = [
  { name: "CODE", uid: "code", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "CATEGORY", uid: "category", sortable: true },
  { name: "PRICE", uid: "price", sortable: true, align: "end" },
  { name: "STOCK", uid: "stock", sortable: true, align: "end" },
  { name: "STATUS", uid: "is_active", sortable: true },
  { name: "ACTION", uid: "actions", align: "center" },
];

export default function ProductsPage() {
  // The category dropdown above the table; "" means all.
  const [category, setCategory] = useState("");
  const table = useServerTable<Product>("products/list", { category });

  // Which product the drawer / delete dialog is about, and in which mode.
  const [selected, setSelected] = useState<Product | null>(null);
  const [mode, setMode] = useState<FormMode>("Add");
  const drawer = useDisclosure();
  const confirmDelete = useDisclosure();
  const { remove, isLoading: isDeleting } = useCrud();

  const openAdd = () => {
    setSelected(null);
    setMode("Add");
    drawer.onOpen();
  };

  // A row's View / Edit / Delete button.
  const handleRowAction = useCallback(
    (product: Product, action: RowAction) => {
      setSelected(product);
      if (action === "Delete") {
        confirmDelete.onOpen();
      } else {
        setMode(action);
        drawer.onOpen();
      }
    },
    [confirmDelete, drawer]
  );

  const handleDelete = async () => {
    if (!selected) return;
    // `invalidate` refreshes the table, so the deleted row disappears.
    const result = await remove(`products/${selected.id}`, { invalidate: PRODUCT_QUERIES });
    if (result.ok) confirmDelete.onClose();
  };

  // What each cell shows. Columns without a case show the raw value.
  const renderCell = useCallback(
    (product: Product, columnKey: string) => {
      switch (columnKey) {
        case "code":
          return <span className="whitespace-nowrap">{product.code}</span>;
        case "name":
          return <span className="font-medium">{product.name}</span>;
        case "price":
          return formatMoney(product.price);
        case "stock":
          return <span className={product.stock === 0 ? "text-danger" : ""}>{product.stock}</span>;
        case "is_active":
          return (
            <StatusDot color={product.is_active ? "success" : "default"}>
              {product.is_active ? "Active" : "Inactive"}
            </StatusDot>
          );
        case "actions":
          return <RowActions onAction={(action) => handleRowAction(product, action)} />;
        default:
          return String(product[columnKey as keyof Product] ?? "--");
      }
    },
    [handleRowAction]
  );

  return (
    <div>
      <PageHeader
        title="Products"
        description="A sample CRUD module: list, search, sort, filter, add, view, edit and delete."
        actions={
          <Button color="primary" startContent={<Plus size={18} />} onPress={openAdd}>
            Add Product
          </Button>
        }
      />

      <DataTable
        columns={columns}
        table={table}
        renderCell={renderCell}
        emptyContent="No products yet. Press Add Product to create one."
        toolbar={
          <Select
            size="sm"
            aria-label="Category"
            placeholder="All categories"
            className="w-full sm:w-52"
            selectedKeys={category ? [category] : []}
            onSelectionChange={(keys) => {
              setCategory(String(Array.from(keys)[0] ?? ""));
              table.setPage(1);
            }}
          >
            {PRODUCT_CATEGORIES.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
        }
      />

      <ProductForm
        isOpen={drawer.isOpen}
        mode={mode}
        product={selected}
        onEdit={() => setMode("Edit")}
        onClose={drawer.onClose}
      />

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onOpenChange={confirmDelete.onOpenChange}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        isDestructive
        title="Delete this product?"
        message={selected ? `${selected.code} · ${selected.name} will be deleted. This can't be undone.` : ""}
      />
    </div>
  );
}
