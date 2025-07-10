import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Simple auth check - replace with your actual auth
async function getCurrentUser() {
  return await prisma.user.findFirst()
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's current coin balance and recent transactions
    const transactions = await prisma.bracketCoin.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        tournament: {
          select: {
            name: true,
            creator: {
              select: {
                handle: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      balance: user.coinBalance,
      transactions: transactions.map((tx: any) => ({
        id: tx.id,
        amount: tx.amount,
        type: tx.type,
        status: tx.status,
        description: tx.description,
        createdAt: tx.createdAt,
        tournament: tx.tournament ? {
          name: tx.tournament.name,
          creator: tx.tournament.creator?.handle
        } : null
      })),
      success: true
    })

  } catch (error) {
    console.error('Balance fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch balance' }, 
      { status: 500 }
    )
  }
}
