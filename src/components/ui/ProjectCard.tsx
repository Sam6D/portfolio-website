import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types';
import { Card } from './Card';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="flex flex-col md:flex-row gap-10 items-start transition-all duration-300 group-hover:bg-gray-50 rounded-4xl p-6">
        {/* Image Section */}
        <div className="w-full md:w-[400px] h-[300px] relative rounded-[20px] overflow-hidden shrink-0">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 32vw"
          />
        </div>
        
        {/* Content Section */}
        <div className="flex flex-col gap-2 items-start justify-start flex-1">
          {/* Meta info - Tags and Year (Overline) */}
          <div className="flex gap-2.5 items-center">
            <span className="text-[#017a76] text-xs font-medium uppercase">
              {project.year} • {project.tags.slice(0, 3).join(' • ').toUpperCase()}
            </span>
          </div>
          
          {/* Title */}
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl md:text-2xl font-bold text-gray-900">
              {project.title}
            </h3>
            <p className="text-base text-gray-400 -mt-1">
              {project.year} - {project.client || 'Freelance'}
            </p>
          </div>
          
          {/* Description (Medium Body) */}
          <div className="flex flex-col gap-1">
            <p className="text-base text-gray-600">
              {project.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
