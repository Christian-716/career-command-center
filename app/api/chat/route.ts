import { GoogleGenerativeAI } from '@google/generative-ai'
import { UserProfile } from '@/lib/types/profile'
import { Application } from '@/lib/types/application'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)

function buildSystemPrompt(profile: UserProfile | null, applications: Application[]): string {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const appSummary = applications.length
    ? applications
        .map((a) => `- ${a.company} (${a.role}): ${a.stage}${a.notes ? ' - ' + a.notes : ''}`)
        .join('\n')
    : 'No applications yet.'

  if (!profile) {
    return `You are a career assistant for a new grad software engineer actively job hunting. Today is ${today}.

Current applications:
${appSummary}

Guidelines:
- Be direct and actionable. No filler, no hedging.
- No em dashes in your responses.
- Keep responses concise unless the user asks for depth.
- You can help with resumes, cover letters, interview prep, job search strategy, and application tracking.`
  }

  const starSummary = profile.starStories.length
    ? profile.starStories
        .map((s) => `  - ${s.title}: ${s.situation} -> ${s.result}`)
        .join('\n')
    : '  None on file yet.'

  return `You are a career assistant for ${profile.name}.

== PROFILE ==
Background: ${profile.background}
Education: ${profile.education}
Top skills: ${profile.topSkills.join(', ')}
Projects: ${profile.projects.join(', ')}
Working style: ${profile.workingStyle}
Core values: ${profile.coreValues.join(', ')}
Target role: ${profile.targetRole}
Target locations: ${profile.targetLocations.join(', ')}${profile.salaryExpectation ? `\nSalary expectation: ${profile.salaryExpectation}` : ''}${profile.dealbreakers.length ? `\nDealbreakers: ${profile.dealbreakers.join(', ')}` : ''}

== STAR STORIES ==
${starSummary}

== APPLICATIONS (${applications.length} total) ==
${appSummary}

== TODAY ==
${today}

== VOICE RULES ==
- No em dashes in your responses. Use commas or rewrite the sentence instead.
- Be direct and specific. Reference their actual background, skills, and stories when relevant.
- Keep responses tight unless the user asks for something long.
- You know this person's full context, act like it. Don't be generic.`
}

export async function POST(req: Request) {
  const { messages, profile, applications } = await req.json()

  const systemPrompt = buildSystemPrompt(profile ?? null, applications ?? [])
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-lite',
    systemInstruction: systemPrompt,
  })

  const allButLast: { role: string; content: string }[] = messages.slice(0, -1)
  const firstUserIdx = allButLast.findIndex((m) => m.role === 'user')
  const history = (firstUserIdx === -1 ? [] : allButLast.slice(firstUserIdx)).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const lastMessage = messages[messages.length - 1]
  const chat = model.startChat({ history })
  const result = await chat.sendMessageStream(lastMessage.content)

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text()
          if (text) controller.enqueue(new TextEncoder().encode(text))
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
