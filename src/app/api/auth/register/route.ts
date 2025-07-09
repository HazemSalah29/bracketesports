import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { ApiResponse, handleApiError, parseJsonBody } from '@/lib/api-utils';

const registerSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6),
  platform: z.string().optional(),
  platformId: z.string().optional(),
  platformUsername: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    console.log('Registration attempt started');
    
    const body = await parseJsonBody<z.infer<typeof registerSchema>>(request);
    // Do not log the body as it contains sensitive information like passwords
    
    if (!body) {
      console.log('Invalid request body');
      return ApiResponse.error('Invalid request body', 400);
    }

    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      console.log('Validation failed:', validation.error.errors);
      return ApiResponse.error('Validation failed', 400, validation.error.errors);
    }

    const { username, email, password, platform, platformId, platformUsername } = validation.data;
    console.log('Validated data (sanitized):', { username, email, platform, platformId, platformUsername });

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      console.log('User already exists');
      return ApiResponse.error('User with this email or username already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Password hashed successfully');

    // Find or create bronze rank for current season
    const currentSeason = '2025-S1';
    let bronzeRank = await prisma.rank.findFirst({
      where: {
        tier: 'bronze',
        division: 1,
        season: currentSeason
      }
    });

    if (!bronzeRank) {
      // Create bronze rank if it doesn't exist
      bronzeRank = await prisma.rank.create({
        data: {
          tier: 'bronze',
          division: 1,
          minPoints: 0,
          maxPoints: 999,
          season: currentSeason
        }
      });
      console.log('Created bronze rank:', bronzeRank.id);
    } else {
      console.log('Found existing bronze rank:', bronzeRank.id);
    }

    // Create user with gaming account if provided
    const userData: any = {
      username,
      email,
      password: hashedPassword,
      totalPoints: 0,
      currentRankId: bronzeRank.id,
      rankPoints: 0,
    };

    // Create gaming account data if provided
    const gamingAccounts = platform && platformId && platformUsername ? {
      create: [{
        platform,
        platformId,
        username: platformUsername,
        isVerified: false,
      }]
    } : undefined;

    console.log('Creating user with data:', userData);
    console.log('Gaming accounts:', gamingAccounts);

    const user = await prisma.user.create({
      data: {
        ...userData,
        gamingAccounts,
      },
      include: {
        currentRank: true,
        gamingAccounts: true,
        achievements: {
          include: {
            achievement: true
          }
        }
      }
    });

    console.log('User created successfully:', user.id);

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not found in environment');
      return ApiResponse.error('Server configuration error', 500);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    console.log('JWT token generated successfully');

    // Format user response to match expected structure
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      firstName: user.firstName,
      lastName: user.lastName,
      verified: user.verified,
      rank: {
        tier: user.currentRank.tier,
        division: user.currentRank.division,
        points: user.rankPoints,
        pointsToNextRank: user.currentRank.maxPoints - user.rankPoints,
        season: user.currentRank.season
      },
      totalPoints: user.totalPoints,
      tournamentsWon: user.tournamentsWon,
      gamesPlayed: user.gamesPlayed
    };

    console.log('Registration completed successfully');
    return ApiResponse.success({
      user: userResponse,
      token
    }, 'User registered successfully');

  } catch (error) {
    console.error('Registration error:', error);
    return handleApiError(error, 'register');
  }
}
