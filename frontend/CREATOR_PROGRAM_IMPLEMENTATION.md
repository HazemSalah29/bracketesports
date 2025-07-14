# Content Creator Program - Technical Implementation Guide

## Database Schema Updates

### Add to schema.prisma:

```prisma
model Creator {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  
  // Creator Details
  handle      String   @unique
  tier        CreatorTier @default(EMERGING)
  status      CreatorStatus @default(PENDING)
  
  // Social Media
  twitchUrl   String?
  youtubeUrl  String?
  tiktokUrl   String?
  followerCount Int     @default(0)
  
  // Revenue & Analytics
  totalEarnings Decimal @default(0)
  revenueShare  Int     @default(60) // Percentage
  
  // Verification
  appliedAt   DateTime @default(now())
  verifiedAt  DateTime?
  
  // Relations
  tournaments Tournament[]
  payouts     CreatorPayout[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model BracketCoin {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  amount      Int      // Coin amount
  type        CoinTransactionType
  status      TransactionStatus @default(PENDING)
  
  // Purchase Details (for purchases)
  dollarAmount Decimal?
  paymentId   String?  // Stripe payment intent ID
  
  // Tournament Details (for spending)
  tournamentId String?
  tournament  Tournament? @relation(fields: [tournamentId], references: [id])
  
  // Metadata
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model CreatorPayout {
  id          String   @id @default(cuid())
  creatorId   String
  creator     Creator  @relation(fields: [creatorId], references: [id])
  
  amount      Decimal
  status      PayoutStatus @default(PENDING)
  period      String   // "2025-01", "2025-02" etc.
  
  // Payment Details
  paymentMethod String? // "stripe", "paypal"
  paymentId   String?
  paidAt      DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Update Tournament model
model Tournament {
  // ...existing fields...
  
  // Creator Tournament Fields
  creatorId     String?
  creator       Creator? @relation(fields: [creatorId], references: [id])
  entryFeeCoin  Int?     // Entry fee in Bracket Coins
  isCreatorTournament Boolean @default(false)
  
  // Prize Structure (Creator-Defined)
  prizeType     PrizeType @default(EXPERIENCE)
  prizeDescription String? // Creator's description of what winners get
  cashPrizePool Decimal? // Optional cash prize (creator's responsibility)
  coinPrizePool Int?     // Optional coin prize
  experiencePrize String? // Description of experience-based rewards
  
  // Relations
  coinTransactions BracketCoin[]
}

enum PrizeType {
  EXPERIENCE    // Coaching, content features, community access
  COINS         // Platform coins (redeemable)
  CASH          // Direct cash from creator
  MERCHANDISE   // Physical items
  HYBRID        // Combination of above
}

// Update User model to include coin balance
model User {
  // ...existing fields...
  
  coinBalance   Int @default(0)
  creator       Creator?
  coinTransactions BracketCoin[]
}

enum CreatorTier {
  EMERGING    // 10K-50K followers - 60% share
  RISING      // 50K-250K followers - 65% share
  PARTNER     // 250K-1M followers - 70% share
  ELITE       // 1M+ followers - 75% share
}

enum CreatorStatus {
  PENDING
  APPROVED
  REJECTED
  SUSPENDED
}

enum CoinTransactionType {
  PURCHASE
  TOURNAMENT_ENTRY
  TOURNAMENT_REFUND
  PRIZE_WINNING
  BONUS
  TRANSFER
}

enum TransactionStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum PayoutStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}
```

## API Routes Implementation

### 1. Creator Management Routes

#### `/api/creators/apply` (POST)
```typescript
// Submit creator application
export async function POST(request: NextRequest) {
  const data = await request.json()
  
  // Validate social media URLs and follower counts
  // Create pending creator application
  // Send verification email
  
  return NextResponse.json({ status: 'application_submitted' })
}
```

#### `/api/creators/verify` (POST)
```typescript
// Admin route to verify creators
export async function POST(request: NextRequest) {
  const { creatorId, status, tier } = await request.json()
  
  // Update creator status and tier
  // Send approval/rejection email
  // Grant dashboard access
  
  return NextResponse.json({ status: 'updated' })
}
```

#### `/api/creators/dashboard` (GET)
```typescript
// Creator dashboard data
export async function GET(request: NextRequest) {
  const creator = await getCurrentCreator()
  
  const data = {
    earnings: await getCreatorEarnings(creator.id),
    tournaments: await getCreatorTournaments(creator.id),
    analytics: await getCreatorAnalytics(creator.id),
    upcomingPayouts: await getUpcomingPayouts(creator.id)
  }
  
  return NextResponse.json(data)
}
```

### 2. Coin System Routes

#### `/api/coins/purchase` (POST)
```typescript
export async function POST(request: NextRequest) {
  const { coinPackage } = await request.json()
  
  // Create Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: coinPackage.price * 100, // Convert to cents
    currency: 'usd',
    metadata: {
      userId: user.id,
      coinAmount: coinPackage.coins
    }
  })
  
  // Create pending coin transaction
  await prisma.bracketCoin.create({
    data: {
      userId: user.id,
      amount: coinPackage.coins,
      type: 'PURCHASE',
      dollarAmount: coinPackage.price,
      paymentId: paymentIntent.id
    }
  })
  
  return NextResponse.json({ 
    clientSecret: paymentIntent.client_secret 
  })
}
```

