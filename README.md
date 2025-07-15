# BracketEsports

A premium esports tournament platform built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Tournament Management**: Create and join competitive esports tournaments
- **Multi-Game Support**: League of Legends, Valorant, and more
- **Creator Economy**: Content creators can monetize through exclusive tournaments
- **Real-time Analytics**: Track performance and rankings
- **Modern UI**: Beautiful, responsive design with gaming aesthetics

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand
- **Authentication**: JWT with bcrypt
- **Payments**: Stripe integration

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/HazemSalah29/bracketesports.git
cd bracketesports
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Fill in your environment variables in `.env.local`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Manual Deployment

```bash
npm run build
npm run start
```

## 🔧 Environment Variables

Required environment variables for production:

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXTAUTH_SECRET=your-nextauth-secret
JWT_SECRET=your-jwt-secret
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is private and proprietary.

## 📧 Support

For support, email [your-email@domain.com]

---

Built with ❤️ for the gaming community