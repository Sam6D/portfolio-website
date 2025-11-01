import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types';
import { Card } from './Card';

// Define the variant types for the ProjectCard
type ProjectCardVariant = 'image-left' | 'image-right';

interface ProjectCardProps {
  project: Project;
  variant?: ProjectCardVariant; // Optional prop with default value
}

// ImageColumn component - handles the image display
interface ImageColumnProps {
  project: Project;
}

function ImageColumn({ project }: ImageColumnProps) {
  return (
    <div className="w-full md:w-[492px] h-[350px] relative shrink-0">
      <Image
        src={project.image}
        alt={project.title}
        fill
        className={project.slug === 'studocu' ? 'object-contain' : 'object-cover'}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
      />
    </div>
  );
}

// Mobile Image Component - always shown first on mobile
function MobileImageColumn({ project }: ImageColumnProps) {
  return (
    <div className="w-full h-[350px] relative shrink-0 bg-transparent">
      <Image
        src={project.image}
        alt={project.title}
        fill
        className={project.slug === 'studocu' ? 'object-contain' : 'object-cover'}
        sizes="100vw"
        priority={false}
        style={{ objectFit: project.slug === 'studocu' ? 'contain' : 'cover' }}
      />
    </div>
  );
}

// TextColumn component - handles all the text content
interface TextColumnProps {
  project: Project;
  variant: ProjectCardVariant;
}

function TextColumn({ project, variant }: TextColumnProps) {
  return (
    <div className={`flex flex-col items-start md:justify-between py-[30px] md:h-full md:min-h-[350px] gap-4 md:gap-0 px-[20px] md:px-0 ${
      variant === 'image-left' ? 'md:pl-0 md:pr-[20px]' : 'md:pl-[20px] md:pr-0'
    }`}>
      {/* Top Section: Year/Coming Soon and Title Group - 4px gap between them */}
      <div className="flex flex-col gap-[4px] items-start w-full">
        <p className="text-[#767676] text-[14px] font-medium">
          {project.year}
        </p>
        <h3 className="text-[#101828] text-title-large font-semibold whitespace-pre-line">
          {project.title}
        </h3>
      </div>
      
      {/* Bottom Section: Description and Tags - 12px gap */}
      <div className="flex flex-col gap-[12px] items-start w-full">
        {/* Description */}
        <p className="text-[#4a5565] text-[16px] font-normal w-full">
          {project.description}
        </p>
        
        {/* Tags */}
        <p className="text-primary text-label-small w-full">
          {project.tags.slice(0, 4).join(' · ')}
        </p>
      </div>
    </div>
  );
}

export function ProjectCard({ project, variant = 'image-left' }: ProjectCardProps) {
  return (
    <Link href={`/case-studies/${project.slug}`} className="block">
      <div className="bg-[#F8F8F8] hover:bg-[#FFF8F5] flex flex-col md:flex-row items-center transition-all duration-300 rounded-[28px] overflow-hidden">
        {/* Mobile: Image always on top */}
        <div className="w-full md:hidden overflow-hidden rounded-t-[28px]">
          <MobileImageColumn project={project} />
        </div>
        
        {/* Desktop: Conditional rendering based on variant */}
        {variant === 'image-left' ? (
          <>
            {/* Image on the left - desktop only */}
            <div className="hidden md:block overflow-hidden rounded-l-[28px]">
              <ImageColumn project={project} />
            </div>
            {/* Text on the right - no padding, handled by TextColumn */}
            <div className="flex-1">
              <TextColumn project={project} variant={variant} />
            </div>
          </>
        ) : (
          <>
            {/* Text on the left - no padding, handled by TextColumn */}
            <div className="flex-1">
              <TextColumn project={project} variant={variant} />
            </div>
            {/* Image on the right - desktop only */}
            <div className="hidden md:block overflow-hidden rounded-r-[28px]">
              <ImageColumn project={project} />
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
