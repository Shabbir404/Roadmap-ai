// const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || ''

// ─── Core API call ────────────────────────────────────────
// async function callAI(prompt) {
//     const res = await fetch('https://api.deepseek.com/chat/completions', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${API_KEY}`,
//         },
//         body: JSON.stringify({
//             model: 'deepseek-chat',
//             messages: [{ role: 'user', content: prompt }],
//             max_tokens: 3000,
//             temperature: 0.75,
//         }),
//     })
//     const data = await res.json()
//     const raw = data?.choices?.[0]?.message?.content || ''
//     const clean = raw.replace(/```json|```/g, '').trim()
//     return JSON.parse(clean)
// }

async function callAI(prompt) {
    const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data?.error || 'Server error')
    }

    return data
}
// ─── Prompts ──────────────────────────────────────────────
function buildPrompt(topic) {
    return `You are an expert learning guide. The user wants to learn: "${topic}"

Return ONLY valid JSON — no markdown, no backticks, no extra text.

{
  "topic": "${topic}",
  "intro": "2-3 engaging personal sentences about this topic. Mention why it's worth learning, one honest challenge, one exciting opportunity. Sound like a smart mentor not a robot.",
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
- Each phase has 4-6 topics
- Generate 4-6 career paths relevant to this exact topic
- difficulty: Easy / Medium / Hard
- mathIntensity: Low / Medium / High
- salary: realistic USD range
- each phase emoji must be unique and relevant
- each phase color must be different hex color`
}

function careerPrompt(topic, career) {
    return `You are an expert learning guide. Create a focused roadmap for becoming a "${career}" using "${topic}".

Return ONLY valid JSON — no markdown, no backticks.

{
  "title": "Roadmap title",
  "intro": "2-3 sentences. Personal and motivating. Realistic timeline and biggest opportunity.",
  "phases": [
    {
      "id": 1,
      "title": "Phase title",
      "duration": "Weeks 1-4",
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
- 4-5 phases specific to this career
- Each phase 3-5 topics
- Make it feel like a real career progression`
}

// ─── Exports ──────────────────────────────────────────────
export async function generateResult(topic) {
    return callAI(buildPrompt(topic))
}

export async function generateCareerRoadmap(topic, career) {
    return callAI(careerPrompt(topic, career))
}

