import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Mock authentication - replace with real auth
async function getCurrentUser() {
  return {
    id: 'user_123',
    creator: {
      id: 'creator_123',
      tier: 'PARTNER',
      status: 'APPROVED',
      revenueShare: 70
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user?.creator || user.creator.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Unauthorized: Creator approval required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      game,
      entryFeeCoin,
      maxParticipants,
      startDate,
      prizeType,
      prizeDescription,
      cashPrizePool,
      coinPrizePool,
      experiencePrize
    } = body

    // Validate required fields
    if (!name || !description || !game || !entryFeeCoin || !maxParticipants || !startDate || !prizeType || !prizeDescription) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate registration deadline (24 hours before start)
    const tournamentStart = new Date(startDate)
    const registrationDeadline = new Date(tournamentStart.getTime() - 24 * 60 * 60 * 1000)

    // Create tournament
    const tournament = await prisma.tournament.create({
      data: {
        name,
        description,
        game,
        entryFeeCoin,
        maxParticipants,
        startDate: tournamentStart,
        endDate: new Date(tournamentStart.getTime() + 3 * 60 * 60 * 1000), // 3 hours duration
        registrationDeadline,
        isCreatorTournament: true,
        creatorId: user.creator.id,
        prizeType,
        prizeDescription,
        cashPrizePool,
        coinPrizePool,
        experiencePrize,
        pointsReward: 100, // Default points
        tournamentType: 'solo',
        teamSize: game === 'VALORANT' ? 5 : game === 'LEAGUE_OF_LEGENDS' ? 5 : 1
      }
    })

    return NextResponse.json({
      success: true,
      tournament: {
        id: tournament.id,
        name: tournament.name,
        entryFeeCoin: tournament.entryFeeCoin,
        maxParticipants: tournament.maxParticipants,
        startDate: tournament.startDate,
        prizeType: tournament.prizeType,
        prizeDescription: tournament.prizeDescription
      }
    })

  } catch (error) {
    console.error('Error creating tournament:', error)
    return NextResponse.json(
      { error: 'Failed to create tournament' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user?.creator) {
      return NextResponse.json(
        { error: 'Unauthorized: Creator status required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // Build where clause
    const where: any = {
      creatorId: user.creator.id,
      isCreatorTournament: true
    }

    if (status) {
      where.status = status
    }

    const tournaments = await prisma.tournament.findMany({
      where,
      include: {
        _count: {
          select: {
            participants: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate earnings for each tournament (mock calculation)
    const tournamentsWithEarnings = tournaments.map((tournament: any) => {
      const participantCount = tournament._count.participants
      const totalRevenue = participantCount * tournament.entryFeeCoin! / 10 // Convert coins to dollars
      const creatorEarnings = totalRevenue * (user.creator.revenueShare / 100)
      
      return {
        id: tournament.id,
        name: tournament.name,
        entryFeeCoin: tournament.entryFeeCoin,
        participants: participantCount,
        maxParticipants: tournament.maxParticipants,
        status: tournament.status,
        startDate: tournament.startDate,
        earnings: creatorEarnings,
        prizeType: tournament.prizeType,
        prizeDescription: tournament.prizeDescription
      }
    })

    return NextResponse.json({
      success: true,
      tournaments: tournamentsWithEarnings
    })

  } catch (error) {
    console.error('Error fetching creator tournaments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tournaments' },
      { status: 500 }
    )
  }
}
