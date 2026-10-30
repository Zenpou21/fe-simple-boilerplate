import { useEffect } from "react";
import { Button, useDisclosure } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormDrawer from "../../components/common/FormDrawer";
import ConfirmModal from "../../components/common/ConfirmModal";
import { FormInput, FormNumberInput, FormSelect, FormSwitch, FormTextarea } from "../../components/form";
import useCrud from "../../hooks/useCrud";
import { PRODUCT_CATEGORIES, PRODUCT_QUERIES } from "../../constants/product";
import { productSchema, type ProductFormValues } from "../../schemas/product.schema";
import type { Product } from "../../types/product";
import { formatDateTime } from "../../utils/format";

export type FormMode = "Add" | "View" | "Edit";

type ProductFormProps = {
  isOpen: boolean;
  mode: FormMode;
  /** The product to view or edit; null when adding. */
  product: Product | null;
  /** View mode's Edit button. */
  onEdit: () => void;
  onClose: () => void;
};

/** A product -> the form's values (or empty values for a new product). */
const toFormValues = (product: Product | null): Partial<ProductFormValues> => ({
  code: product?.code ?? "",
  name: product?.name ?? "",
  category: product?.category ?? "",
  price: product?.price,
  stock: product?.stock ?? 0,
  description: product?.description ?? "",
  is_active: product?.is_active ?? true,
});

/**
 * One drawer for Add, View and Edit.
 *
 * Flow: the user fills in the form -> Save -> zod checks the fields -> "Are you sure?" ->
 * POST (add) or PUT (edit) to the API -> the table refreshes (invalidate) -> the drawer closes.
 * If the API rejects it (e.g. the code is taken), its message shows as a toast and the drawer stays open.
 */
export default function ProductForm({ isOpen, mode, product, onEdit, onClose }: ProductFormProps) {
  const { post, put, isLoading: isSaving } = useCrud();
  const confirm = useDisclosure();
  const isView = mode === "View";

  const { control, handleSubmit, reset } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    mode: "onTouched", // show a field's error once the user leaves it
  });

  // Each time the drawer opens, fill it with the chosen product (or blank for Add).
  useEffect(() => {
    if (isOpen) reset(toFormValues(mode === "Add" ? null : product));
  }, [isOpen, mode, product, reset]);

  const save = async (values: ProductFormValues) => {
    const body = { ...values, description: values.description || null };
    const result =
      mode === "Edit" && product
        ? await put(`products/${product.id}`, body, { invalidate: PRODUCT_QUERIES })
        : await post("products", body, { invalidate: PRODUCT_QUERIES });

    confirm.onClose();
    if (result.ok) onClose();
  };

  const footer = (
    <>
      <Button variant="flat" onPress={onClose}>
        Close
      </Button>
      {isView ? (
        <Button key="edit" color="primary" variant="flat" onPress={onEdit}>
          Edit
        </Button>
      ) : (
        // handleSubmit runs zod first; the confirm dialog only opens when every field is valid.
        <Button key="save" color="primary" onPress={() => handleSubmit(confirm.onOpen)()}>
          {mode === "Add" ? "Add Product" : "Save"}
        </Button>
      )}
    </>
  );

  return (
    <>
      <FormDrawer title={`${mode} Product`} isOpen={isOpen} onClose={onClose} footer={footer}>
        <form noValidate className="flex flex-col gap-3" onSubmit={(event) => event.preventDefault()}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormInput control={control} name="code" label="Code" isRequired={!isView} isReadOnly={isView} description={isView ? undefined : "e.g. PRD-0001"} />
            <FormSelect control={control} name="category" label="Category" options={PRODUCT_CATEGORIES} isRequired={!isView} isDisabled={isView} />
          </div>
          <FormInput control={control} name="name" label="Name" isRequired={!isView} isReadOnly={isView} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormNumberInput control={control} name="price" label="Price" minValue={0} isRequired={!isView} isReadOnly={isView} startContent={<span className="text-sm text-default-400">₱</span>} />
            <FormNumberInput control={control} name="stock" label="Stock" minValue={0} isRequired={!isView} isReadOnly={isView} />
          </div>
          <FormTextarea control={control} name="description" label="Description" isReadOnly={isView} />
          <FormSwitch control={control} name="is_active" isDisabled={isView}>
            Active
          </FormSwitch>

          {/* Extra details that only exist once the product is saved. */}
          {isView && product && (
            <p className="text-xs text-default-400">
              Created {formatDateTime(product.created_at)} · Updated {formatDateTime(product.updated_at)}
            </p>
          )}
        </form>
      </FormDrawer>

      <ConfirmModal
        isOpen={confirm.isOpen}
        onOpenChange={confirm.onOpenChange}
        onConfirm={handleSubmit(save)}
        isLoading={isSaving}
        title={mode === "Add" ? "Add this product?" : "Save the changes?"}
      />
    </>
  );
}
