import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentSuccess(paymentIntent)
        break
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailure(failedPayment)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const paymentId = paymentIntent.id
  
  // Find the pending coin transaction
  const coinTransaction = await prisma.bracketCoin.findFirst({
    where: { 
      paymentId,
      status: 'PENDING'
    }
  })

  if (!coinTransaction) {
    console.error('No pending transaction found for payment:', paymentId)
    return
  }

  // Update user balance and transaction status in a transaction
  await prisma.$transaction(async (tx: any) => {
    // Update user coin balance
    await tx.user.update({
      where: { id: coinTransaction.userId },
      data: { 
        coinBalance: { 
          increment: coinTransaction.amount 
        } 
      }
    })

    // Mark transaction as completed
    await tx.bracketCoin.update({
      where: { id: coinTransaction.id },
      data: { status: 'COMPLETED' }
    })
  })

  console.log(`Payment succeeded: ${coinTransaction.amount} coins added to user ${coinTransaction.userId}`)
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const paymentId = paymentIntent.id
  
  // Find the pending coin transaction and mark as failed
  await prisma.bracketCoin.updateMany({
    where: { 
      paymentId,
      status: 'PENDING'
    },
    data: { status: 'FAILED' }
  })

  console.log(`Payment failed for payment intent: ${paymentId}`)
}
