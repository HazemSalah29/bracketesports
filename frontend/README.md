# Bracket Esports

A comprehensive esports tournament management platform where players can sign up, connect their gaming accounts, join tournaments, and compete for points and rankings.

## 🎮 Features

- **Player Registration & Authentication**: Secure sign-up and login system with JWT
- **Game Account Integration**: Connect Steam, Riot Games, Epic Games, and other gaming platforms
- **Tournament Management**: Browse and join competitive tournaments (no entry fees)
- **Points & Ranking System**: Earn points and climb through skill-based ranks (Bronze to Champion)
- **Team System**: Create and join teams for collaborative competitions
- **Achievement System**: Unlock badges and showcase your accomplishments
- **Leaderboard & Statistics**: Track your gaming performance and points earned
- **Protected Routes**: Middleware-based route protection and authentication validation
- **Gaming Account Linking**: Required for tournament/team participation

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository

```bash
git clone https://github.com/HazemSalah29/bracketesports.git
cd bracketesports
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with initial data
npm run db:seed
```

5. Start the development server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## ✅ Implementation Status

### Completed Features
- ✅ **Authentication System**: Full signup/login/logout with JWT
- ✅ **Database Setup**: Prisma ORM with SQLite/PostgreSQL support
- ✅ **User Management**: Profile management and gaming account linking
- ✅ **Tournament System**: CRUD operations with points-based rewards
- ✅ **Team System**: Team creation, joining, and management
- ✅ **Ranking System**: Points-based ranking with Bronze to Champion tiers
- ✅ **Achievement System**: Unlockable achievements and badges
- ✅ **Leaderboard**: Global rankings and statistics
- ✅ **Validation System**: Auth validation hooks and route protection
- ✅ **UI/UX**: Complete frontend with gaming-themed design
- ✅ **Translation System**: Centralized text management
- ✅ **API Integration**: All pages connected to real backend data
- ✅ **Middleware**: Route protection and session management

### Future Enhancements
- 🔄 **Real-time Features**: Live tournament updates with WebSockets
- 🔄 **Advanced Analytics**: Detailed player and tournament analytics
- 🔄 **Mobile App**: React Native mobile application
- 🔄 **Social Features**: Friends, messaging, and social interactions
- 🔄 **Tournament Streaming**: Live stream integration
- 🔄 **Advanced Matchmaking**: Skill-based tournament matchmaking
# or
yarn dev
```

## 📁 Project Structure

```
bracketesports/
├── public/             # Static assets
├── prisma/            # Database schema and migrations
│   ├── schema.prisma  # Prisma database schema
│   ├── seed.ts        # Database seeding script
│   └── migrations/    # Database migrations
├── src/               # Source code
│   ├── app/           # Next.js app directory
│   │   ├── api/       # API routes (authentication, tournaments, etc.)
│   │   ├── auth/      # Authentication pages
│   │   ├── dashboard/ # Dashboard and main app pages
│   │   └── [pages]/   # Other app pages
│   ├── components/    # React components
│   │   ├── auth/      # Authentication components
│   │   ├── dashboard/ # Dashboard components
│   │   ├── layout/    # Layout components
│   │   └── sections/  # Page sections
│   ├── contexts/      # React contexts (AuthContext)
│   ├── hooks/         # Custom hooks (useAuthValidation)
│   ├── lib/           # Utility libraries (API client, Prisma, translations)
│   ├── types/         # TypeScript type definitions
│   ├── constants/     # Application constants and keys
│   └── locales/       # Translation files
├── middleware.ts      # Next.js middleware for route protection
└── BACKEND_SETUP.md   # Backend setup documentation
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development), PostgreSQL (production ready)
- **Authentication**: JWT with HTTP-only cookies
- **Validation**: Zod for API validation
- **Styling**: Tailwind CSS with custom gaming theme
- **State Management**: React Context API
- **Middleware**: Next.js middleware for route protection

## 🤝 Contributing

This is a **private repository** for a proprietary project.

**For authorized collaborators only:**

1. Contact the project owner for access permissions
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request for review

**External contributors:** Please contact hazem.salah29@gmail.com for licensing and collaboration opportunities.

## � License & Legal

This project is **proprietary software** owned by Hazem Salah. All rights reserved.

**⚠️ IMPORTANT NOTICE:**

- This code is **NOT open source**
- Unauthorized copying, distribution, or use is **strictly prohibited**
- Commercial use requires explicit written permission
- For licensing inquiries, contact: hazem.salah29@gmail.com

See the [LICENSE](LICENSE) file for complete terms and conditions.

## 📧 Contact

Hazem Salah - [@HazemSalah29](https://github.com/HazemSalah29) - hazem.salah29@gmail.com

Project Link: [https://github.com/HazemSalah29/bracketesports](https://github.com/HazemSalah29/bracketesports)

---

_© 2025 Hazem Salah. All rights reserved._
