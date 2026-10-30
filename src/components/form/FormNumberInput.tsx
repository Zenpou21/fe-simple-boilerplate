import { NumberInput, type NumberInputProps } from "@heroui/react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

type FormNumberInputProps<T extends FieldValues> = Omit<NumberInputProps, "name" | "value" | "onValueChange"> & {
  control: Control<T>;
  name: FieldPath<T>;
};

/**
 * A number box tied to a react-hook-form field. The value is a real number (not text),
 * so the zod schema can use z.number().
 *
 *   <FormNumberInput control={control} name="price" label="Price" minValue={0} />
 */
export default function FormNumberInput<T extends FieldValues>({ control, name, ...props }: FormNumberInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <NumberInput
          size="sm"
          hideStepper
          {...props}
          ref={field.ref}
          name={field.name}
          value={field.value ?? undefined}
          // An emptied box gives NaN; store undefined so zod says "required" instead.
          onValueChange={(value) => field.onChange(Number.isNaN(value) ? undefined : value)}
          onBlur={field.onBlur}
          isInvalid={!!fieldState.error}
          errorMessage={fieldState.error?.message}
        />
      )}
    />
  );
}
