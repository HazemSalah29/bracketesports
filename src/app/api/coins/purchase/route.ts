import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { COIN_PACKAGES } from '@/constants/creator-program'

// Initialize Stripe conditionally
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not configured')
  }
  
  const Stripe = require('stripe')
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-06-30.basil'
  })
}

// Simple auth check - you can replace this with your auth system
async function getCurrentUser() {
  // For now, return a mock user - replace with your actual auth
  return await prisma.user.findFirst()
}

export async function GET() {
  // Return available coin packages
  return NextResponse.json({
    packages: COIN_PACKAGES,
    success: true
  })
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ 
        error: 'Payment processing is not configured' 
      }, { status: 500 })
    }

    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { packageId } = await request.json()
    
    const coinPackage = COIN_PACKAGES.find(pkg => pkg.id === packageId)
    if (!coinPackage) {
      return NextResponse.json({ error: 'Invalid package' }, { status: 400 })
    }

    // Get Stripe instance
    const stripe = getStripe()

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(coinPackage.price * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: user.id,
        packageId: coinPackage.id,
        coinAmount: (coinPackage.coins + coinPackage.bonus).toString(),
        description: `${coinPackage.coins + coinPackage.bonus} Bracket Coins`
      }
    })

    // Create pending coin transaction
    await prisma.bracketCoin.create({
      data: {
        userId: user.id,
        amount: coinPackage.coins + coinPackage.bonus,
        type: 'PURCHASE',
        dollarAmount: coinPackage.price,
        paymentId: paymentIntent.id,
        description: `Purchase of ${coinPackage.coins + coinPackage.bonus} coins`,
        status: 'PENDING'
      }
    })

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      success: true
    })

  } catch (error) {
    console.error('Coin purchase error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' }, 
      { status: 500 }
    )
  }
}
