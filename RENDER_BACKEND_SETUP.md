# Render Backend Integration Setup

## 🚀 Your Current Architecture

You have a **separate backend deployed on Render** with a comprehensive API, and a **Next.js frontend** that connects to it.

## 📝 Setup Steps

### 1. Update Environment Variables

Update your `.env.local` file:

```bash
# Your Render Backend URL
NEXT_PUBLIC_API_URL="https://bracketesports-backend.onrender.com/api"

# App URL (for production, use your Vercel URL)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Keep other variables as needed
NEXTAUTH_SECRET="your-secret-key-here"
JWT_SECRET="your-jwt-secret-here"
```

### 2. For Vercel Deployment

Add these environment variables in your Vercel dashboard:

```bash
NEXT_PUBLIC_API_URL=https://bracketesports-backend.onrender.com/api
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-production-secret
JWT_SECRET=your-production-jwt-secret
```

## 🔧 Current Integration

Your frontend already has:

✅ **API Client** (`src/lib/api-client.ts`) - Configured for external backend  
✅ **Authentication Context** - Uses backend JWT tokens  
✅ **Integration Guide** - Complete documentation in `FRONTEND_INTEGRATION_GUIDE.md`

## 🎯 Next Steps

1. **Find your Render backend URL** from your Render dashboard
2. **Update `.env.local`** with the correct URL
3. **Test the connection** by running `npm run dev`
4. **Deploy to Vercel** with updated environment variables

## 🐛 Troubleshooting

If you get CORS errors:

- Ensure your Render backend allows your frontend domain
- Check that your backend is running and accessible

If authentication fails:

- Verify JWT_SECRET matches between frontend and backend
- Check that your backend API endpoints are working

## 📍 Your Backend API

Based on your integration guide, your backend provides:

- **Authentication**: Register, Login, JWT tokens
- **Tournaments**: Create, join, manage tournaments
- **Gaming Accounts**: Link Riot accounts with verification
- **Teams**: Create and join teams
- **Creator Program**: Creator applications and management
- **Virtual Currency**: Coin purchases with Stripe
- **Real-time Updates**: Socket.io integration
- **News**: Esports news aggregation

All endpoints are documented in your `FRONTEND_INTEGRATION_GUIDE.md`!
