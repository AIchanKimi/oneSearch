import { getDb, initialProviders } from '@/db'
import { formatResponse } from '@/utils/formatResponse'
import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'

export async function GET(_request: Request) {
  const db = getDb()

  try {
    // 获取 enabled=1 的初始化 providers
    const initial = await db.query.initialProviders.findMany({
      where: (ip, { eq }) => eq(ip.enabled, 1),
    })
    const ids = initial.map(item => item.providerId)
    if (ids.length === 0) {
      return Response.json(formatResponse({ providers: [] }, 'Initialized provider list retrieved successfully'))
    }
    // 查询对应 actionProviders
    const results = await db.query.actionProviders.findMany({
      where: (ap, { inArray }) => inArray(ap.providerId, ids),
      orderBy: (ap, { desc }) => [
        desc(sql`${ap.usageCount} - ${ap.obsoleteCount}`),
      ],
    })

    // 对每个 providerId 触发 useapi（调用 use 接口，增加 usageCount）
    const origin = new URL(_request.url).origin
    await Promise.all(ids.map(async (providerId) => {
      try {
        // 直接调用 use API GET 端点（需绝对路径）
        const apiUrl = `${origin}/api/provider/${providerId}/use`
        await fetch(apiUrl)
      }
      catch (error) {
        console.error(error)
      }
    }))

    // 构造响应
    const response = formatResponse({ providers: results }, 'Initialized provider list retrieved successfully')
    return Response.json(response)
  }
  catch (error) {
    console.error('Error during search:', error)
    const response = formatResponse({}, 'Failed to retrieve search results', 1)
    return Response.json(response)
  }
}

const postSchema = z.object({
  providerId: z.number().int(),
  enabled: z.number().int().refine(v => v === 0 || v === 1, { message: 'enabled must be 0 or 1' }),
})

export async function POST(request: Request) {
  const db = getDb()
  const body = await request.json()
  const parseResult = postSchema.safeParse(body)
  if (!parseResult.success) {
    return Response.json(formatResponse(parseResult.error.issues, 'Invalid request data', 1))
  }
  const { providerId, enabled } = parseResult.data
  // 校验 providerId 是否存在于 actionProviders
  const providerExists = await db.query.actionProviders.findFirst({
    where: (ap, { eq }) => eq(ap.providerId, providerId),
  })
  if (!providerExists) {
    return Response.json(formatResponse({}, 'Provider not found', 1))
  }
  try {
    // 检查是否已存在
    const existing = await db.query.initialProviders.findFirst({
      where: (ip, { eq }) => eq(ip.providerId, providerId),
    })
    let result
    if (existing) {
      // 更新
      result = await db.update(initialProviders)
        .set({ enabled })
        .where(eq(initialProviders.providerId, providerId))
        .returning()
    }
    else {
      // 插入
      result = await db.insert(initialProviders)
        .values({ providerId, enabled })
        .returning()
    }
    return Response.json(formatResponse(result, 'Initialized provider status updated successfully'))
  }
  catch (error) {
    console.error('Error updating InitialProviders:', error)
    return Response.json(formatResponse({}, 'Failed to update InitialProviders', 1))
  }
}
