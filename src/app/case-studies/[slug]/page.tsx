import { Section } from '@/components/ui/Section';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { caseStudies } from '@/data/projects';
import type { Metadata } from 'next';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const project = caseStudies.find(p => p.slug === resolvedParams.slug);
  
  if (!project) {
    return {
      title: "Case Study - Sami Désir",
    };
  }
  
  // Remove company name from title (everything before the comma)
  // Example: "Studocu, Ask AI Camera" -> "Ask AI Camera"
  const titleWithoutCompany = project.title.includes(',')
    ? project.title.split(',').slice(1).join(',').trim()
    : project.title;
  
  return {
    title: `${titleWithoutCompany} - Sami Désir`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  // Find the project by slug
  const resolvedParams = await params;
  const project = caseStudies.find(p => p.slug === resolvedParams.slug);
  
  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <>
      {/* Floating Back Button */}
      <BackButton />

      {/* Project Content */}
      <Section className="pt-48 pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4">
            <span className="text-primary text-label-small">
              {project.year} · {project.tags.join(' · ')}
            </span>
          </div>
          <h1 className="text-title-xl md:text-5xl font-bold text-gray-900 mb-6">
            {project.title}
          </h1>
          {project.content && project.content.markdown && (
            <MarkdownRenderer 
              content={project.content.markdown}
              className="space-y-8"
            />
          )}
        </div>
      </Section>
    </>
  );
}
