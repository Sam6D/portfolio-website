'use client';

import { ComponentProps } from 'react';

interface DownloadCVButtonProps extends ComponentProps<'button'> {
  pdfPath: string;
  children: React.ReactNode;
}

export function DownloadCVButton({ pdfPath, children, ...props }: DownloadCVButtonProps) {
  const handleClick = () => {
    // Simply open in new tab - let the browser handle it
    window.open(pdfPath, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
