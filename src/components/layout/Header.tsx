'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

const navigation = [
  { name: 'Work', href: '/', image: { src: '/images/navigation/nav-work.png', width: 40, height: 40, smallWidth: 32, smallHeight: 32 } },
  { name: 'About', href: '/about', image: { src: '/images/navigation/nav-about.png', width: 60, height: 40, smallWidth: 48, smallHeight: 32 } },
  { name: 'Case studies', href: '/case-studies', image: { src: '/images/navigation/nav-case-studies.png', width: 40, height: 40, smallWidth: 32, smallHeight: 32 } },
];

export function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && navRef.current) {
      // Only show indicator on main pages (not project pages)
      const isMainPage = pathname === '/' || pathname === '/about' || pathname === '/case-studies';
      
      if (isMainPage) {
        const currentIndex = navigation.findIndex(item => item.href === pathname);
        
        if (currentIndex !== -1) {
          // Clear all hover backgrounds when switching pages
          const navItems = navRef.current.querySelectorAll('a');
          navItems.forEach(item => {
            (item as HTMLElement).style.backgroundColor = 'transparent';
          });
          
          // Get the active item and calculate position immediately
          const activeItem = navItems[currentIndex];
          
          if (activeItem && navRef.current) {
            const navRect = navRef.current.getBoundingClientRect();
            const itemRect = activeItem.getBoundingClientRect();
            
            // Set the indicator position immediately for smooth transition
            setIndicatorStyle({
              left: `${itemRect.left - navRect.left}px`,
              width: `${itemRect.width}px`,
              height: `${itemRect.height}px`,
              opacity: 1,
            });
          }
        }
      } else {
        // Hide indicator on project pages
        setIndicatorStyle({ opacity: 0 });
      }
    }
  }, [pathname, mounted]);
  
  // Hide header on smallest breakpoint for case study pages
  const isCaseStudyPage = pathname.startsWith('/case-studies/') && pathname !== '/case-studies';
  
  return (
      <header className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 ${isCaseStudyPage ? 'hidden sm:block' : ''}`}>
      {/* Navigation Pills */}
      <div 
        ref={navRef}
        className="bg-white border border-outline rounded-[999px] shadow-main p-[6px] flex gap-[8px] relative"
      >
        {/* Animated Background Indicator */}
        <div 
          className="absolute bg-primary rounded-[100px] transition-all duration-300 ease-in-out pointer-events-none"
          style={{
            ...indicatorStyle,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        
        {navigation.map((item, index) => {
          const isActive = mounted && pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative z-10 px-3 py-[6px] rounded-[100px] text-button-label transition-colors duration-300 ${
                isActive
                  ? 'text-on-primary'
                  : 'text-foreground-subtle hover:bg-surface-hover'
              }`}
              style={{
                backgroundColor: isActive ? 'transparent' : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className={`shrink-0 ${
                    item.name === 'Work' ? 'w-8 h-8' :
                    item.name === 'About' ? 'w-12 h-8' :
                    'w-8 h-8'
                  }`}
                >
                  <Image
                    key={`${item.name}-${item.image.width}-${item.image.height}`}
                    src={item.image.src}
                    alt={item.name}
                    width={item.image.width}
                    height={item.image.height}
                    className="w-full h-full object-contain"
                    unoptimized
                    style={{
                      imageRendering: 'crisp-edges',
                    }}
                  />
                </div>
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
