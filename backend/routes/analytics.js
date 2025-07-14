const express = require('express');
const User = require('../models/User');
const Tournament = require('../models/Tournament');
const Team = require('../models/Team');
const { auth, optionalAuth, creatorAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analytics/platform
// @desc    Get platform-wide analytics
// @access  Public
router.get('/platform', optionalAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      totalTournaments,
      totalTeams,
      activeTournaments,
      completedTournaments
    ] = await Promise.all([
      User.countDocuments(),
      Tournament.countDocuments(),
      Team.countDocuments(),
      Tournament.countDocuments({ status: 'in-progress' }),
      Tournament.countDocuments({ status: 'completed' })
    ]);

    // Get tournament participants count
    const tournamentStats = await Tournament.aggregate([
      {
        $group: {
          _id: null,
          totalParticipants: { $sum: { $size: '$participants' } },
          totalPrizePool: { $sum: '$prizePool' },
          totalEntryFees: { $sum: { $multiply: ['$entryFee', { $size: '$participants' }] } }
        }
      }
    ]);

    const stats = tournamentStats[0] || {
      totalParticipants: 0,
      totalPrizePool: 0,
      totalEntryFees: 0
    };

    // Get game distribution
    const gameDistribution = await Tournament.aggregate([
      {
        $group: {
          _id: '$game',
          count: { $sum: 1 },
          participants: { $sum: { $size: '$participants' } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = await Tournament.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          tournaments: { $sum: 1 },
          participants: { $sum: { $size: '$participants' } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const analytics = {
      overview: {
        totalUsers,
        totalTournaments,
        totalTeams,
        activeTournaments,
        completedTournaments,
        totalParticipants: stats.totalParticipants,
        totalPrizePool: stats.totalPrizePool,
        totalRevenue: stats.totalEntryFees
      },
      gameDistribution,
      recentActivity: recentActivity.slice(-7), // Last 7 days
      growth: {
        newUsersThisMonth: await User.countDocuments({
          createdAt: { $gte: thirtyDaysAgo }
        }),
        newTournamentsThisMonth: await Tournament.countDocuments({
          createdAt: { $gte: thirtyDaysAgo }
        }),
        newTeamsThisMonth: await Team.countDocuments({
          createdAt: { $gte: thirtyDaysAgo }
        })
      }
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Platform analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/analytics/user
// @desc    Get user-specific analytics
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    // Get user's tournament participation
    const userTournaments = await Tournament.find({
      'participants.user': req.user._id
    }).select('title game status startDate entryFee prizePool participants results');

    // Calculate user stats
    const tournamentsJoined = userTournaments.length;
    const tournamentsWon = userTournaments.filter(t => 
      t.results?.winner?.toString() === req.user._id.toString()
    ).length;
    
    const totalSpent = userTournaments.reduce((sum, t) => sum + t.entryFee, 0);
    const totalEarnings = req.user.stats.totalEarnings || 0;

    // Game breakdown
    const gameBreakdown = userTournaments.reduce((acc, tournament) => {
      if (!acc[tournament.game]) {
        acc[tournament.game] = {
          played: 0,
          won: 0,
          spent: 0
        };
      }
      
      acc[tournament.game].played++;
      acc[tournament.game].spent += tournament.entryFee;
      
      if (tournament.results?.winner?.toString() === req.user._id.toString()) {
        acc[tournament.game].won++;
      }
      
      return acc;
    }, {});

    // Recent activity
    const recentTournaments = userTournaments
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      .slice(0, 5)
      .map(tournament => ({
        id: tournament._id,
        title: tournament.title,
        game: tournament.game,
        status: tournament.status,
        startDate: tournament.startDate,
        entryFee: tournament.entryFee,
        isWinner: tournament.results?.winner?.toString() === req.user._id.toString()
      }));

    const analytics = {
      overview: {
        tournamentsJoined,
        tournamentsWon,
        winRate: tournamentsJoined > 0 ? Math.round((tournamentsWon / tournamentsJoined) * 100) : 0,
        totalSpent,
        totalEarnings,
        netProfit: totalEarnings - totalSpent,
        currentRank: await getUserRank(req.user._id)
      },
      gameBreakdown,
      recentTournaments,
      achievements: await getUserAchievements(req.user)
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/analytics/creator-dashboard
// @desc    Get creator dashboard analytics
// @access  Private (Creator)
router.get('/creator-dashboard', [auth, creatorAuth], async (req, res) => {
  try {
    const creatorTournaments = await Tournament.find({ creator: req.user._id });
    
    // Calculate metrics
    const totalTournaments = creatorTournaments.length;
    const activeTournaments = creatorTournaments.filter(t => t.status === 'in-progress').length;
    const completedTournaments = creatorTournaments.filter(t => t.status === 'completed').length;
    const totalParticipants = creatorTournaments.reduce((sum, t) => sum + t.participants.length, 0);
    const totalRevenue = creatorTournaments.reduce((sum, t) => sum + (t.entryFee * t.participants.length), 0);
    const commission = totalRevenue * 0.1; // 10% commission

    // Performance metrics
    const averageParticipants = totalTournaments > 0 ? totalParticipants / totalTournaments : 0;
    const completionRate = totalTournaments > 0 ? (completedTournaments / totalTournaments) * 100 : 0;

    // Recent tournaments
    const recentTournaments = creatorTournaments
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(tournament => ({
        id: tournament._id,
        title: tournament.title,
        game: tournament.game,
        status: tournament.status,
        participants: tournament.participants.length,
        maxParticipants: tournament.maxParticipants,
        entryFee: tournament.entryFee,
        revenue: tournament.entryFee * tournament.participants.length,
        createdAt: tournament.createdAt
      }));

    // Monthly breakdown (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyBreakdown = await Tournament.aggregate([
      {
        $match: {
          creator: req.user._id,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          tournaments: { $sum: 1 },
          participants: { $sum: { $size: '$participants' } },
          revenue: { $sum: { $multiply: ['$entryFee', { $size: '$participants' }] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const analytics = {
      overview: {
        totalTournaments,
        activeTournaments,
        completedTournaments,
        totalParticipants,
        totalRevenue,
        commission,
        averageParticipants: Math.round(averageParticipants),
        completionRate: Math.round(completionRate)
      },
      recentTournaments,
      monthlyBreakdown,
      topPerformingGames: await getCreatorTopGames(req.user._id)
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Creator dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/analytics/tournaments
// @desc    Get tournament-specific analytics
// @access  Public
router.get('/tournaments', async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (timeframe) {
      case '7d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case '90d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) } };
        break;
      default:
        dateFilter = {};
    }

    // Tournament status distribution
    const statusDistribution = await Tournament.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Popular games
    const popularGames = await Tournament.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$game',
          tournaments: { $sum: 1 },
          totalParticipants: { $sum: { $size: '$participants' } },
          averageParticipants: { $avg: { $size: '$participants' } }
        }
      },
      { $sort: { tournaments: -1 } }
    ]);

    // Tournament size distribution
    const sizeDistribution = await Tournament.aggregate([
      { $match: dateFilter },
      {
        $bucket: {
          groupBy: { $size: '$participants' },
          boundaries: [0, 5, 10, 25, 50, 100, 1000],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            tournaments: { $push: '$title' }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        timeframe,
        statusDistribution,
        popularGames,
        sizeDistribution,
        summary: {
          totalTournaments: await Tournament.countDocuments(dateFilter),
          averageParticipants: await getAverageParticipants(dateFilter),
          totalPrizePool: await getTotalPrizePool(dateFilter)
        }
      }
    });
  } catch (error) {
    console.error('Tournament analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Helper functions
async function getUserRank(userId) {
  const users = await User.find({}).sort({ 'stats.totalEarnings': -1 });
  const rank = users.findIndex(user => user._id.toString() === userId.toString()) + 1;
  return rank || users.length;
}

async function getUserAchievements(user) {
  const achievements = [];
  
  if (user.stats.tournamentsWon >= 1) {
    achievements.push({ name: 'First Victory', description: 'Won your first tournament' });
  }
  if (user.stats.tournamentsWon >= 5) {
    achievements.push({ name: 'Champion', description: 'Won 5 tournaments' });
  }
  if (user.stats.tournamentsJoined >= 10) {
    achievements.push({ name: 'Active Player', description: 'Participated in 10 tournaments' });
  }
  if (user.coinBalance >= 1000) {
    achievements.push({ name: 'Wealthy', description: 'Accumulated 1000+ coins' });
  }
  
  return achievements;
}

async function getCreatorTopGames(creatorId) {
  return await Tournament.aggregate([
    { $match: { creator: creatorId } },
    {
      $group: {
        _id: '$game',
        tournaments: { $sum: 1 },
        participants: { $sum: { $size: '$participants' } },
        revenue: { $sum: { $multiply: ['$entryFee', { $size: '$participants' }] } }
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: 5 }
  ]);
}

async function getAverageParticipants(filter) {
  const result = await Tournament.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        average: { $avg: { $size: '$participants' } }
      }
    }
  ]);
  return result[0]?.average || 0;
}

async function getTotalPrizePool(filter) {
  const result = await Tournament.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        total: { $sum: '$prizePool' }
      }
    }
  ]);
  return result[0]?.total || 0;
}

module.exports = router;
