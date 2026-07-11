import { GoogleGenerativeAI } from '@google/generative-ai'
import { UserProfile } from '@/lib/types/profile'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)

function buildSystemPrompt(profile: UserProfile | null): string {
  if (!profile) {
    return `You are a career advisor analyzing job fit for a software engineering candidate. Analyze how well the candidate matches the provided job description.`
  }

  return `You are a career advisor analyzing job fit for ${profile.name}.

Candidate profile:
- Background: ${profile.background}
- Education: ${profile.education}
- Skills: ${profile.topSkills.join(', ')}
- Projects: ${profile.projects.join(', ')}
- Working style: ${profile.workingStyle}
- Target role: ${profile.targetRole}

STAR Stories:
${profile.starStories.map((s) => `- ${s.title}: ${s.action} → ${s.result}`).join('\n') || 'None on file.'}`
}

export async function POST(req: Request) {
  const { profile, jobDescription, company, role } = await req.json()

  const systemPrompt = buildSystemPrompt(profile ?? null)
  const userPrompt = `Analyze fit for this role at ${company}: ${role}

Job Description:
${jobDescription}

Provide a structured analysis with exactly these sections (use markdown headers):

## Skill Match
List skills from the job description that the candidate has, with brief commentary.

## Keyword Gaps
Important keywords/skills from the JD that are missing from the candidate's profile. Prioritize by how frequently they appear and how critical they seem.

## Experience Fit
Honest assessment of how the candidate's background maps to the stated requirements. Be direct.

## Tailoring Points
3-5 specific bullet points the candidate should highlight in a tailored resume for this role.

## Cover Letter Hooks
2-3 talking points that connect the candidate's specific background to this role's needs.

## Suggested Action
One concrete next step the candidate should take before or when applying.`

  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-lite',
    systemInstruction: systemPrompt,
  })

  const result = await model.generateContentStream(userPrompt)

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

  return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
