'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

const navigation = [
  { name: 'Work', href: '/' },
  { name: 'About', href: '/about' },
];

export function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <header className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white border border-gray-200 rounded-[24px] shadow-lg px-3 py-2">
        <nav className="flex space-x-2">
          {navigation.map((item) => (
            <Button
              key={item.name}
              variant={mounted && pathname === item.href ? 'primary' : 'ghost'}
              size="sm"
              asChild
            >
              <Link href={item.href}>
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
