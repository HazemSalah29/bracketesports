// Coin package configuration
export const COIN_PACKAGES = [
  {
    id: 'basic',
    coins: 100,
    price: 10.00,
    bonus: 0,
    popular: false,
    description: 'Perfect for trying out creator tournaments'
  },
  {
    id: 'starter',
    coins: 500,
    price: 45.00,
    bonus: 50,
    popular: true,
    description: 'Great value with 10% bonus coins'
  },
  {
    id: 'premium',
    coins: 1000,
    price: 85.00,
    bonus: 150,
    popular: false,
    description: 'Most popular with 15% bonus coins'
  },
  {
    id: 'elite',
    coins: 2500,
    price: 200.00,
    bonus: 500,
    popular: false,
    description: 'Best value with 20% bonus coins'
  },
  {
    id: 'champion',
    coins: 5000,
    price: 375.00,
    bonus: 1250,
    popular: false,
    description: 'Ultimate package with 25% bonus coins'
  }
] as const

export type CoinPackage = typeof COIN_PACKAGES[number]

// Creator tier configuration
export const CREATOR_TIERS = {
  EMERGING: {
    name: 'Emerging Creator',
    minFollowers: 10000,
    maxFollowers: 50000,
    revenueShare: 60,
    maxTournamentSize: 32,
    customBranding: false,
    prioritySupport: false
  },
  RISING: {
    name: 'Rising Creator',
    minFollowers: 50000,
    maxFollowers: 250000,
    revenueShare: 65,
    maxTournamentSize: 64,
    customBranding: true,
    prioritySupport: false
  },
  PARTNER: {
    name: 'Partner Creator',
    minFollowers: 250000,
    maxFollowers: 1000000,
    revenueShare: 70,
    maxTournamentSize: 128,
    customBranding: true,
    prioritySupport: true
  },
  ELITE: {
    name: 'Elite Creator',
    minFollowers: 1000000,
    maxFollowers: Infinity,
    revenueShare: 75,
    maxTournamentSize: 256,
    customBranding: true,
    prioritySupport: true
  }
} as const

// Tournament entry fee examples by creator tier
export const TOURNAMENT_ENTRY_EXAMPLES = {
  EMERGING: [50, 100, 150], // $5, $10, $15
  RISING: [100, 200, 300],  // $10, $20, $30
  PARTNER: [200, 500, 750], // $20, $50, $75
  ELITE: [500, 1000, 1500]  // $50, $100, $150
} as const
