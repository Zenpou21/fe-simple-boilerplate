import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  /** Buttons on the right, e.g. "Add Product". */
  actions?: ReactNode;
};

/** The title row at the top of a page. */
export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {description && <p className="text-sm text-default-500">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
