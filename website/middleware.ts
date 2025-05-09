import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function middleware(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    const preflightHeaders = {
      'Access-Control-Allow-Origin': '*',
      ...corsOptions,
    }
    return NextResponse.json({}, { headers: preflightHeaders })
  }

  const response = NextResponse.next()
  response.headers.set('Access-Control-Allow-Origin', '*')
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: '/api/:path*',
}
