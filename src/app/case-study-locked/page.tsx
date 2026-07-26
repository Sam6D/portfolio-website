import { Section } from '@/components/ui/Section';
import { BackButton } from '@/components/ui/BackButton';
import { PasswordGate } from '@/components/ui/PasswordGate';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Password protected - Sami Désir',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function CaseStudyLockedPage() {
  return (
    <>
      <BackButton />
      <Section className="pt-48 pb-6">
        <PasswordGate />
      </Section>
    </>
  );
}
