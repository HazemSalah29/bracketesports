# Subscription System Implementation Guide

## Database Schema Updates

### Add to schema.prisma:
```prisma
model Subscription {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id])
  plan      PlanType @default(FREE)
  status    SubStatus @default(ACTIVE)
  startDate DateTime @default(now())
  endDate   DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum PlanType {
  FREE
  PRO
  TEAM
  ENTERPRISE
}

enum SubStatus {
  ACTIVE
  CANCELLED
  EXPIRED
  PENDING
}
```

## API Routes to Create

### 1. /api/subscriptions/plans
- GET: List available plans with features
- POST: Create/upgrade subscription

### 2. /api/subscriptions/status
- GET: Check user's current subscription
- PUT: Update subscription status

### 3. /api/payments/stripe
- POST: Handle Stripe webhook events
- GET: Create payment session

## Frontend Components

### 1. Pricing Page (/pricing)
```tsx
const plans = [
  {
    name: 'Free',
    price: '$0',
    features: ['5 tournaments/month', 'Basic stats', 'Community access']
  },
  {
    name: 'Pro',
    price: '$9.99',
    features: ['Unlimited tournaments', 'Advanced analytics', 'Priority support']
  },
  // ... more plans
]
```

### 2. Subscription Management (/settings/billing)
- Current plan display
- Upgrade/downgrade options
- Payment history
- Cancel subscription

## Feature Gating

### Create middleware/subscription.ts:
```typescript
export function requireSubscription(minPlan: PlanType) {
  return async (req: NextRequest) => {
    const user = await getCurrentUser()
    if (!user || user.subscription.plan < minPlan) {
      return new Response('Subscription required', { status: 402 })
    }
  }
}
```

## Payment Integration

### Stripe Setup:
1. Create Stripe account
2. Add webhook endpoint
3. Set up subscription products
4. Implement payment flows

## Implementation Priority:
1. Database schema (Week 1)
2. Basic subscription API (Week 1)
3. Stripe integration (Week 2)
4. Frontend components (Week 2)
5. Feature gating (Week 3)
6. Testing & launch (Week 4)

This subscription system alone could generate $25K-75K monthly revenue with proper user acquisition.
