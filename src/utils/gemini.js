const API_KEY = ''


// ─── Prompt ───────────────────────────────────────────────
function buildPrompt(topic) {
  return `You are an expert learning guide. The user wants to learn: "${topic}"

Return ONLY valid JSON — no markdown, no backticks, no extra text.

{
  "topic": "${topic}",
  "intro": "2-3 engaging, personal sentences about this topic. Mention why it's worth learning, one honest challenge, and one exciting opportunity. Sound like a smart mentor, not a robot.",
  "phases": [
    {
      "id": 1,
      "title": "Phase title e.g. The Fundamentals",
      "duration": "Weeks 1-3",
      "emoji": "🧱",
      "color": "#3B82F6",
      "summary": "One sentence about what this phase covers.",
      "topics": [
        {
          "id": 1,
          "title": "Topic title e.g. Variables & Data Types",
          "description": "One short sentence explaining what this is."
        }
      ]
    }
  ],
  "careers": [
    {
      "id": 1,
      "title": "Career title e.g. Data Scientist",
      "emoji": "📊",
      "difficulty": "Medium",
      "mathIntensity": "High",
      "salary": "$90k–$140k",
      "color": "#3B82F6",
      "description": "One sentence about this career path."
    }
  ]
}

Rules:
- Generate 4-6 phases
- Each phase has 3-6 topics
- Generate 4-6 career paths relevant to the topic
- difficulty: Easy / Medium / Hard
- mathIntensity: Low / Medium / High
- salary: realistic USD range
- emoji for each phase must be unique and relevant
- color for each phase: use different hex colors (blues, purples, teals, greens)`
}

function careerRoadmapPrompt(topic, career) {
  return `You are an expert learning guide. Create a focused roadmap for someone who wants to become a "${career}" using "${topic}".

Return ONLY valid JSON — no markdown, no backticks.

{
  "title": "Roadmap title",
  "intro": "2-3 sentences. Personal, motivating. What this path looks like, realistic timeline, biggest opportunity.",
  "phases": [
    {
      "id": 1,
      "title": "Phase title",
      "duration": "e.g. Weeks 1-4",
      "emoji": "🎯",
      "color": "#3B82F6",
      "summary": "One sentence summary.",
      "topics": [
        {
          "id": 1,
          "title": "Topic title",
          "description": "One short sentence."
        }
      ]
    }
  ]
}

Rules:
- 4-5 phases specific to this career path
- Each phase 3-5 topics
- Make it feel like a real career progression, not generic`
}

// ─── API call ─────────────────────────────────────────────
async function callGemini(prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.75, maxOutputTokens: 3000 },
      }),
    }
  )
  const data = await res.json()
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

export async function generateResult(topic) {
  if (!API_KEY) {
    await new Promise(r => setTimeout(r, 1800))
    return getMockResult(topic)
  }
  try {
    return await callGemini(buildPrompt(topic))
  } catch (e) {
    console.error(e)
    return getMockResult(topic)
  }
}

export async function generateCareerRoadmap(topic, career) {
  if (!API_KEY) {
    await new Promise(r => setTimeout(r, 1400))
    return getMockCareerRoadmap(topic, career)
  }
  try {
    return await callGemini(careerRoadmapPrompt(topic, career))
  } catch (e) {
    console.error(e)
    return getMockCareerRoadmap(topic, career)
  }
}