// ─── Mock data ────────────────────────────────────────────
export function getMockResult(topic) {
    return {
        topic,
        intro: `${topic} is one of the most in-demand skills right now. The honest truth: the first few weeks feel slow, but once things click you will start seeing it everywhere. The exciting part? Mastering this opens doors to dozens of high-paying career paths.`,
        phases: [
            {
                id: 1, emoji: '🧱', color: '#3B82F6',
                title: `${topic} Fundamentals`, duration: 'Weeks 1–3',
                summary: `Core concepts every ${topic} learner must know.`,
                topics: [
                    { id: 1, title: `Introduction to ${topic}`, description: 'What it is, why it matters, and how it works.' },
                    { id: 2, title: 'Environment & Tools Setup', description: 'Install and configure everything you need.' },
                    { id: 3, title: 'Core Concepts & Syntax', description: 'The fundamental building blocks used every day.' },
                    { id: 4, title: 'Your First Project', description: `Build something small but real with ${topic}.` },
                ],
            },
            {
                id: 2, emoji: '⚙️', color: '#8B5CF6',
                title: 'Core Skills', duration: 'Weeks 4–6',
                summary: 'Go deeper into the essential patterns and techniques.',
                topics: [
                    { id: 1, title: 'Data Structures', description: 'Organize and manipulate data efficiently.' },
                    { id: 2, title: 'Functions & Modules', description: 'Write reusable, clean, and organized code.' },
                    { id: 3, title: 'Error Handling', description: 'Build programs that handle failure gracefully.' },
                    { id: 4, title: 'Working with APIs', description: 'Fetch and use real data from the internet.' },
                ],
            },
            {
                id: 3, emoji: '🚀', color: '#2DD4BF',
                title: 'Intermediate Topics', duration: 'Weeks 7–9',
                summary: 'Level up with advanced patterns used in production.',
                topics: [
                    { id: 1, title: 'Object Oriented Programming', description: 'Model real-world problems with classes and objects.' },
                    { id: 2, title: 'Testing & Debugging', description: 'Write tests and squash bugs like a pro.' },
                    { id: 3, title: 'Performance Optimization', description: 'Make your code fast and memory efficient.' },
                    { id: 4, title: 'Version Control with Git', description: 'Track changes and collaborate with others.' },
                ],
            },
            {
                id: 4, emoji: '💼', color: '#F59E0B',
                title: 'Build & Deploy', duration: 'Weeks 10–12',
                summary: 'Ship real projects and get job ready.',
                topics: [
                    { id: 1, title: 'Project Planning', description: 'Scope and plan a project you can actually finish.' },
                    { id: 2, title: 'Build a Portfolio Project', description: 'Your showstopper for interviews.' },
                    { id: 3, title: 'Deployment', description: 'Put your project live on the internet.' },
                    { id: 4, title: 'Resume & Job Applications', description: 'Land your first role with this skill.' },
                ],
            },
        ],
        careers: [
            { id: 1, emoji: '📊', color: '#3B82F6', title: 'Data Analyst', difficulty: 'Medium', mathIntensity: 'Medium', salary: '$65k–$110k', description: 'Turn raw data into business insights and decisions.' },
            { id: 2, emoji: '🤖', color: '#8B5CF6', title: 'ML Engineer', difficulty: 'Hard', mathIntensity: 'High', salary: '$110k–$160k', description: 'Build and deploy machine learning models at scale.' },
            { id: 3, emoji: '🌐', color: '#2DD4BF', title: 'Backend Developer', difficulty: 'Medium', mathIntensity: 'Low', salary: '$85k–$130k', description: 'Build APIs, databases, and server-side applications.' },
            { id: 4, emoji: '⚙️', color: '#F59E0B', title: 'DevOps Engineer', difficulty: 'Medium', mathIntensity: 'Low', salary: '$90k–$135k', description: 'Automate infrastructure and keep systems running.' },
            { id: 5, emoji: '🔐', color: '#EC4899', title: 'Security Engineer', difficulty: 'Hard', mathIntensity: 'Medium', salary: '$100k–$150k', description: 'Protect systems and find vulnerabilities.' },
        ],
    }
}

export function getMockCareerRoadmap(topic, career) {
    return {
        title: `${career} Roadmap via ${topic}`,
        intro: `Becoming a ${career} with ${topic} is one of the most direct paths in tech right now. Expect 6–12 months of focused learning before your first role. The market is hungry for people who can bridge theory and real execution.`,
        phases: [
            {
                id: 1, emoji: '🎯', color: '#3B82F6',
                title: 'Core Skills for This Role', duration: 'Weeks 1–4',
                summary: `The specific ${topic} skills every ${career} needs.`,
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
                    { id: 1, title: 'Core Theory', description: `Foundational concepts every ${career} must know.` },
                    { id: 2, title: 'Best Practices', description: 'Industry standards used in production.' },
                    { id: 3, title: 'Case Studies', description: 'How real companies solve real problems.' },
                ],
            },
            {
                id: 3, emoji: '🔨', color: '#2DD4BF',
                title: 'Hands-On Projects', duration: 'Weeks 9–12',
                summary: 'Build 2-3 portfolio projects that prove your skills.',
                topics: [
                    { id: 1, title: 'Project 1 — Beginner', description: 'Small project demonstrating fundamentals.' },
                    { id: 2, title: 'Project 2 — Intermediate', description: 'Real-world problem with measurable outcomes.' },
                    { id: 3, title: 'Project 3 — Portfolio Piece', description: 'The one you talk about in interviews.' },
                ],
            },
            {
                id: 4, emoji: '💼', color: '#F59E0B',
                title: 'Job Ready', duration: 'Weeks 13–16',
                summary: 'Get hired — resume, interviews, negotiation.',
                topics: [
                    { id: 1, title: 'Resume & LinkedIn', description: `Position yourself as a ${career} candidate.` },
                    { id: 2, title: 'Interview Prep', description: 'Common technical and behavioral questions.' },
                    { id: 3, title: 'Salary Negotiation', description: 'Know your worth and negotiate your offer.' },
                ],
            },
        ],
    }
}