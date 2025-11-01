import Link from 'next/link';
import { ReactNode } from 'react';

interface CustomLinkProps {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
  target?: string;
  rel?: string;
}

export function CustomLink({ 
  href, 
  children, 
  external = false, 
  className = '', 
  target,
  rel 
}: CustomLinkProps) {
  // Default classes for consistent link styling
  const baseClasses = "font-medium transition-all duration-200";
  const colorClasses = "text-primary hover:text-primary/80 hover:underline";
  const combinedClasses = `${baseClasses} ${colorClasses} ${className}`.trim();

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
      </a>
    );
  }

  // For internal links, use Next.js Link
  return (
    <Link href={href} className={combinedClasses}>
      {children}
    </Link>
  );
}
