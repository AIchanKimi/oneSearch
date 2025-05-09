import { actionProviders, getDb } from '@/db'
import { formatResponse } from '@/utils/formatResponse'
import { sql } from 'drizzle-orm'
import { z } from 'zod'

const incrementSchema = z.object({
  providerId: z.number().int().positive(),
})

export async function POST(request: Request) {
  const db = getDb()
  const body = await request.json()

  const parseResult = incrementSchema.safeParse(body)
  if (!parseResult.success) {
    const response = formatResponse(parseResult.error.issues, 'Invalid request data', 1)
    return Response.json(response)
  }

  const { providerId } = parseResult.data

  try {
    const result = await db
      .update(actionProviders)
      .set({ usageCount: sql`usageCount + 1` })
      .where(sql`providerId = ${providerId}`)
      .returning()

    if (result.length === 0) {
      const response = formatResponse({}, 'Provider not found', 1)
      return Response.json(response)
    }

    const response = formatResponse(result, 'Usage count incremented successfully')
    return Response.json(response)
  }
  catch {
    const response = formatResponse({}, 'Failed to increment usage count', 1)
    return Response.json(response)
  }
}
