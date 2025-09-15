import { Section } from '@/components/ui/Section';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { featuredProjects } from '@/data/projects';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Section className="pt-48 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-5 md:gap-10 items-start">
            {/* Image column - shown first on mobile, right on desktop */}
            <div className="md:w-1/4 order-1 md:order-2 p-6">
              {/* Image placeholder */}
              <div className="mb-0 md:mb-8 flex justify-center md:justify-end">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Image</span>
                </div>
              </div>
            </div>
            
            {/* Content column - shown second on mobile, left on desktop */}
            <div className="md:w-3/4 px-6 order-2 md:order-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-left">
                Hi, I&apos;m <span className="text-[#017a76]">Sami Désir</span>
              </h1>
              <p className="text-xl text-gray-600 text-left">
              Senior Product Designer with 6+ years of experience in consumer and B2B products across AI, mobile, marketplaces, and SaaS.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Featured Projects */}
      <Section className="pt-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-start mb-4">
            {/* Left column - matching project card image width */}
            <div className="md:w-[400px] shrink-0 px-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-left">See some of my work</h2>
            </div>
            
            {/* Right column - empty for alignment */}
            <div className="flex-1"></div>
          </div>
          
          <div className="space-y-2">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </Section>

    </>
  );
}
