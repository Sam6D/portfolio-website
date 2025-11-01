import { Project } from '@/types';

export const studocu: Project = {
  id: '1',
  title: 'Studocu, Ask AI Camera',
  description: 'Designing AI features for students from 0 to 1. Introducing design consistency to the company\'s many AI efforts.',
  image: '/images/thumbnails/studocu-thumbnail.png',
  images: [
    '/images/Studocu/Studo_Day1.png',
    '/images/Studocu/Studo_Idea.png',
    '/images/Studocu/Studo_TestingPrototype.png',
    '/images/Studocu/Studo_FinalDesign.png'
  ],
  tags: ['AI', 'Mobile Design', 'EdTech'],
  year: '2024',
  featured: true,
  slug: 'studocu',
  content: {
    markdown: `I joined the studocu mobile app team with the mission to define the app's unique value proposition.
    

**The goal:** Leverage mobile-specific opportunities to create a defining feature which would help increase retention and app downloads by turning the app into an essential study tool.

<video src="/images/Studocu/studocu-ask-ai-full-flow.mp4"></video>

# **Step 1: Defining the Unique Feature**

Starting with an open exploration phase, we hosted workshops with teams across the company.

After refining ideas, we aligned on a solution that combined the phone's camera with AI chat capabilities. This would let students ask questions or clarify text from their books and notes using their camera.

![Day 1 prototype development](/images/Studocu/Studo_Day1.png)

# **Step 2: Rapid Prototyping and Hackathon**

To validate the concept and assess its feasibility, we designed and built a prototype in 3 days.

The flow was simple: students snap a photo of a document, and AI would analyse it to give a useful answer based on the type of questions.

This validated that the team could easily build:

- Identify and categorise the captured content (image, text, question, etc.)
- Related documents
- Follow-up questions

![Rapid Prototyping and Hackathon](/images/Studocu/Studo_TestingPrototype.png)

# **Step 3: Iterating on the Design**

I refined the design, benchmarking competitors, prototyping with ChatGPT and incorporating insights from similar "Ask AI" features on Studocu web.

**Main changes:**

- An extra step to let student choose what they wanted to ask.
- Placing non-essential info behind user actions: related documents, etc.

**We deprioritised:**

- User feedback on answer,
- Using our content as sources for the answer (we were wrong!)

![The prototype we used for testing](/images/Studocu/Studo_TestingPrototype.png)

# **Step 4: Research and Validation**

- **User Interviews**: We used testing sessions to validate the feature value, and improve usability.
- **Survey:** We asked "Ask AI" web users about hypothetical attachments to prioritise use cases.
- **Diary Study:** Usage of the hackathon prototype gave us hints of use cases with the most potential for stickiness, and helped refine technical details that could alienate new users.

# **Step 5: Iterating on Insights and Focus for MVP**

**What we validated:**

- Giving users preset prompts is essential to help them know what they can use the tool for.
- Students that have success with AI in their studies gravitate around the same use cases

**What we learned:**

- Optimise cropping for full pages
- Prioritise RAGs and Sources in answer
- Prioritise support for Math & Scientific subjects, and answering multiple questions
- There is an opportunity to let users generate flashcards and quiz from their content

# **Step 6: Refining the Visual Design (and Defining AI Design Guidelines for all Studocu)**

While refining the visual design of the feature, I took the opportunity to standardise the visual language for all our AI functionalities. The goal was to improve consistency across AI features as many designers were working in the space. This would also improve design processes and prevent unnecessary explorations.

I led a task force with other designers to establish consistent principles for: color, components, motion next to broader design attributes like communication, trust and transparency.

In parallel, I applied the new visual language to the AI Camera

![Final design with the new Studocu AI visual language](/images/Studocu/Studo_FinalDesign.png)

# **Reflections on the Process**

My main takeaways on designing for AI:

- Use AI tools, or even functional prototypes early to start working with LLM content.
- User test a working prototype ASAP to learn how your users will combine their content with your AI tool. This will help identify the most valuable use cases to focus on.
- Design for systems not just flows, with rules and structures that can support the infinite number of use cases that a user might use your tool for. But, defining those rules require to work through realistic flows (see #2).
- Sources are an essential dimension of a chat based interface. They build trust, and they are what makes the tool different than other LLMs.`
  }
};