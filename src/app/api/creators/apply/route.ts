import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Simple auth check - replace with your actual auth
async function getCurrentUser() {
  return await prisma.user.findFirst()
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user already has a creator application
    const existingCreator = await prisma.creator.findUnique({
      where: { userId: user.id }
    })

    if (existingCreator) {
      return NextResponse.json({ 
        error: 'Creator application already exists',
        status: existingCreator.status 
      }, { status: 400 })
    }

    const {
      handle,
      twitchUrl,
      youtubeUrl,
      tiktokUrl,
      discordUrl,
      followerCount
    } = await request.json()

    // Validate required fields
    if (!handle || !followerCount) {
      return NextResponse.json({ 
        error: 'Handle and follower count are required' 
      }, { status: 400 })
    }

    // Check minimum follower requirement
    if (followerCount < 10000) {
      return NextResponse.json({ 
        error: 'Minimum 10,000 followers required' 
      }, { status: 400 })
    }

    // Check if handle is already taken
    const existingHandle = await prisma.creator.findUnique({
      where: { handle }
    })

    if (existingHandle) {
      return NextResponse.json({ 
        error: 'Handle already taken' 
      }, { status: 400 })
    }

    // Determine tier based on follower count
    let tier: 'EMERGING' | 'RISING' | 'PARTNER' | 'ELITE' = 'EMERGING'
    if (followerCount >= 1000000) tier = 'ELITE'
    else if (followerCount >= 250000) tier = 'PARTNER'
    else if (followerCount >= 50000) tier = 'RISING'

    // Create creator application
    const creator = await prisma.creator.create({
      data: {
        userId: user.id,
        handle,
        tier,
        twitchUrl,
        youtubeUrl,
        tiktokUrl,
        discordUrl,
        followerCount,
        status: 'PENDING'
      }
    })

    return NextResponse.json({
      creator: {
        id: creator.id,
        handle: creator.handle,
        tier: creator.tier,
        status: creator.status,
        appliedAt: creator.appliedAt
      },
      success: true,
      message: 'Creator application submitted successfully. We will review it within 3-5 business days.'
    })

  } catch (error) {
    console.error('Creator application error:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' }, 
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const creator = await prisma.creator.findUnique({
      where: { userId: user.id },
      include: {
        tournaments: {
          select: {
            id: true,
            name: true,
            status: true,
            currentParticipants: true,
            maxParticipants: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        payouts: {
          select: {
            amount: true,
            status: true,
            period: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    if (!creator) {
      return NextResponse.json({ creator: null })
    }

    return NextResponse.json({
      creator: {
        id: creator.id,
        handle: creator.handle,
        tier: creator.tier,
        status: creator.status,
        followerCount: creator.followerCount,
        totalEarnings: creator.totalEarnings,
        revenueShare: creator.revenueShare,
        appliedAt: creator.appliedAt,
        verifiedAt: creator.verifiedAt,
        rejectedAt: creator.rejectedAt,
        rejectionReason: creator.rejectionReason,
        tournaments: creator.tournaments,
        payouts: creator.payouts
      },
      success: true
    })

  } catch (error) {
    console.error('Creator fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch creator data' }, 
      { status: 500 }
    )
  }
}
