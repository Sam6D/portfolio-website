import Image from 'next/image';
import Link from 'next/link';
import { NavLink } from '../ui/NavLink';
import { RecentlyListened } from '../ui/RecentlyListened';

export function Footer() {
  return (
    <footer className="bg-[#fcfcfc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-[672px] mx-auto flex flex-col gap-[41px] pt-[32px] pb-[16px]">
          {/* Top Section - Recently Listened (Left aligned) */}
          <div className="w-full">
            <RecentlyListened />
          </div>
          
          {/* Bottom Section - Profile and Links */}
          <div className="flex items-center w-full">
            {/* All links grouped together - Profile Image, Name, and Links - fills full width */}
            <div className="flex items-center justify-between w-full">
              {/* Profile Image and Name */}
              <div className="flex items-center gap-[8px]">
                {/* Profile Image - 40px circular (using hero image) */}
                <div className="overflow-hidden relative rounded-full shrink-0 bg-[#e9e9e9]" style={{ width: '40px', height: '40px' }}>
                  <Image
                    src="/images/hero-character.png"
                    alt="Sami Désir - Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Name - Link to homepage */}
                <div className="flex flex-col gap-[12px]">
                  <Link href="/" className="text-foreground text-title-small leading-[1.4] hover:!text-primary transition-colors duration-200">
                    Sami Désir
                  </Link>
                </div>
              </div>
              
              {/* Links - Horizontal layout (NavLink automatically adds arrow icon) */}
              <NavLink 
                href="https://www.linkedin.com/in/sami-desir/" 
                external
                className="text-body-medium leading-[1.4] whitespace-nowrap"
              >
                Linkedin
              </NavLink>
              <NavLink 
                href="mailto:sami.desir@gmail.com"
                external
                className="text-body-medium leading-[1.4] whitespace-nowrap"
              >
                sami.desir@gmail.com
              </NavLink>
              <NavLink 
                href="/cv/sami-desir-cv.pdf" 
                external
                className="text-body-medium leading-[1.4] whitespace-nowrap"
              >
                CV
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
