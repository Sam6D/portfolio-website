import { Project } from '@/types';

export const nsDutchRailways: Project = {
  id: '3',
  title: 'NS Lab',
  description: 'Piloting hyper-personalized travel features in the NS Lab App.',
  longDescription: 'NS Lab is an experimental app created by Dutch Railways to test innovative features before rolling them out to their main app. In 2021, I joined the team to design and deliver advanced personalization features. During this project, I established new processes to align design delivery and documentation with development team needs, resulting in higher standards at launch.',
  image: '/images/NS/NS_Hero.jpg',
  images: [
    '/images/NS/NS_Hero.jpg',
    '/images/NS/NS_DirectPlanning.png',
    '/images/NS/Ns_Suggestions.png',
    '/images/NS/NS_Personalisation.png'
  ],
  tags: ['Product Design', 'Strategy', 'Prototyping'],
  year: '2021',
  client: 'NS (Dutch Railways)',
  role: 'Product Designer',
  duration: '5 months',
  tools: ['Figma', 'Principle', 'Maze', 'Hotjar'],
  featured: true,
  slug: 'ns-dutch-railways',
  content: {
    sections: [
      {
        title: 'A trip planning experience tailored to your travel habits',
        description: 'Following a vision phase to improve the planning experience, I worked with the product team to implement the revamped trip planning flow. I delivered logic systems and pixel-perfect designs including dynamic modules on the Home screen and Trip Overview screen where users can view different trip legs on the map and in a UI drawer.',
        image: '/images/NS/NS_DirectPlanning.png',
      },
      {
        title: 'Start a trip at the press of a button',
        description: 'The goal was to enable travelers to start their trip with minimal taps. The app eliminates traditional steps like searching for destinations, selecting transport modes, and choosing routes. Instead, NS Lab suggests destinations based on traveler data and automatically selects routes based on preferred transport methods.\n\nFrom the home screen, users can tap on a favorite destination to see the step-by-step journey that fits their preferences, or immediately start navigation when they receive a trip suggestion.'
      },
      {
        title: 'A dynamic Home screen',
        description: 'Imagine opening your app in the morning and finding your trip already waiting on the Home screen. The trip suggestion accounts for your preference to cycle to the train station and walk rather than take the tram for the final stretch.\n\nNS Lab uses in-app preferences like preferred transport modes, user-set favorites, and travel history to plan trips with minimal steps. The app reorders favorite and frequent destinations on the Home screen and surfaces timely, location-aware trip suggestions.',
        image: '/images/NS/Ns_Suggestions.png',
      },
      {
        title: 'Mapping the road to personalisation for the team',
        description: 'Working with the product team, we developed a plan to gradually implement favorites and dynamic sorting by ramping up personalization features and collecting more data points.\n\nAs a first step, we explored adding the option for users to set their own favorites to their list of frequent destinations, reducing reliance on automatically collected travel data. The next step would involve adding a more advanced sorting algorithm to organize favorites and surface the most relevant destinations when travelers need them.',
        image: '/images/NS/NS_Personalisation.png',
      }
    ]
  }
};
