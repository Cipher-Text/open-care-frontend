"use client";

interface AdminHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

/**
 * Page title row: the page's heading, a short description and its primary actions (children).
 * The sidebar toggle and account menu are in AdminTopbar (rendered once by the admin layout).
 */
export function AdminHeader({
  title,
  description,
  children,
}: AdminHeaderProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-4 py-3 md:px-8">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
