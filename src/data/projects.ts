import { Project } from '@/types';
import { studocu } from './projects/studocu';
import { ticketswap } from './projects/ticketswap';

export const caseStudies: Project[] = [
  studocu,
  ticketswap
];

export const featuredCaseStudies = caseStudies.filter(caseStudy => caseStudy.featured);