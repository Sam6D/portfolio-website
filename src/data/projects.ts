import { Project } from '@/types';
import { studocu } from './projects/studocu';
import { ticketswap } from './projects/ticketswap';
import { nsDutchRailways } from './projects/ns-dutch-railways';

export const projects: Project[] = [
  studocu,
  ticketswap,
  nsDutchRailways
];

export const featuredProjects = projects.filter(project => project.featured);