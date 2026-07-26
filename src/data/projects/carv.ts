import { Project } from '@/types';

export const carv: Project = {
  id: '3',
  title: 'Carv: From AI Notetaker to Agentic Platform',
  description: 'Case study coming soon.',
  image: '/images/thumbnails/carv-thumbnail.png',
  images: [],
  tags: ['AI', 'Product Design', 'Recruitment Tech'],
  year: '2025',
  featured: true,
  slug: 'carv',
  protected: true,
  content: {
    markdown: `Carv is an AI platform for recruiters. I joined as the company was preparing to expand beyond its notetaker origins into an agentic tool covering the entire recruitment workflow. As the only in-house designer, I worked with the company leadership and a small team of talented external designers on a complete redesign of the product.

# **Why a Redesign**

Carv started as a notetaker. After a meeting with a candidate or hiring manager, it would update the ATS, generate candidate documents, draft job descriptions, and let recruiters ask AI about any past meeting or candidate.

That setup was starting to hit walls.

![Carv before the redesign](/images/carv/carv-before-redesign.png)

**Recruiter pain points:**

- AI could only do what the app's navigation and document templates allowed.
- Recruiters relied on hacks to work around the lack of flexibility: prompts saved in Google Docs, deleting and regenerating documents, pasting transcripts into ChatGPT.
- No visibility on what Carv was doing in the background.

**Business needs:**

- The meeting-centric app was holding back expansion into candidate sourcing, applicant screening, and beyond.
- Carv couldn't show its agentic vision to prospect clients and investors.
- With limited added value in the interface itself, Carv was becoming a background process.

**The goal:** Turn Carv from a notetaker into an agentic platform where recruiters can work freely with their ATS and meeting data, triggering tasks and collaborating with AI across the complete recruitment workflow.

# **The New Carv App**

<video src="/images/carv/carv-home-recording.mp4" title="Starting tasks from the new app home screen"></video>

<video src="/images/carv/carv-candidate-meeting-recording.mp4" title="Navigation to the candidates and meeting pages to chat about these resources"></video>

The new Carv is a chat layer that lives above the ATS. From a single input, recruiters can ask anything about their candidates, jobs, and meetings, and trigger tasks like generating documents or sourcing candidates. The interface is designed to scale to new use cases as Carv keeps expanding into the recruitment workflow.

The chat interface removes the limits of the old app's presets and navigation. A document about a specific candidate for a specific job, a comparison of two candidates based on a recent interview, an adapted template, a document outside the predefined set: recruiters can now get to any of it by using the chat interface.

The app isn't only chat, though. Recruiters can also navigate directly to a candidate, job, or meeting page, where they find the history of that object and its previous chats, and can start a new, dedicated chat scoped to it.

# **Step 1: Getting the Chat Right**

When I joined, the team was establishing the foundation by building the first workflow in the existing app: candidate sourcing.

![Early candidate sourcing chat and results](/images/carv/carv-candidate-sourcing-chat.png)

The work here was about shaping the right interaction model for a chat-based candidate search. What was hard to get right was combining chat and results into a single, coherent screen, and toning down a visually loud UI. Just as important was simplifying how we showed which candidates were better matches, explained what the AI used to find them, and let recruiters shortlist candidates to save and present. Through iterations, we landed on a split view with the chat as the core interaction next to the candidate list.

<video src="/images/carv/carv-conversation-flow-redesign.mp4" title="The candidate search flow in the previous app"></video>

# **Step 2: Setting the New App Fundamentals**

While I was refining our first chat-based flow, we started collaborating with an external agency to help us set a vision for what an agentic Carv could look like.

This quickly turned into a strong direction, showing us how a chat-first interface could become the starting point for a multitude of recruitment tasks, letting recruiters flow from processing candidates for a position to preparing an interview with an upcoming candidate, and more.

![Home screen, one week in vs. two months later](/images/carv/carv-home-screen-progression.png)

This long-term vision combined our existing features with others that, for now, only ran as background processes. But in there, I also saw what was within reach: we could start by bringing all the existing Carv features into this new model, serving our existing customers better while building towards that longer-term vision.

To make the concept tangible and closer to our reality, I built a prototype in Cursor. Being code-based made it possible to nail the complex keyboard micro-interactions the new chat relied on, like contextual menus and @ mentions. It also helped facilitate the conversation with engineers about what it would take to make this a reality, as a link anyone at the company could open and try for themselves.

<video src="/images/carv/carv-cursor-prototype.mp4" title="The early prototype, with the mention and tools mechanisms"></video>

# **Step 3: Turning the Concept into an App**

From there, we refined the concept into all its details.

**The chat input.** To blend the fully open nature of a chat with discoverability, the input combines tools and dynamic autocomplete. Typing "create" opens a contextual menu of documents that narrows down as you type. Tagging @a candidate attaches them to the prompt. A few keystrokes turn a vague intention into a fully scoped task, and along the way, the input teaches recruiters what the product can do.

<video src="/images/carv/carv-chat-autocomplete.mp4" title="The chat autocomplete interactions"></video>

**Everything is a chat.** Every task lives as a chat, and the history combines chats the recruiter started with tasks Carv initiated on its own. After a meeting, for example, Carv can generate a candidate presentation and update fields in the ATS by itself. That work shows up in the candidate's recent activity, and opening it drops recruiters into the chat that produced it, with the AI's next suggestions already lined up.

![Candidate page recent activity](/images/carv/carv-candidate-recent-activity.png)

![AI-generated task follow-up](/images/carv/carv-ai-task-followup.png)

**The home screen as a dashboard.** The home screen brings it all together: the prompt bar, suggestion cards for the most relevant actions, and quick access to recent candidates, jobs, and meetings. It isn't just there to help users understand what they can do with the tool; it's the starting point for the actions they'll want to take that day. To support this, we built a flexible system that lets Carv suggest timely actions, working towards a model where a recruiter could simply ask: help me start my day and prepare everything in front of me.

![The new home screen](/images/carv/carv-new-home-screen.png)

# **What's Next**

This redesign was the foundation, with a big roadmap still ahead: a dedicated space for human-in-the-loop review, features to trigger and review the AI Interviewer and AI Prospector, and deeper customisation such as custom prompts and user-level documents.

# **Reflections on the Process**

- Chat might actually be the interface where it all lands. Like many product people, I've been skeptical of chat as the default way to bring AI into a product. But this redesign turned out to be a strong counterexample: going chat-first solved real user pain points, giving recruiters the flexibility to ask for anything the platform could do without needing us to have built specifically for their request. That's a powerful thing to design for.
- Designing for interactions with LLMs means embracing the open-endedness of the system. The task is less about defining end-to-end flows and more about setting the stage for an ideal interaction with the LLM, often a chat, then supplementing it with tools that frame the workflows and let users go deeper.
- Going all in on chat doesn't mean your app doesn't need reliable navigation to support users' workflows. The chat is a great starting point, but users still need to access resources, get back to previous tasks, or find those that need their attention.
- This project turned into a practical example of the principles I carry with me as a designer: using design to cut through uncertainty and create alignment and movement towards a vision. That's how I aim to work: setting an exciting north star with strong craft, using prototypes to replace roadmap debates with a shared sense of what's within reach, and choosing simplicity over everything. Here, that meant one mode of interaction, the chat, repeated everywhere with small variations.`
  }
};
