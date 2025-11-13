import Image from 'next/image';
import { NavLink } from '../ui/NavLink';

export function Footer() {
  return (
    <footer className="bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
        <div className="flex flex-wrap gap-[160px] items-center justify-between">
          {/* Left side - Profile and info */}
          <div className="flex gap-6 items-center min-w-[240px]">
            {/* Profile Image - 100px circular */}
            <div className=" overflow-hidden relative rounded-[1804px] shrink-0" style={{ width: '100px', height: '100px' }}>
              <Image
                src="/images/about-character.png"
                alt="Sami Désir - Profile"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Name and Copyright */}
            <div className="flex flex-col gap-[9px] items-start">
              <h3 className="text-primary text-label-medium font-semibold leading-[1.4]">
                Sami Désir
              </h3>
              <p className="text-foreground text-[16px] font-normal leading-[1.4]">
                © 2025
              </p>
            </div>
          </div>
          
                 {/* Right side - Links */}
                 <div className="flex flex-col gap-2 items-start">
                   <NavLink 
                     href="https://www.linkedin.com/in/sami-desir/" 
                     external
                     className="text-[16px] font-normal leading-[1.4]"
                   >
                     Linkedin
                   </NavLink>
                   <NavLink 
                     href="mailto:sami.desir@gmail.com"
                     external
                     className="text-[16px] font-normal leading-[1.4]"
                   >
                     sami.desir@gmail.com
                   </NavLink>
                   <NavLink 
                     href="/cv/sami-desir-cv.pdf" 
                     external
                     className="text-[16px] font-normal leading-[1.4]"
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
