interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

// A quiet trail in mono: parents are links that turn red on hover, the current
// page is plain text.
export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`font-mono text-[13px] text-fg-subtle ${className}`}>
      <ol className="flex flex-wrap items-center gap-x-1.5 list-none m-0 p-0">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-x-1.5">
              {item.href ? (
                <a
                  href={item.href}
                  className="text-fg-muted no-underline hover:text-accent transition-colors duration-150"
                >
                  {item.label}
                </a>
              ) : (
                <span aria-current="page" className="text-fg-subtle">
                  {item.label}
                </span>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
