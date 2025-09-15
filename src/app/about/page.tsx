import { Section } from '@/components/ui/Section';

export default function About() {
  return (
    <>
      {/* Hero Section */}
      <Section className="pt-48 pb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About Me
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Senior Product Designer with 5+ years of experience in consumer and B2B products across AI, mobile, marketplaces, and SaaS. 
            Introduced new revenue streams, improved engagement through user-centered design, and partnered with leadership to set product vision. 
            Skilled at balancing detail and speed to create practical solutions in fast-paced environments.
          </p>
        </div>
      </Section>

      {/* Experience */}
      <Section className="pt-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Experience</h2>
          
          <div className="space-y-8">
            {/* Carv */}
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-gray-400 text-xs font-medium">Carv</span>
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">Senior Product Designer, Recruitment AI</h3>
                  <span className="text-gray-600 text-sm">Mar 2025 - Now</span>
                </div>
                <p className="text-gray-700 font-medium mb-2">Amsterdam, Netherlands</p>
              </div>
            </div>

            {/* Studocu */}
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-gray-400 text-xs font-medium">Studocu</span>
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">Senior Product Designer, Mobile</h3>
                  <span className="text-gray-600 text-sm">Feb 2024 - Feb 2025</span>
                </div>
                <p className="text-gray-700 font-medium mb-2">Amsterdam, Netherlands</p>
              </div>
            </div>

            {/* TicketSwap */}
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-gray-400 text-xs font-medium">TS</span>
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">Product Designer, Buying</h3>
                  <span className="text-gray-600 text-sm">Nov 2022 - Dec 2023</span>
                </div>
                <p className="text-gray-700 font-medium mb-2">Amsterdam, Netherlands</p>
              </div>
            </div>

            {/* argodesign */}
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-gray-400 text-xs font-medium">AD</span>
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">Interaction & Product Designer</h3>
                  <span className="text-gray-600 text-sm">Nov 2019 - Nov 2022</span>
                </div>
                <p className="text-gray-700 font-medium mb-2">Amsterdam, Netherlands</p>
              </div>
            </div>
          </div>
          
          {/* Download Resume Button */}
          <div className="mt-16 text-center">
            <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Download my resume
            </button>
          </div>
        </div>
      </Section>
    </>
  );
}
