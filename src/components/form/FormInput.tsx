import { Input, type InputProps } from "@heroui/react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

type FormInputProps<T extends FieldValues> = Omit<InputProps, "name" | "value" | "onValueChange"> & {
  /** From useForm(): `const { control } = useForm(...)`. */
  control: Control<T>;
  /** The field's key in the form values, e.g. "name". */
  name: FieldPath<T>;
};

/**
 * A text box tied to a react-hook-form field. It shows the field's error by itself.
 *
 *   <FormInput control={control} name="name" label="Name" isRequired />
 *
 * Any HeroUI Input prop works too (type, placeholder, isReadOnly, description, ...).
 */
export default function FormInput<T extends FieldValues>({ control, name, ...props }: FormInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Input
          size="sm"
          {...props}
          ref={field.ref}
          name={field.name}
          value={field.value ?? ""}
          onValueChange={field.onChange}
          onBlur={field.onBlur}
          isInvalid={!!fieldState.error}
          errorMessage={fieldState.error?.message}
        />
      )}
    />
  );
}
