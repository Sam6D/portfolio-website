import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'none';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Section({ 
  children, 
  className = '', 
  background = 'none',
  padding = 'lg'
}: SectionProps) {
  const backgroundStyles = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    none: ''
  };
  
  const paddingStyles = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24'
  };
  
  return (
    <section className={`${backgroundStyles[background]} ${paddingStyles[padding]} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
