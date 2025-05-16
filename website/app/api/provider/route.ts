import { actionProviders, getDb } from '@/db'
import { formatResponse } from '@/utils/formatResponse'
import { sql } from 'drizzle-orm'
import { z } from 'zod'

// 定义 zod 模式
const querySchema = z.object({
  keyword: z.string().optional().default(''),
  page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
  pageSize: z.string().regex(/^\d+$/).transform(Number).optional().default('5'),
  tag: z.string().optional(), // 新增 tag 参数
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

  const { keyword, page, pageSize, tag } = parseResult.data

  try {
    // 计算偏移量
    const offset = (page - 1) * pageSize

    // 使用 Drizzle ORM 的结构化查询格式构建模糊查询
    const results = await db.query.actionProviders.findMany({
      where: (actionProviders, { or, like, eq, and }) => {
        const keywordCondition = or(
          like(actionProviders.label, `%${keyword}%`),
          like(actionProviders.homepage, `%${keyword}%`),
        )
        const tagCondition = tag ? eq(actionProviders.tag, tag) : undefined
        return tagCondition ? and(keywordCondition, tagCondition) : keywordCondition
      },
      limit: pageSize,
      offset,
      orderBy: (actionProviders, { desc }) => [desc(sql`${actionProviders.usageCount} - ${actionProviders.obsoleteCount}`)],
    })

    // 构造响应
    const response = formatResponse({
      providers: results,
      hasMore: results.length === pageSize,
    }, 'Search results retrieved successfully')

    return Response.json(response)
  }
  catch (error) {
    console.error('Error during search:', error)
    const response = formatResponse({}, 'Failed to retrieve search results', 1)
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
    const response = formatResponse(result[0], 'Data inserted successfully')
    return Response.json(response)
  }
  catch {
    const response = formatResponse({}, 'Failed to insert data', 1)
    return Response.json(response)
  }
}
