import { actionProviders, getDb } from '@/db'
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

function formatResponse(data: any = null, message: string, code: number = 0, status: number = 200) {
  return new Response(JSON.stringify({
    data: data || {},
    message,
    code,
  }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function GET() {
  const db = getDb()
  const results = await db.query.actionProviders.findMany()
  return formatResponse(results, 'Data retrieved successfully')
}

export async function POST(request: Request) {
  const db = getDb()
  const body = await request.json()

  const parseResult = postSchema.safeParse(body)
  if (!parseResult.success) {
    return formatResponse(parseResult.error.issues, 'Invalid request data', 1, 400)
  }

  const { label, homepage, icon, tag, link } = parseResult.data

  try {
    await db.insert(actionProviders).values({ label, homepage, icon, tag, link }).run()
    return formatResponse({ label, homepage, icon, tag, link }, 'Data inserted successfully')
  }
  catch {
    return formatResponse('An error occurred while trying to save your data. Please try again later.', 'Failed to insert data', 1, 500)
  }
}
