import { Textarea, type TextAreaProps } from "@heroui/react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

type FormTextareaProps<T extends FieldValues> = Omit<TextAreaProps, "name" | "value" | "onValueChange"> & {
  control: Control<T>;
  name: FieldPath<T>;
};

/**
 * A multi-line text box tied to a react-hook-form field.
 *
 *   <FormTextarea control={control} name="description" label="Description" />
 */
export default function FormTextarea<T extends FieldValues>({ control, name, ...props }: FormTextareaProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Textarea
          size="sm"
          minRows={3}
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