// ─── Mock data ────────────────────────────────────────────
export function getMockResult(topic) {
  return {
    topic,
    intro: `${topic} is one of the most versatile and in-demand skills you can learn right now. The honest truth: the first few weeks feel slow, but once things click, you'll start seeing it everywhere. The exciting part? Mastering this opens doors to dozens of career paths — many paying six figures from day one.`,
    phases: [
      {
        id: 1, emoji: '🧱', color: '#3B82F6',
        title: 'The Fundamentals', duration: 'Weeks 1–3',
        summary: 'Build the foundation everything else stands on.',
        topics: [
          { id: 1, title: 'Environment Setup', description: 'Install the tools and get your workspace ready.' },
          { id: 2, title: 'Core Syntax & Basics', description: 'Learn how the language thinks and speaks.' },
          { id: 3, title: 'Variables & Data Types', description: 'Strings, numbers, booleans — the atoms of your code.' },
          { id: 4, title: 'Control Flow', description: 'if/else and loops to make decisions and repeat work.' },
        ],
      },
      {
        id: 2, emoji: '🗂️', color: '#8B5CF6',
        title: 'Data Structures & Functions', duration: 'Weeks 4–6',
        summary: 'Organize data and write reusable, clean code.',
        topics: [
          { id: 1, title: 'Lists & Arrays', description: 'Ordered collections for storing multiple values.' },
          { id: 2, title: 'Dictionaries / Objects', description: 'Key-value pairs vital for real-world data.' },
          { id: 3, title: 'Functions & Scope', description: 'Write DRY code using def, arguments, return values.' },
          { id: 4, title: 'Error Handling', description: 'try/except blocks so your program never just crashes.' },
        ],
      },
      {
        id: 3, emoji: '📦', color: '#2DD4BF',
        title: 'Modules & Ecosystem', duration: 'Weeks 7–8',
        summary: 'Tap into thousands of libraries that do the heavy lifting.',
        topics: [
          { id: 1, title: 'Standard Libraries', description: 'Built-in modules: os, math, datetime, random.' },
          { id: 2, title: 'Package Managers', description: 'Install third-party packages with pip or npm.' },
          { id: 3, title: 'File I/O', description: 'Read and write txt, csv, and JSON files.' },
          { id: 4, title: 'APIs & HTTP', description: 'Fetch real data from the web using requests.' },
        ],
      },
      {
        id: 4, emoji: '🏗️', color: '#F59E0B',
        title: 'Object-Oriented Programming', duration: 'Weeks 9–10',
        summary: 'Think in objects — the way professional software is built.',
        topics: [
          { id: 1, title: 'Classes & Objects', description: 'Blueprints vs instances — the core OOP idea.' },
          { id: 2, title: 'Attributes & Methods', description: 'What an object is vs. what it can do.' },
          { id: 3, title: 'Inheritance', description: 'Child classes that extend parent behavior.' },
          { id: 4, title: 'Encapsulation', description: 'Hiding internal details behind clean interfaces.' },
        ],
      },
      {
        id: 5, emoji: '🚀', color: '#EC4899',
        title: 'Build Real Projects', duration: 'Weeks 11–12',
        summary: 'Apply everything — this is where learning becomes skill.',
        topics: [
          { id: 1, title: 'Project Planning', description: 'Scope a project that is small enough to finish.' },
          { id: 2, title: 'Version Control (Git)', description: 'Track your work and collaborate with others.' },
          { id: 3, title: 'Deployment', description: 'Put your project live on the internet.' },
          { id: 4, title: 'Portfolio & Next Steps', description: 'Document your work and plan your career path.' },
        ],
      },
    ],
    careers: [
      { id: 1, emoji: '📊', color: '#3B82F6', title: 'Data Scientist', difficulty: 'Hard', mathIntensity: 'High', salary: '$95k–$145k', description: 'Analyze massive datasets to find patterns and drive decisions.' },
      { id: 2, emoji: '🤖', color: '#8B5CF6', title: 'ML Engineer', difficulty: 'Hard', mathIntensity: 'High', salary: '$110k–$160k', description: 'Build and deploy machine learning models at production scale.' },
      { id: 3, emoji: '🌐', color: '#2DD4BF', title: 'Backend Developer', difficulty: 'Medium', mathIntensity: 'Low', salary: '$85k–$130k', description: 'Build APIs, databases, and server-side applications.' },
      { id: 4, emoji: '🔐', color: '#F59E0B', title: 'Security Engineer', difficulty: 'Hard', mathIntensity: 'Medium', salary: '$100k–$150k', description: 'Find vulnerabilities and protect systems from attacks.' },
      { id: 5, emoji: '⚙️', color: '#EC4899', title: 'DevOps Engineer', difficulty: 'Medium', mathIntensity: 'Low', salary: '$90k–$135k', description: 'Automate infrastructure and keep systems running at scale.' },
      { id: 6, emoji: '🎨', color: '#10B981', title: 'Automation Engineer', difficulty: 'Easy', mathIntensity: 'Low', salary: '$70k–$110k', description: 'Write scripts to automate repetitive tasks and workflows.' },
    ],
  }
}

export function getMockCareerRoadmap(topic, career) {
  return {
    title: `${career} Roadmap via ${topic}`,
    intro: `Becoming a ${career} with ${topic} is one of the most direct paths in tech right now. Expect 6–12 months of focused learning before your first role. The market is hungry for people who can bridge theory and real-world execution — that's exactly what this roadmap builds.`,
    phases: [
      {
        id: 1, emoji: '🎯', color: '#3B82F6',
        title: 'Core Skills for This Role', duration: 'Weeks 1–4',
        summary: `The specific ${topic} skills that every ${career} needs.`,
        topics: [
          { id: 1, title: `${topic} Fundamentals Review`, description: 'Lock in the basics with career-focused examples.' },
          { id: 2, title: 'Role-Specific Libraries', description: `The key packages every ${career} uses daily.` },
          { id: 3, title: 'Industry Tools Setup', description: 'Configure the exact tools used in this field.' },
        ],
      },
      {
        id: 2, emoji: '📚', color: '#8B5CF6',
        title: 'Domain Knowledge', duration: 'Weeks 5–8',
        summary: 'Learn the theory and concepts specific to this career.',
        topics: [
          { id: 1, title: 'Core Theory', description: `The foundational concepts every ${career} must know.` },
          { id: 2, title: 'Best Practices', description: 'Industry standards and patterns used in production.' },
          { id: 3, title: 'Case Studies', description: 'Study how real companies solve real problems.' },
        ],
      },
      {
        id: 3, emoji: '🔨', color: '#2DD4BF',
        title: 'Hands-On Projects', duration: 'Weeks 9–12',
        summary: 'Build 2-3 portfolio projects that prove your skills.',
        topics: [
          { id: 1, title: 'Project 1 — Beginner', description: 'A small project that demonstrates your fundamentals.' },
          { id: 2, title: 'Project 2 — Intermediate', description: 'A real-world problem with measurable outcomes.' },
          { id: 3, title: 'Project 3 — Portfolio Piece', description: 'Your showstopper — the one you talk about in interviews.' },
        ],
      },
      {
        id: 4, emoji: '💼', color: '#F59E0B',
        title: 'Job Ready', duration: 'Weeks 13–16',
        summary: 'Get hired — resume, interviews, and negotiation.',
        topics: [
          { id: 1, title: 'Resume & LinkedIn', description: `How to position yourself as a ${career} candidate.` },
          { id: 2, title: 'Interview Prep', description: 'Common technical and behavioral questions for this role.' },
          { id: 3, title: 'Salary Negotiation', description: 'Know your worth and how to negotiate your offer.' },
        ],
      },
    ],
  }
}
