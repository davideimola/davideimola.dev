interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  command?: string;
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ command = "cat", items, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`font-mono text-[13px] text-text-3 ${className}`}>
      <span className="text-accent mr-2">❯</span>
      <span>{command} ~/</span>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.label}>
            {item.href ? (
              <a href={item.href} className="hover:text-text-2 transition-colors duration-150">
                {item.label}
              </a>
            ) : (
              <span className="text-text-2">{item.label}</span>
            )}
            {!isLast && <span>/</span>}
          </span>
        );
      })}
    </nav>
  );
}
