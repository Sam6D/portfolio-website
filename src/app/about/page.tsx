import { Section } from '@/components/ui/Section';
import Image from 'next/image';
import { CustomLink } from '@/components/ui/Link';
import { DownloadCVButton } from '@/components/ui/DownloadCVButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About - Sami Désir",
  description: "About Sami Désir, a Senior Product Designer with 6+ years of experience designing AI and mobile products.",
};

export default function About() {
  return (
    <>
      {/* Hero Section - Redesigned to match Figma */}
      <Section className="pt-44 pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col gap-[16px] items-start">
            {/* Profile Image - 62x62 circular */}
            {/* <div className="bg-[#e9e9e9] overflow-hidden relative rounded-[1804px] shrink-0" style={{ width: '62px', height: '62px' }}>
              <Image
                src="/images/about-character.png"
                alt="Sami Désir - About Page Character Portrait"
                fill
                className="object-cover"
                priority
              />
            </div> */}
            {/* Text Content */}
            <div className="flex-1 space-y-2">
              <h2 className="text-foreground text-title-small">
                A bit about myself
              </h2>
              <div className="space-y-5">
                <p className="text-foreground-muted text-body-medium">
                  I&apos;m Sami, a Senior Product Designer with 6+ years of experience designing consumer and B2B products. Recently, a lot of my work has centred around developing AI tools tailored to the needs of specific groups.
                </p>
                <p className="text-foreground-muted text-body-medium">
                  Currently, I&apos;m designing an AI agent platform for recruiters at <CustomLink href="https://carv.com" external>Carv</CustomLink>. Before that I was at <CustomLink href="https://apps.apple.com/us/app/studocu-ai-notes-summaries/id1460235511" external>Studocu</CustomLink>, <CustomLink href="https://www.ticketswap.com/" external>TicketSwap</CustomLink>, <CustomLink href="https://argodesign.com/" external>argodesign</CustomLink>.
                </p>
                <p className="text-foreground-muted text-body-medium">
                  I was born in Paris and live in Amsterdam. Before that I was in Copenhagen, where I studied at <CustomLink href="https://ciid.dk" external>Copenhagen Institute of Interaction Design</CustomLink>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Experience Section - Redesigned to match Figma */}
      <Section className="pt-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col gap-[24px] items-start">
            <h2 className="text-foreground text-title-small">Experience</h2>
            
            <div className="flex flex-col gap-[48px] items-start w-full">
              {/* Carv */}
              <div className="flex gap-[24px] items-start w-full">
                <div className="bg-surface rounded-[8px] shrink-0 p-[6px] overflow-hidden flex items-center justify-center" style={{ width: '62px', height: '62px' }}>
                  <div className="relative overflow-hidden" style={{ width: '50px', height: '50px' }}>
                    <Image 
                      src="/images/companies/carv-logo.png" 
                      alt="Carv logo" 
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[2px] items-start flex-1">
                  <h3 className="text-foreground text-label-large">
                    Senior Product Designer <span className="text-foreground-subtle">Carv</span>
                  </h3>
                  <span className="text-foreground-subtle text-body-medium">2025 - Now</span>
                  <p className="text-foreground-muted text-body-medium">
                  I work at Carv, where I&apos;m redesigning the product from an AI note-taker to a system from which recruiters can manage AI agents for a wide range of tasks.</p>
                </div>
              </div>

              {/* Studocu */}
              <div className="flex gap-[24px] items-start w-full">
                <div className="bg-surface rounded-[8px] shrink-0 p-[6px] overflow-hidden flex items-center justify-center" style={{ width: '62px', height: '62px' }}>
                  <div className="relative overflow-hidden" style={{ width: '50px', height: '50px' }}>
                    <Image 
                      src="/images/companies/studocu-logo.png" 
                      alt="Studocu logo" 
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[2px] items-start flex-1">
                  <h3 className="text-foreground text-label-large">
                    Senior Product Designer <span className="text-foreground-subtle">Studocu</span>
                  </h3>
                  <span className="text-foreground-subtle text-body-medium">2024 - 2025</span>
                  <p className="text-foreground-muted text-body-medium">
                  At Studocu, I led design for the mobile app   launching AI features and giving the app the structure it needed to grow from a side product into a core part of the business. I also introduced  a unified AI design strategy across teams and shaped the design system into an asset that actively reduced inconsistency and helped increase the quality of the product instead of just documenting it.
                  </p>
                </div>
              </div>

              {/* TicketSwap */}
              <div className="flex gap-[24px] items-start w-full">
                <div className="bg-surface rounded-[8px] shrink-0 overflow-hidden flex items-center justify-center" style={{ width: '62px', height: '62px' }}>
                  <div className="relative overflow-hidden" style={{ width: '54px', height: '54px' }}>
                    <Image 
                      src="/images/companies/ticketswap-logo.png" 
                      alt="TicketSwap logo" 
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[2px] items-start flex-1">
                  <h3 className="text-foreground text-label-large">
                    Product Designer <span className="text-foreground-subtle">TicketSwap</span>
                  </h3>
                  <span className="text-foreground-subtle text-body-medium">2022 - 2023</span>
                  <p className="text-foreground-muted text-body-medium">
                  At TicketSwap, I redesigned the checkout flow to make it modern and easy to use while making it capable of handling additional products like ticket insurance. I also led a visual refresh of the app to make it feel modern, reliable and exciting to use.</p>
                </div>
              </div>

              {/* argodesign */}
              <div className="flex gap-[24px] items-start w-full">
                <div className="bg-surface rounded-[8px] shrink-0 p-[6px] overflow-hidden" style={{ width: '62px', height: '62px' }}>
                  <div className="relative w-full h-full overflow-hidden">
                    <Image 
                      src="/images/companies/argodesign-logo.png" 
                      alt="ArgoDesign logo" 
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[2px] items-start flex-1">
                  <h3 className="text-foreground text-label-large">
                    Interaction Designer at <span className="text-foreground-subtle">argodesign</span>
                  </h3>
                  <span className="text-foreground-subtle text-body-medium">2019 - 2022</span>
                  <p className="text-foreground-muted text-body-medium">
                  In my agency days, I worked with Facebook, NS, IBM, Builder.ai and Elsevier to deliver design strategies, prototypes, vision work and user research, and sometimes just to help client teams reach their ambition to ship world class products.</p>
                </div>
              </div>
              
              {/* Download CV Button */}
              <div className="bg-[#f8f8f8] rounded-[100px] px-4 py-[10px]">
                <DownloadCVButton
                  pdfPath="/cv/sami-desir-cv.pdf"
                  className="text-foreground text-button-label"
                >
                  Download my CV
                </DownloadCVButton>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
