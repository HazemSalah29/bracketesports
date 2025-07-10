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

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user?.creator || user.creator.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Unauthorized: Creator approval required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // month, week, all

    // Get current date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get tournaments for analytics
    const allTournaments = await prisma.tournament.findMany({
      where: {
        creatorId: user.creator.id,
        isCreatorTournament: true
      },
      include: {
        _count: {
          select: {
            participants: true
          }
        }
      }
    })

    // Get this month's tournaments
    const thisMonthTournaments = await prisma.tournament.findMany({
      where: {
        creatorId: user.creator.id,
        isCreatorTournament: true,
        createdAt: {
          gte: startOfMonth
        }
      },
      include: {
        _count: {
          select: {
            participants: true
          }
        }
      }
    })

    // Get last month's tournaments
    const lastMonthTournaments = await prisma.tournament.findMany({
      where: {
        creatorId: user.creator.id,
        isCreatorTournament: true,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth
        }
      },
      include: {
        _count: {
          select: {
            participants: true
          }
        }
      }
    })

    // Calculate earnings (mock calculation)
    const calculateEarnings = (tournaments: any[]) => {
      return tournaments.reduce((total, tournament) => {
        const participantCount = tournament._count.participants
        const totalRevenue = participantCount * (tournament.entryFeeCoin || 0) / 10 // Convert coins to dollars
        const creatorEarnings = totalRevenue * (user.creator.revenueShare / 100)
        return total + creatorEarnings
      }, 0)
    }

    const thisMonthEarnings = calculateEarnings(thisMonthTournaments)
    const lastMonthEarnings = calculateEarnings(lastMonthTournaments)
    const totalEarnings = calculateEarnings(allTournaments)

    // Calculate total participants
    const totalParticipants = allTournaments.reduce((total: number, tournament: any) => {
      return total + tournament._count.participants
    }, 0)

    // Count active tournaments (registering or live)
    const activeTournaments = allTournaments.filter(
      (tournament: any) => tournament.status === 'registering' || tournament.status === 'live'
    ).length

    // Get recent transactions (mock data for now)
    const recentTransactions = [
      {
        id: '1',
        type: 'tournament_earnings',
        amount: 156.80,
        description: 'Saturday Night Valorant Tournament',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'completed'
      },
      {
        id: '2',
        type: 'tournament_earnings',
        amount: 224.00,
        description: 'League Coaching Bootcamp',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'completed'
      },
      {
        id: '3',
        type: 'payout',
        amount: -850.25,
        description: 'Weekly payout to bank account',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'completed'
      }
    ]

    // Monthly breakdown (last 6 months)
    const monthlyBreakdown = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const monthTournaments = allTournaments.filter((tournament: any) => 
        tournament.createdAt >= monthStart && tournament.createdAt <= monthEnd
      )
      
      const monthEarnings = calculateEarnings(monthTournaments)
      const monthParticipants = monthTournaments.reduce((total: number, tournament: any) => 
        total + tournament._count.participants, 0
      )
      
      monthlyBreakdown.push({
        month: monthStart.toISOString().slice(0, 7), // YYYY-MM format
        earnings: monthEarnings,
        participants: monthParticipants,
        tournaments: monthTournaments.length
      })
    }

    return NextResponse.json({
      success: true,
      analytics: {
        thisMonth: {
          earnings: thisMonthEarnings,
          tournaments: thisMonthTournaments.length,
          participants: thisMonthTournaments.reduce((total: number, tournament: any) => 
            total + tournament._count.participants, 0
          )
        },
        lastMonth: {
          earnings: lastMonthEarnings,
          tournaments: lastMonthTournaments.length,
          participants: lastMonthTournaments.reduce((total: number, tournament: any) => 
            total + tournament._count.participants, 0
          )
        },
        total: {
          earnings: totalEarnings,
          tournaments: allTournaments.length,
          participants: totalParticipants
        },
        activeTournaments,
        recentTransactions,
        monthlyBreakdown,
        revenueShare: user.creator.revenueShare
      }
    })

  } catch (error) {
    console.error('Error fetching creator analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
