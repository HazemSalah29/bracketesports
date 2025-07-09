import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Response utilities
export class ApiResponse {
  static success<T>(data: T, message: string = 'Success') {
    return NextResponse.json({
      success: true,
      message,
      data,
    })
  }

  static error(message: string, statusCode: number = 400, errors?: any) {
    return NextResponse.json({
      success: false,
      message,
      errors,
    }, { status: statusCode })
  }

  static notFound(message: string = 'Resource not found') {
    return this.error(message, 404)
  }

  static unauthorized(message: string = 'Unauthorized') {
    return this.error(message, 401)
  }

  static forbidden(message: string = 'Forbidden') {
    return this.error(message, 403)
  }

  static serverError(message: string = 'Internal server error') {
    return this.error(message, 500)
  }
}

// Authentication utilities
export interface AuthUser {
  id: string
  email: string
  username: string
}

export async function authenticate(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    // Handle both token formats - from login API and from generateToken
    if (decoded.user) {
      return decoded.user
    } else if (decoded.userId) {
      return {
        id: decoded.userId,
        email: decoded.email,
        username: decoded.username || ''
      }
    }
    
    return null
  } catch {
    return null
  }
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { user },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )
}

// Validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateUsername(username: string): boolean {
  // Username should be 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

export function validatePassword(password: string): boolean {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

// Pagination utilities
export interface PaginationOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export function parsePaginationParams(searchParams: URLSearchParams): PaginationOptions {
  return {
    page: Math.max(1, parseInt(searchParams.get('page') || '1')),
    limit: Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10'))),
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  options: PaginationOptions
): PaginatedResponse<T> {
  const { page = 1, limit = 10 } = options
  const totalPages = Math.ceil(total / limit)

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

// Error handling
export function handleApiError(error: any, operation: string) {
  console.error(`Error in ${operation}:`, error)
  
  if (error.code === 'P2002') {
    return ApiResponse.error('Resource already exists', 409)
  }
  
  if (error.code === 'P2025') {
    return ApiResponse.notFound('Resource not found')
  }
  
  return ApiResponse.serverError('An unexpected error occurred')
}

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(identifier: string, maxRequests: number = 100, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const windowStart = now - windowMs
  
  const current = rateLimitMap.get(identifier)
  
  if (!current || current.resetTime < windowStart) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (current.count >= maxRequests) {
    return false
  }
  
  current.count++
  return true
}

// Request body parsing with validation
export async function parseJsonBody<T>(request: NextRequest): Promise<T | null> {
  try {
    const body = await request.json()
    return body as T
  } catch {
    return null
  }
}