#### `/api/coins/balance` (GET)
```typescript
export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  
  return NextResponse.json({ 
    balance: user.coinBalance,
    history: await getCoinHistory(user.id)
  })
}
```

#### `/api/webhooks/stripe` (POST)
```typescript
export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature')
  const event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object
    
    // Find coin transaction and complete it
    const coinTransaction = await prisma.bracketCoin.findFirst({
      where: { paymentId: paymentIntent.id }
    })
    
    // Update user balance and transaction status
    await prisma.user.update({
      where: { id: coinTransaction.userId },
      data: { coinBalance: { increment: coinTransaction.amount } }
    })
    
    await prisma.bracketCoin.update({
      where: { id: coinTransaction.id },
      data: { status: 'COMPLETED' }
    })
  }
  
  return NextResponse.json({ received: true })
}
```

### 3. Creator Tournament Routes

#### `/api/tournaments/creator/create` (POST)
```typescript
export async function POST(request: NextRequest) {
  const creator = await getCurrentCreator()
  const tournamentData = await request.json()
  
  // Validate creator permissions and tier limits
  const tournament = await prisma.tournament.create({
    data: {
      ...tournamentData,
      creatorId: creator.id,
      isCreatorTournament: true,
      entryFeeCoin: tournamentData.entryFee
    }
  })
  
  return NextResponse.json(tournament)
}
```

#### `/api/tournaments/[id]/join` (POST)
```typescript
export async function POST(request: NextRequest) {
  const { id } = context.params
  const user = await getCurrentUser()
  
  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: { creator: true }
  })
  
  // Check if user has enough coins
  if (user.coinBalance < tournament.entryFeeCoin) {
    return NextResponse.json({ error: 'Insufficient coins' }, { status: 400 })
  }
  
  // Deduct coins from user (entry fee goes to creator's earnings)
  await prisma.user.update({
    where: { id: user.id },
    data: { coinBalance: { decrement: tournament.entryFeeCoin } }
  })
  
  // Create coin transaction for entry fee
  await prisma.bracketCoin.create({
    data: {
      userId: user.id,
      amount: -tournament.entryFeeCoin,
      type: 'TOURNAMENT_ENTRY',
      tournamentId: tournament.id,
      description: `Entry fee for ${tournament.creator.handle}'s tournament`
    }
  })
  
  // Add to creator's earnings (70% of entry fee, platform keeps 30%)
  const creatorEarnings = Math.floor(tournament.entryFeeCoin * 0.7)
  await prisma.creator.update({
    where: { id: tournament.creatorId },
    data: { totalEarnings: { increment: creatorEarnings } }
  })
  
  // Add user to tournament
  await addUserToTournament(user.id, tournament.id)
  
  return NextResponse.json({ 
    status: 'joined',
    message: `You're now playing in ${tournament.creator.handle}'s tournament!`
  })
}
```

## Frontend Components

### 1. Creator Application Form
```tsx
// /app/creators/apply/page.tsx
export default function CreatorApplicationPage() {
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <SocialMediaInputs />
        <ContentPortfolio />
        <AudienceMetrics />
        <ApplicationTerms />
        <SubmitButton />
      </div>
    </form>
  )
}
```

### 2. Coin Purchase Interface
```tsx
// /components/coins/CoinPurchase.tsx
const coinPackages = [
  { coins: 100, price: 10, bonus: 0 },
  { coins: 500, price: 45, bonus: 50 },
  { coins: 1000, price: 85, bonus: 150 },
  // ...
]

export default function CoinPurchase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {coinPackages.map(pkg => (
        <CoinPackageCard key={pkg.coins} package={pkg} />
      ))}
    </div>
  )
}
```

### 3. Creator Dashboard
```tsx
// /app/creator/dashboard/page.tsx
export default function CreatorDashboard() {
  return (
    <div className="space-y-8">
      <EarningsOverview />
      <TournamentManagement />
      <AudienceAnalytics />
      <PayoutHistory />
    </div>
  )
}
```

### 4. Creator Tournament Creation
```tsx
// /app/creator/tournaments/create/page.tsx
export default function CreateCreatorTournament() {
  return (
    <div className="max-w-4xl mx-auto">
      <TournamentBasicInfo />
      <EntryFeeSelector />
      <PrizePoolSettings />
      <BrandingCustomization />
      <TournamentRules />
      <PublishSettings />
    </div>
  )
}
```

## Implementation Timeline

### Week 1-2: Database & Core API
- Database schema implementation
- Basic coin purchase system
- Stripe integration and webhooks
- Creator application API

### Week 3-4: Creator Features
- Creator dashboard
- Tournament creation for creators
- Revenue tracking and analytics
- Payout system

### Week 5-6: Frontend & UX
- Coin purchase interface
- Creator application form
- Tournament discovery for fans
- Mobile responsiveness

### Week 7-8: Testing & Launch
- End-to-end testing
- Payment processing testing
- Creator onboarding flow
- Soft launch with select creators

## Security & Compliance

### Payment Security
- PCI compliance through Stripe
- Secure webhook handling
- Transaction logging and auditing
- Fraud detection and prevention

### Creator Verification
- Social media API verification
- Manual content review process
- Ongoing monitoring for violations
- Appeal and reinstatement process

### Coin System Security
- Transaction atomicity
- Balance verification
- Duplicate transaction prevention
- Audit trail for all coin movements

This implementation creates a robust creator economy that can scale to thousands of creators and millions of transactions while maintaining security and user experience.
