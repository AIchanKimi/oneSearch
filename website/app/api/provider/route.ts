import { actionProviders, getDb } from '@/db'
import { formatResponse } from '@/utils/formatResponse'
import { sql } from 'drizzle-orm'
import { z } from 'zod'

// 定义 zod 模式
const querySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
  pageSize: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
})

export async function GET(request: Request) {
  const db = getDb()

  // 解析和验证查询参数
  const url = new URL(request.url)
  const parseResult = querySchema.safeParse(Object.fromEntries(url.searchParams))
  if (!parseResult.success) {
    const response = formatResponse(parseResult.error.issues, 'Invalid query parameters', 1)
    return Response.json(response)
  }

  const { page, pageSize } = parseResult.data

  try {
    // 计算偏移量
    const offset = (page - 1) * pageSize

    // 添加排序逻辑
    const results = await db.query.actionProviders.findMany({
      limit: pageSize,
      offset,
      orderBy: (actionProviders, { desc }) => [desc(sql`${actionProviders.usageCount} - ${actionProviders.obsoleteCount}`)],
    })

    // 构造响应
    const response = formatResponse({
      providers: results,
      hasMore: results.length === pageSize,
    }, 'Data retrieved successfully')

    return Response.json(response)
  }
  catch (error) {
    console.error('Error during data retrieval:', error)
    const response = formatResponse({}, 'Failed to retrieve data', 1)
    return Response.json(response)
  }
}

const postSchema = z.object({
  label: z.string(),
  homepage: z.string().url(),
  icon: z.string(),
  tag: z.string(),
  link: z.string().url().refine(link => link.includes('{selectedText}'), {
    message: 'Link must contain {selectedText}',
  }),
})

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
