import * as React from "react";

export function PageHeader({ title, description, actions, eyebrow }: { title: string; description?: React.ReactNode; actions?: React.ReactNode; eyebrow?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        {eyebrow && <div className="text-sm text-ink-500">{eyebrow}</div>}
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">{title}</h1>
        {description && <div className="max-w-3xl text-sm text-ink-500">{description}</div>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({ title, children, action }: { title: string; children?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-ink-200 bg-white p-10 text-center">
      <p className="font-medium text-ink-800">{title}</p>
      {children && <div className="max-w-md text-sm text-ink-500">{children}</div>}
      {action}
    </div>
  );
}
