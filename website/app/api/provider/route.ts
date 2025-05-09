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

const getSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
  pageSize: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
})

export async function GET(request: Request) {
  const db = getDb()

  // 验证分页参数
  const url = new URL(request.url)
  const parseResult = getSchema.safeParse(Object.fromEntries(url.searchParams))
  if (!parseResult.success) {
    const response = formatResponse(parseResult.error.issues, 'Invalid query parameters', 1)
    return Response.json(response)
  }

  const { page, pageSize } = parseResult.data

  // 确保分页参数有效
  const validPage = Math.max(page, 1)
  const validPageSize = Math.max(pageSize, 1)

  // 计算偏移量
  const offset = (validPage - 1) * validPageSize

  // 查询总记录数
  const totalCountResult = await db.query.actionProviders.findMany({
    columns: { providerId: true },
  })
  const totalCount = totalCountResult.length

  // 查询分页数据
  const results = await db.query.actionProviders.findMany({
    limit: validPageSize,
    offset,
  })

  // 构造响应
  const response = formatResponse({
    providers: results,
    total: totalCount,
    page: validPage,
    pageSize: validPageSize,
  }, 'Data retrieved successfully')

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
