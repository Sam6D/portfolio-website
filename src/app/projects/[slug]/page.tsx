import { Section } from '@/components/ui/Section';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { projects } from '@/data/projects';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  // Find the project by slug
  const project = projects.find(p => p.slug === params.slug);
  
  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <>
      {/* Floating Back Button */}
      <div className="fixed top-5 z-50" style={{ left: 'calc(50% - 200px)' }}>
        <div className="bg-white border border-gray-200 rounded-[24px] shadow-lg px-3 py-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <Link href="/">
              ← Back
            </Link>
          </Button>
        </div>
      </div>

      {/* Project Hero Section */}
      <Section className="pt-48 pb-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-4">
            <span className="text-[#017a76] text-sm font-medium uppercase">
              {project.year} • {project.tags.join(' • ').toUpperCase()}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {project.title}
          </h1>
          <p className="text-lg text-gray-600">
            {project.longDescription}
          </p>
        </div>
      </Section>

      {/* Project Content */}
      {project.content && (
        <Section className="pt-6">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {project.content.sections.map((section, index) => (
                <div key={index}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                  <div className="text-base text-gray-600 mb-4 whitespace-pre-line">
                    {section.description}
                  </div>
                  
                  {section.image && (
                    <div>
                      <div className={`relative rounded-lg overflow-hidden mb-4 ${
                        section.imageSize === 'small' 
                          ? 'w-[140px] h-[140px] mx-auto' 
                          : 'w-full'
                      }`}>
                        <Image
                          src={section.image}
                          alt={section.imageAlt || section.title}
                          width={800}
                          height={600}
                          className={`object-cover ${
                            section.imageSize === 'small' 
                              ? 'w-full h-full' 
                              : 'w-full h-auto'
                          }`}
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                      {section.imageAlt && (
                        <p className="text-sm text-gray-500 text-center">
                          {section.imageAlt}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
