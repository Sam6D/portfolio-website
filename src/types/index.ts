export interface ProjectContentSection {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  imageSize?: 'default' | 'small';
}

export interface ProjectContent {
  sections: ProjectContentSection[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  images: string[];
  tags: string[];
  year: string;
  client?: string;
  role: string;
  duration: string;
  tools: string[];
  featured: boolean;
  slug: string;
  content?: ProjectContent;
}

export interface NavigationItem {
  name: string;
  href: string;
}
