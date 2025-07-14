# BracketEsports - Local Development Setup

## Prerequisites
- Node.js 18+ 
- Docker (optional)

## Quick Start

### Option 1: Direct Node.js Development
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### Option 2: Docker Development
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run with Docker only
docker build -t bracketesports .
docker run -p 3000:3000 -v ${PWD}:/app bracketesports
```

## Environment Setup

1. Copy `.env.example` to `.env.local`
2. Fill in your environment variables:
   - Database connection strings
   - Riot API keys
   - JWT secrets
   - Stripe keys (for testing)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## Database Setup

If using local MongoDB:
1. Uncomment the MongoDB service in `docker-compose.yml`
2. Update your `.env.local` with local connection string
3. Run `npx prisma generate` and `npx prisma db push`

## Accessing the Application

- Frontend: http://localhost:3000
- API Routes: http://localhost:3000/api/*

## Development Notes

- Hot reload is enabled for both frontend and API routes
- TypeScript errors will show in terminal and browser
- Prisma Studio: `npx prisma studio` for database management
