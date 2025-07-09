import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { ApiResponse, generateToken, parseJsonBody, validateEmail, validatePassword } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await parseJsonBody<{
      email: string
      password: string
    }>(request)

    if (!body) {
      return ApiResponse.error('Invalid request body')
    }

    const { email, password } = body

    // Validation
    if (!email || !password) {
      return ApiResponse.error('Email and password are required')
    }

    if (!validateEmail(email)) {
      return ApiResponse.error('Invalid email format')
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        currentRank: true,
        gamingAccounts: true,
        achievements: {
          include: {
            achievement: true
          }
        }
      }
    })

    if (!user) {
      return ApiResponse.error('Invalid credentials', 401)
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return ApiResponse.error('Invalid credentials', 401)
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username
    })

    // Create session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt
      }
    })

    // Update last active
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() }
    })

    // Format response
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      verified: user.verified,
      rank: {
        tier: user.currentRank.tier,
        division: user.currentRank.division,
        points: user.rankPoints,
        pointsToNextRank: user.currentRank.maxPoints - user.rankPoints,
        season: user.currentRank.season
      },
      totalPoints: user.totalPoints,
      tournamentsWon: user.tournamentsWon,
      gamesPlayed: user.gamesPlayed,
      achievements: user.achievements.map((ua: any) => ({
        id: ua.achievement.id,
        name: ua.achievement.name,
        description: ua.achievement.description,
        icon: ua.achievement.icon,
        type: ua.achievement.type,
        rarity: ua.achievement.rarity,
        unlockedAt: ua.unlockedAt
      })),
      gamingAccounts: user.gamingAccounts.map((account: any) => ({
        id: account.id,
        platform: account.platform,
        username: account.username,
        verified: account.verified
      })),
      favoriteGames: [], // You can implement this later
      joinedAt: user.createdAt,
      lastActive: user.lastActive
    }

    return ApiResponse.success({
      user: userResponse,
      token,
      expiresAt
    }, 'Login successful')

  } catch (error) {
    console.error('Login error:', error)
    return ApiResponse.serverError('An error occurred during login')
  }
}
