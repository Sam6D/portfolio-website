import { ButtonHTMLAttributes, ReactNode, cloneElement, isValidElement } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  asChild?: boolean;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  asChild = false,
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-[#FF4500] text-white hover:bg-[#ea580c] focus-visible:ring-[#FF4500]',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
    outline: 'border border-[#FF4500] text-[#FF4500] hover:bg-[#fff7ed] focus-visible:ring-[#FF4500]',
    ghost: 'text-[#FF4500] hover:bg-[#fff7ed] focus-visible:ring-[#FF4500]'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-[16px]',
    md: 'px-4 py-2 text-sm rounded-[16px]',
    lg: 'px-6 py-3 text-base rounded-[20px]'
  };
  
  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
  
  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      className: combinedClassName,
      ...props
    } as React.HTMLAttributes<HTMLElement>);
  }
  
  return (
    <button
      className={combinedClassName}
      {...props}
    >
      {children}
    </button>
  );
}
