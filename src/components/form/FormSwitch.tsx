import type { ReactNode } from "react";
import { Switch, type SwitchProps } from "@heroui/react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

type FormSwitchProps<T extends FieldValues> = Omit<SwitchProps, "name" | "isSelected" | "onValueChange"> & {
  control: Control<T>;
  name: FieldPath<T>;
  children: ReactNode;
};

/**
 * An on/off switch tied to a true/false form field.
 *
 *   <FormSwitch control={control} name="is_active">Active</FormSwitch>
 */
export default function FormSwitch<T extends FieldValues>({ control, name, children, ...props }: FormSwitchProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Switch size="sm" {...props} name={field.name} isSelected={!!field.value} onValueChange={field.onChange}>
          <span className="text-sm">{children}</span>
        </Switch>
      )}
    />
  );
}
