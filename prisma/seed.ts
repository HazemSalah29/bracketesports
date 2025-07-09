import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create default ranks for the current season
  const currentSeason = '2025-S1'
  
  const ranks = [
    // Bronze
    { tier: 'bronze', division: 1, minPoints: 0, maxPoints: 499, season: currentSeason },
    { tier: 'bronze', division: 2, minPoints: 500, maxPoints: 999, season: currentSeason },
    { tier: 'bronze', division: 3, minPoints: 1000, maxPoints: 1499, season: currentSeason },
    // Silver
    { tier: 'silver', division: 1, minPoints: 1500, maxPoints: 1999, season: currentSeason },
    { tier: 'silver', division: 2, minPoints: 2000, maxPoints: 2499, season: currentSeason },
    { tier: 'silver', division: 3, minPoints: 2500, maxPoints: 2999, season: currentSeason },
    // Gold
    { tier: 'gold', division: 1, minPoints: 3000, maxPoints: 3499, season: currentSeason },
    { tier: 'gold', division: 2, minPoints: 3500, maxPoints: 3999, season: currentSeason },
    { tier: 'gold', division: 3, minPoints: 4000, maxPoints: 4499, season: currentSeason },
    // Platinum
    { tier: 'platinum', division: 1, minPoints: 4500, maxPoints: 4999, season: currentSeason },
    { tier: 'platinum', division: 2, minPoints: 5000, maxPoints: 5499, season: currentSeason },
    { tier: 'platinum', division: 3, minPoints: 5500, maxPoints: 5999, season: currentSeason },
    // Diamond
    { tier: 'diamond', division: 1, minPoints: 6000, maxPoints: 6999, season: currentSeason },
    { tier: 'diamond', division: 2, minPoints: 7000, maxPoints: 7999, season: currentSeason },
    { tier: 'diamond', division: 3, minPoints: 8000, maxPoints: 8999, season: currentSeason },
    // Master
    { tier: 'master', division: 1, minPoints: 9000, maxPoints: 9999, season: currentSeason },
    { tier: 'master', division: 2, minPoints: 10000, maxPoints: 10999, season: currentSeason },
    { tier: 'master', division: 3, minPoints: 11000, maxPoints: 11999, season: currentSeason },
    // Grandmaster
    { tier: 'grandmaster', division: 1, minPoints: 12000, maxPoints: 99999, season: currentSeason },
  ]

  // Create ranks
  for (const rank of ranks) {
    await prisma.rank.upsert({
      where: {
        tier_division_season: {
          tier: rank.tier,
          division: rank.division,
          season: rank.season,
        },
      },
      update: {},
      create: rank,
    })
  }

  // Create default achievements
  const achievements = [
    {
      name: 'First Victory',
      description: 'Win your first tournament',
      icon: '🏆',
      type: 'tournament',
      rarity: 'common',
      criteria: { tournamentsWon: 1 },
    },
    {
      name: 'Champion',
      description: 'Win 10 tournaments',
      icon: '👑',
      type: 'milestone',
      rarity: 'rare',
      criteria: { tournamentsWon: 10 },
    },
    {
      name: 'Elite Player',
      description: 'Reach Gold rank',
      icon: '🌟',
      type: 'milestone',
      rarity: 'epic',
      criteria: { rank: 'gold' },
    },
    {
      name: 'CS2 Master',
      description: 'Win 5 CS2 tournaments',
      icon: '🎯',
      type: 'tournament',
      rarity: 'legendary',
      criteria: { game: 'Counter-Strike 2', tournamentsWon: 5 },
    },
    {
      name: 'Valorant Ace',
      description: 'Win 5 Valorant tournaments',
      icon: '⚡',
      type: 'tournament',
      rarity: 'legendary',
      criteria: { game: 'Valorant', tournamentsWon: 5 },
    },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement,
    })
  }

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 12)
  const bronzeRank = await prisma.rank.findFirst({
    where: { tier: 'bronze', division: 1, season: currentSeason },
  })

  if (bronzeRank) {
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        username: 'TestPlayer',
        password: hashedPassword,
        currentRankId: bronzeRank.id,
        verified: true,
      },
    })

    console.log('✅ Created test user:', testUser.email)
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
