import { actionProviders, getDb } from '@/db'
import { formatResponse } from '@/utils/formatResponse'
import { z } from 'zod'

const postSchema = z.object({
  label: z.string(),
  homepage: z.string().url(),
  icon: z.string(),
  tag: z.string(),
  link: z.string().url().refine(link => link.includes('{selectedText}'), {
    message: 'Link must contain {selectedText}',
  }),
})

export async function GET() {
  const db = getDb()
  const results = await db.query.actionProviders.findMany()
  const response = formatResponse(results, 'Data retrieved successfully')
  return Response.json(response)
}

export async function POST(request: Request) {
  const db = getDb()
  const body = await request.json()

  const parseResult = postSchema.safeParse(body)
  if (!parseResult.success) {
    const response = formatResponse(parseResult.error.issues, 'Invalid request data', 1)
    return Response.json(response)
  }

  const { label, homepage, icon, tag, link } = parseResult.data

  try {
    const result = await db.insert(actionProviders).values({ label, homepage, icon, tag, link }).returning()
    const response = formatResponse(result, 'Data inserted successfully')
    return Response.json(response)
  }
  catch {
    const response = formatResponse({}, 'Failed to insert data', 1)
    return Response.json(response)
  }
}
