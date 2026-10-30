import { Select, SelectItem, type SelectProps } from "@heroui/react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

export type SelectOption = { label: string; value: string };

type FormSelectProps<T extends FieldValues> = Omit<SelectProps, "name" | "children" | "selectedKeys" | "onSelectionChange"> & {
  control: Control<T>;
  name: FieldPath<T>;
  options: SelectOption[];
};

/**
 * A dropdown tied to a react-hook-form field. The field holds the chosen option's `value`.
 *
 *   <FormSelect control={control} name="category" label="Category" options={PRODUCT_CATEGORIES} />
 */
export default function FormSelect<T extends FieldValues>({ control, name, options, ...props }: FormSelectProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Select
          size="sm"
          {...props}
          ref={field.ref}
          name={field.name}
          // HeroUI's Select works with a set of keys; ours is a single value.
          selectedKeys={field.value ? [field.value] : []}
          onSelectionChange={(keys) => field.onChange(Array.from(keys)[0] ?? "")}
          onClose={field.onBlur}
          isInvalid={!!fieldState.error}
          errorMessage={fieldState.error?.message}
        >
          {options.map((option) => (
            <SelectItem key={option.value}>{option.label}</SelectItem>
          ))}
        </Select>
      )}
    />
  );
}
