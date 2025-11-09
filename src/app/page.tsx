import { Section } from '@/components/ui/Section';
import { FeedEntry } from '@/components/ui/FeedEntry';
import { CustomLink } from '@/components/ui/Link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      {/* Hero Section - Custom styled to match Figma */}
      <Section className="pt-44 pb-2">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-[20px] items-start">
            {/* Text Content - 8px gap between lines */}
            <div className="flex flex-col gap-[8px] items-start flex-1">
              <h1 className="text-foreground text-[36px] font-bold">
                Hey! I'm <span className="text-primary">Sami</span>
              </h1>
              <p className="text-foreground-muted text-body-medium">
                I'm a Senior Product Designer living in Amsterdam. Currently designing an AI agent platform for recruiters at <CustomLink href="https://carv.com" external>Carv</CustomLink>.
              </p>
            </div>
            
            {/* Profile Image - Exactly 100x100px circular */}
            <div className="bg-[#e1e1e2] overflow-hidden relative rounded-[180px] shrink-0" style={{ width: '100px', height: '100px' }}>
              <Image
                src="/images/hero-character.png"
                alt="Sami Désir - 3D Character Portrait"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Work Feed */}
      <Section className="pb-44">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-24">
            <FeedEntry
              year="2025"
              title="Carv AI for Recruiters"
              contentBlocks={[
                {
                  type: 'text',
                  content: "I’m currently at Carv, where I’m redesigning our product into an AI‑agent platform for recruiters. What I find interesting here is the balance we need to strike between a fully open-ended and a guided approach. The best example of this is our prompt bar that combines ChatGPT’s freeform nature with a CMD+K type of input where recruiters can use natural language to ask anything and call tools to perform tasks around candidates, jobs and every data point in their applicant tracking system."
                },
                {
                  type: 'media',
                  content: {
                    type: 'video',
                    src: '/images/carv/carv-video-typing.mov',
                    alt: 'Recruiter Prompting Demo'
                  }
                }
              ]}
            />
            <FeedEntry
              year="2024"
              title="Studocu Ask AI Camera"
              contentBlocks={[
                {
                  type: 'text',
                  content: "At Studocu, I designed a camera‑first AI chat experience so students can ask anything about their paper‑based materials. Next to the camera, this feature is built around a toolkit  students can use to get  answers in different ways, summarise or explain concepts, and to use and search the content of the platform. I arrived at this toolkit after talking with students and discovering many of them were still  unsure on how or what to use AI for, while those who used it typically gravitated around the same use‑cases. These translated into an initial set of tools, and into a system designed to grow with more and more use cases over time."
                },
                {
                  type: 'media',
                  content: {
                    type: 'video',
                    src: '/images/Studocu/studocu-ask-ai-full-flow.mp4',
                    alt: 'Studocu Ask AI Camera'
                  }
                }
              ]}
              button={{
                text: "Read case study",
                href: "/case-studies/studocu"
              }}
            />
           <FeedEntry
              year="2024"
              title="Studocu Mobile App"
              contentBlocks={[
                {
                  type: 'text',
                  content: "As the designer responsible for the mobile app, I reorganised the experience around the key moments where the phone is uniquely relevant in the study journey. Behind this strategy was a plan to launch features that students could use in those moments: quizzes for quick study sessions, an AI camera to  work with paper-based materials, etc. To support this tool-centric approach, I designed a scalable navigation structure and rearranged the home screen so students could quickly discover, launch, and return to the most relevant tools. From this new base, the team was able to continue adding mobile tools to the app and eventually break from years of stagnant growth."
                },
                {
                  type: 'media',
                  content: {
                    type: 'image',
                    src: '/images/studocu/studocu-mobile-app.png',
                    alt: 'Studocu Mobile App'
                  }
                }
              ]}
            />
           {/* <FeedEntry
              year="2024"
              title="Studocu Design System Tokens"
              contentBlocks={[
                {
                  type: 'text',
                  content: "How do you make a token system for a brand built around 7 primary colors that are all used across the interface? This was the challenge I faced when helping the design system team to standardise our color system and make significant improvement to product consistency and solve as many contrast issues as possible in one go. The solution: a complex token system of 362 tokens supporting 8 color themes applicable to a design system of 50+ components. So peak"
                },
                {
                  type: 'media',
                  content: {
                    type: 'image',
                    src: '/images/carv/carv-video-typing.mov',
                    alt: 'Carv AI Recruiter Interface Demo'
                  }
                }
              ]}
            /> */}
           <FeedEntry
              year="2023"
              title="Ticketswap Mobile App Redesign"
              contentBlocks={[
                {
                  type: 'text',
                  content: "During my time at TicketSwap, I became very interested in redesigning the mobile app UI to bring it closer to its strong brand and make it feel like a modern, reliable and exciting entry point into live events. I worked with the design team to define a shared visual style and distilled it into a set of guiding principles that we applied across the app and design system. "
                },
                {
                  type: 'media',
                  content: {
                    type: 'image',
                    src: '/images/Ticketswap/TS_VD_feed.png',
                    alt: 'TicketSwap Visual Design'
                  }
                }
              ]}
            />
          <FeedEntry
              year="2023"
              title="Ticketswap Checkout"
              contentBlocks={[
                {
                  type: 'text',
                  content: "At TicketSwap, I redesigned the mobile checkout flow to make it feel lighter and faster while  improving trust for second‑hand ticket purchases. For example, I clarified our ticket safety policies and added a timer to show how long tickets were reserved during checkout, something essential for high-demand events. "
                },
                {
                  type: 'media',
                  content: {
                    type: 'video',
                    src: '/images/ticketswap/ticketswap-checkout-video.mp4',
                    alt: 'Ticketswap Checkout Flow'
                  }
                },
                {
                  type: 'text',
                  content: "As part of this new design, I also introduced a modular upsell system, so products like ticket insurance could be added or removed without adding friction  to the core experience."
                },
                {
                  type: 'media',
                  content: {
                    type: 'image',
                    src: '/images/ticketswap/TS_upsell_feed.png',
                    alt: 'Ticketswap Checkout Extras'
                  }
                }
              ]}
              button={{
                text: "Read case study",
                href: "/case-studies/ticketswap"
              }}
            />
            <FeedEntry
              year="2022"
              title="NS Lab, Dutch Railways"
              contentBlocks={[
                {
                  type: 'text',
                  content: "At NS Lab, Dutch Railways' experimental app, I designed personalised trip‑planning features that replace the traditional planning flow (search, choose, start) with journeys pre‑built around a traveller's habits. The big vision was to build towards a reality where a trip begins the moment the app is opened."
                },
                {
                  type: 'media',
                  content: {
                    type: 'image',
                    src: '/images/NS/ns_feed.png',
                    alt: 'NS Lab'
                  }
                }
              ]}
            />
          </div>
        </div>
      </Section>
    </>
  );
}
