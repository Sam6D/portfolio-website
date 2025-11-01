import Link from 'next/link';
import { ReactNode } from 'react';

interface NavLinkProps {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
  target?: string;
  rel?: string;
}

export function NavLink({ 
  href, 
  children, 
  external = false, 
  className = '', 
  target,
  rel 
}: NavLinkProps) {
  // Default classes for navigation links (footer style) - matches original footer styling with arrow
  const baseClasses = "inline-flex items-center gap-1 font-normal transition-colors duration-200 group";
  const colorClasses = "text-[#1e1e1e] hover:text-primary";
  const combinedClasses = `${baseClasses} ${colorClasses} ${className}`.trim();

  // Arrow component that changes color on hover
  const ArrowIcon = () => (
    <span className="text-xs transition-colors duration-200 group-hover:text-primary">↗</span>
  );

  // If it's an external link, use regular <a> tag
  if (external || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('/') && href.includes('.')) {
    return (
      <a 
        href={href} 
        target={target || (external ? '_blank' : undefined)}
        rel={rel || (external ? 'noopener noreferrer' : undefined)}
        className={combinedClasses}
      >
        {children}
        <ArrowIcon />
      </a>
    );
  }

  // For internal links, use Next.js Link
  return (
    <Link href={href} className={combinedClasses}>
      {children}
      <ArrowIcon />
    </Link>
  );
}
