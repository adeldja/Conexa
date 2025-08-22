import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderBreadcrumbProps {
  breadcrumb: BreadcrumbItem[];
}

export default function HeaderBreadcrumb({ breadcrumb }: HeaderBreadcrumbProps) {
  if (breadcrumb.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm">
      <span className="text-slate-400">|</span>
      {breadcrumb.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <span className="text-slate-400 mx-2">/</span>}
          {item.href ? (
            <Link href={item.href} className="text-blue-600 hover:text-blue-800 font-medium">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
