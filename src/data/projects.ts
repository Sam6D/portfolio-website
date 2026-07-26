import { Project } from '@/types';
import { carv } from './projects/carv';
import { studocu } from './projects/studocu';
import { ticketswap } from './projects/ticketswap';

export const caseStudies: Project[] = [
  carv,
  studocu,
  ticketswap
];

export const featuredCaseStudies = caseStudies.filter(caseStudy => caseStudy.featured);