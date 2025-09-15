import { Project } from '@/types';

export const studocu: Project = {
  id: '1',
  title: 'Ask AI Camera',
  description: 'Designing AI features for students from 0 to 1. Introducing design consistency to the company\'s many AI efforts.',
  longDescription: 'I joined the Studocu mobile app team with the mission to define the app\'s unique value proposition. The goal was to leverage mobile-specific opportunities to create a defining feature which would help increase retention and app downloads by turning the app into an essential study tool.',
  image: '/images/Studocu/Studo_Day1.png',
  images: [
    '/images/Studocu/Studo_Day1.png',
    '/images/Studocu/Studo_Idea.png',
    '/images/Studocu/Studo_TestingPrototype.png',
    '/images/Studocu/Studo_FinalDesign.png'
  ],
  tags: ['AI', 'Mobile Design', 'EdTech'],
  year: '2024',
  client: 'Studocu',
  role: 'Product Designer',
  duration: 'Current',
  tools: ['Figma', 'Principle', 'Maze', 'Hotjar'],
  featured: true,
  slug: 'studocu',
  content: {
    sections: [
      {
        title: 'Defining the Unique Feature',
        description: 'Starting with an open exploration phase, we hosted workshops with teams across the company. After refining ideas, we aligned on a solution that combined the phone\'s camera with AI chat capabilities. This would let students ask questions or clarify text from their books and notes using their camera.',
        image: '/images/Studocu/Studo_Idea.png',
        imageSize: 'small'
      },
      {
        title: 'Rapid Prototyping and Hackathon',
        description: `To validate the concept and assess its feasibility, we designed and built a prototype in 3 days.

The flow was simple: students snap a photo of a document, and AI would analyse it to give a useful answer based on the type of questions.

We validated that we could easily start with features like:
- Content categorisation
- Related documents
- Follow-ups
`,
        image: '/images/Studocu/Studo_Day1.png',
        imageAlt: 'Final design with the new Studocu AI visual language',
      },
      {
        title: 'Iterating on the Design',
        description: 'I refined the design, benchmarking competitors, prototyping with ChatGPT and incorporating insights from similar "Ask AI" features on Studocu web.\n\nMain changes: An extra step to let student choose what they wanted to ask. Placing non-essential info behind user actions: related documents, etc.\n\nWe deprioritised: User feedback on answer, Using our content as sources for the answer',
        image: '/images/Studocu/Studo_TestingPrototype.png',
        imageAlt: 'The prototype we used for testing'
      },
      {
        title: 'Research and Validation',
        description: 'User Interviews: We used testing sessions to validate the feature value, and improve usability.\n\nSurvey: We asked "Ask AI" web users about hypothetical attachments to prioritise use cases.\n\nDiary Study: Usage of the hackathon prototype gave us hints of use cases with the most potential for stickiness, and helped refine technical details that could alienate new users.'
      },
      {
        title: 'Iterating on Insights and Focus for MVP',
        description: 'What we validated: Giving users preset prompts is essential to help them know what they can use the tool for.\n\nWhat we learned: Optimise cropping for full pages, Prioritise RAGs and Sources in answer, Prioritise support for Math & Scientific subjects, and answering multiple questions, Opportunity to let users generate flashcards and quiz from their content'
      },
      {
        title: 'Refining the AI Visual Design Language',
        description: 'While refining the visual design of the feature, I took the opportunity to standardise the visual language for all our AI functionalities. The goal was to improve consistency across AI features as many designers were working in the space. This would also improve design processes and prevent unnecessary explorations.\n\nI led a workshop, and then a project with other designers to establish consistent principles for: color, components, motion, and less tangible elements around communication, trust and transparency.\n\nIn parallel, I applied the principles to this feature as I was wrapping it up.',
        image: '/images/Studocu/Studo_FinalDesign.png',
        imageAlt: 'Final design with the new Studocu AI visual language'
      },
      {
        title: 'Reflections on the Process',
        description: 'When it comes to designing for AI: Use AI tools or use functional prototypes early to get a feel of real content. User test ASAP, because the desired use case will always be unexpected. As with any complex system, work through tangible scenarios and extract system rules and structure from them.'
      }
    ]
  }
};
