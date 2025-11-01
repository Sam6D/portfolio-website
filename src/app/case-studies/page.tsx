import { Section } from '@/components/ui/Section';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { featuredCaseStudies } from '@/data/projects';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Case Studies - Sami Désir",
  description: "Case studies showcasing product design work by Sami Désir, a Product Designer specializing in AI and mobile design.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <main>
        {/* Hero Section */}
        <Section className="pt-44 pb-12">
          <div className="max-w-2xl mx-auto text-left space-y-2">
            <h2 className="text-foreground text-title-small">
            Want a deeper look into my process?
                </h2>
              <p className="text-body-medium text-foreground-muted">
                Here are a few case studies on some of the larger projects I've worked on.
              </p>
          </div>
        </Section>
        {/* Featured Projects */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-[152px]">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {featuredCaseStudies.map((caseStudy, index) => {
                // Alternate between right and left variants
                // Index 0 (Studocu) = right, Index 1 (TicketSwap) = left, etc.
                const variant = index % 2 === 0 ? 'image-right' : 'image-left';
                
                return (
                  <ProjectCard 
                    key={caseStudy.id} 
                    project={caseStudy} 
                    variant={variant}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}