import { Project } from '@/types';

export const ticketswap: Project = {
  id: '2',
  title: 'TicketSwap',
  description: 'Improving the buying experience of the Netherlands\' most popular ticket app and building towards a big vision.',
  longDescription: 'TicketSwap is the largest ticket resale platform in the Netherlands. In 2022 I joined the team as the designer responsible for the buying experience. Next to that, I was also driving the visual redesign of the apps and collaborated with the head of product and the rest of the design team to set a long term vision for the product.',
  image: '/images/ticketswap/TS_hero.png',
  images: [
    '/images/ticketswap/TS_hero.png',
    '/images/ticketswap/TS_checkout.png',
    '/images/ticketswap/TS_extras.png',
    '/images/ticketswap/TS_VD.png'
  ],
  tags: ['Product Design', 'Visual Design', 'Design Strategy'],
  year: '2022-23',
  client: 'TicketSwap',
  role: 'Product Designer',
  duration: '1 year',
  tools: ['Figma', 'Principle', 'Maze', 'Hotjar'],
  featured: true,
  slug: 'ticketswap',
  content: {
    sections: [
      {
        title: 'Redesigning the app\'s checkout flow',
        description: 'The checkout flow is the core flow of the buying team. When I joined the team, I started working on redesigning the flow with the goal of removing unnecessary steps, improving the experience for all buyers and setting the stage to start experimenting with commercial initiatives.',
        image: '/images/ticketswap/TS_checkout.png',
      },
      {
        title: 'Offering extras at checkout',
        description: 'To support the company\'s commercial ambitions, the new checkout screen is designed to accommodate extras to add to the order. My goal was to strike a balance between giving high visibility to extra products while keeping the checkout process straightforward for buyers who just want to pay for their tickets.',
        image: '/images/ticketswap/TS_extras.png',
      },
      {
        title: 'Defining a new visual identity for the apps',
        description: 'My largest focus outside of the work I do with my product team has been to lead the effort to modernise the look and feel of the TicketSwap mobile app. With this new look, the goal is to make the product look more inline with the current UI design standards and to let TicketSwap\'s unique identity shine through its product.\n\nThis new identity was defined by working with the team on a vision for the future of the app and then summarised under 8 principles. It is now being implemented in the live app step by step.',
        image: '/images/ticketswap/TS_VD.png',
      },
    ]
  }
};
