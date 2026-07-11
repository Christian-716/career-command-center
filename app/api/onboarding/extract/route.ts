import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)

const SYSTEM_PROMPT = `You are a data extractor. Based on the provided interview conversation, produce a structured JSON profile. Extract only what was explicitly stated by the user. Do not invent or infer information that was not provided.

For targetRole, map the user's answer to exactly one of: backend, fullstack, java-backend, new-grad-swe
For background, write a 2-3 sentence prose summary of who the user is and what they're looking for.
For projects, list project names only (short strings, not descriptions).
For topSkills, list individual skills (languages, frameworks, tools) as short strings.
Leave optional fields (email, salaryExpectation) as empty string if not mentioned.
Leave array fields as empty arrays if the topic wasn't discussed.`

const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    name: { type: SchemaType.STRING },
    email: { type: SchemaType.STRING },
    background: { type: SchemaType.STRING },
    education: { type: SchemaType.STRING },
    topSkills: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    projects: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    starStories: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          situation: { type: SchemaType.STRING },
          task: { type: SchemaType.STRING },
          action: { type: SchemaType.STRING },
          result: { type: SchemaType.STRING },
        },
        required: ['title', 'situation', 'task', 'action', 'result'],
      },
    },
    workingStyle: { type: SchemaType.STRING },
    coreValues: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    targetRole: { type: SchemaType.STRING },
    targetLocations: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    salaryExpectation: { type: SchemaType.STRING },
    dealbreakers: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
  },
  required: [
    'name', 'background', 'education', 'topSkills', 'projects',
    'starStories', 'workingStyle', 'coreValues', 'targetRole',
    'targetLocations', 'dealbreakers',
  ],
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  const conversationText = messages
    .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n\n')

  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-lite',
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema,
    },
  })

  const result = await model.generateContent(
    `Extract a structured profile from this interview conversation:\n\n${conversationText}`
  )

  const text = result.response.text()
  const profile = JSON.parse(text)

  const VALID_ROLES = ['backend', 'fullstack', 'java-backend', 'new-grad-swe']
  if (!VALID_ROLES.includes(profile.targetRole)) {
    profile.targetRole = 'new-grad-swe'
  }

  return Response.json(profile)
}
