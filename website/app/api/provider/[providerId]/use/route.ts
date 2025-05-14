import { actionProviders, getDb } from '@/db'
import { formatResponse } from '@/utils/formatResponse'
import { sql } from 'drizzle-orm'
import { z } from 'zod'

const useSchema = z.object({
  providerId: z.string().regex(/^\d+$/), // 修改为字符串并验证为数字格式
})

export async function GET(request: Request, { params }: { params: Promise<{ providerId: string }> }) {
  const db = getDb()

  const resolvedParams = await params // 解开 Promise
  const parseResult = useSchema.safeParse({ providerId: resolvedParams.providerId })
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
