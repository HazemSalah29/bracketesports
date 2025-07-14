# Backend Setup Guide

This guide will help you set up the backend for your esports tournament platform. The platform uses a points-based competitive system where players earn points and climb rankings instead of monetary prizes.

## ✅ Completed Features

### Authentication System
- ✅ JWT-based authentication with secure login/register
- ✅ Protected routes with middleware
- ✅ Session management with token storage
- ✅ User profile management

### Points & Ranking System  
- ✅ Points-based tournament rewards (no money/entry fees)
- ✅ Skill-based ranking system (Bronze → Silver → Gold → Platinum → Diamond → Master)
- ✅ Achievement system with badges
- ✅ Leaderboard with point tracking

### Tournament Management
- ✅ Tournament creation and management
- ✅ Registration system (free entry)
- ✅ Points reward distribution
- ✅ Team and solo tournament support

### User Interface
- ✅ Authentication-aware navigation
- ✅ Protected dashboard requiring login
- ✅ User profile display in header
- ✅ Centralized translation system
- ✅ Points-focused UI (removed all money references)

### Backend Architecture
- ✅ Prisma database with SQLite/PostgreSQL support
- ✅ RESTful API routes for all features
- ✅ Type-safe API client
- ✅ Error handling and validation

## 1. Database Setup

### Option A: PostgreSQL (Recommended)

1. **Install PostgreSQL:**
   - Download from https://www.postgresql.org/download/
   - Create a database named `bracketesports`

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Update `.env` with your database URL:**
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/bracketesports"
   JWT_SECRET="your-super-secret-jwt-key-here"
   NEXTAUTH_SECRET="your-nextauth-secret"
   ```

### Option B: SQLite (For Development)

Update `.env`:
```bash
DATABASE_URL="file:./dev.db"
```

## 2. Database Migration

Run the following commands to set up your database:

```bash
# Generate Prisma client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init

# Seed the database (optional)
npx prisma db seed
```

## 3. Backend Implementation Steps

### Phase 1: Authentication System
1. Create authentication API routes (`/api/auth/`)
2. Implement JWT token handling
3. Add middleware for protected routes
4. Update client to use real authentication

### Phase 2: User Management
1. Create user profile API routes (`/api/users/`)
2. Implement profile updates
3. Add gaming account linking
4. Replace mock user data in components

### Phase 3: Tournament System
1. Complete tournament API routes (`/api/tournaments/`)
2. Add tournament creation/joining logic
3. Implement tournament status management
4. Replace mock tournament data

### Phase 4: Team System
1. Create team API routes (`/api/teams/`)
2. Implement team creation/joining
3. Add team management features
4. Replace mock team data

### Phase 5: Leaderboard & Analytics
1. Create leaderboard API routes (`/api/leaderboard/`)
2. Implement ranking calculations
3. Add analytics endpoints
4. Create real-time updates

## 4. File Structure

Your backend files are organized as follows:

```
src/
├── constants/
│   └── keys.ts                 # Text keys and API endpoints
├── locales/
│   └── en.ts                   # English translations
├── lib/
│   ├── translations.ts         # Translation utilities
│   ├── api-utils.ts           # API response utilities
│   ├── api-client.ts          # Client-side API service
│   └── prisma.ts              # Database client
├── types/
│   └── api.ts                 # TypeScript API types
└── app/
    └── api/
        ├── auth/              # Authentication routes
        ├── users/             # User management routes
        ├── tournaments/       # Tournament routes
        ├── teams/             # Team routes
        ├── leaderboard/       # Leaderboard routes
        └── analytics/         # Analytics routes

prisma/
└── schema.prisma              # Database schema
```

## 5. Using the Translation System

Instead of hardcoded strings, use the translation system:

```tsx
import { useTranslation } from '@/lib/translations'
import { KEYS } from '@/constants/keys'

function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('nav.tournaments')}</h1>
      <button>{t('actions.create')}</button>
    </div>
  )
}
```

## 6. Using the API Client

Replace static data with API calls:

```tsx
import { apiClient } from '@/lib/api-client'
import { useEffect, useState } from 'react'

function TournamentList() {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTournaments() {
      try {
        const data = await apiClient.getTournaments()
        setTournaments(data.data)
      } catch (error) {
        console.error('Failed to load tournaments:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTournaments()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {tournaments.map(tournament => (
        <div key={tournament.id}>{tournament.name}</div>
      ))}
    </div>
  )
}
```

## 7. Next Steps

1. **Start with Authentication:**
   - Create `/api/auth/login` and `/api/auth/register` routes
   - Update the login/register pages to use real API calls

2. **Replace Dashboard Data:**
   - Update dashboard to fetch real user data
   - Replace mock tournaments with API calls

3. **Implement Tournament Creation:**
   - Connect the tournament creation form to the API
   - Add validation and error handling

4. **Add Real-time Updates:**
   - Consider using WebSockets or Server-Sent Events
   - Update tournament participant counts in real-time

## 8. Database Schema Features

The Prisma schema includes:

- **Users:** Profile, ranking, points, achievements
- **Teams:** Team management, members, roles
- **Tournaments:** Full tournament lifecycle
- **Rank System:** Tier-based ranking with seasons
- **Gaming Accounts:** Platform account linking
- **Achievements:** Badge and milestone system
- **Notifications:** User notifications

## 9. Environment Variables

Required environment variables:

```bash
# Database
DATABASE_URL=

# Authentication
JWT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Optional: External APIs
STEAM_API_KEY=
RIOT_API_KEY=

# Optional: File uploads
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Optional: Caching
REDIS_URL=
```

## 10. Development Workflow

1. **Make schema changes in `prisma/schema.prisma`**
2. **Run `npx prisma db push` to update the database**
3. **Run `npx prisma generate` to update the client**
4. **Update API routes to handle new data**
5. **Update frontend components to use new API**
6. **Test thoroughly before deploying**

This foundation provides type safety, proper error handling, authentication, and a scalable architecture for your esports platform.
