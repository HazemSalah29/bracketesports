const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Tournament = require('../models/Tournament');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

// @route   PUT /api/users/me
// @desc    Update user profile
// @access  Private
router.put('/me', auth, [
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name must be less than 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name must be less than 50 characters'),
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { firstName, lastName, username } = req.body;
    const updateData = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Username already taken'
        });
      }
      updateData.username = username;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/users/coins/balance
// @desc    Get user coin balance
// @access  Private
router.get('/coins/balance', auth, (req, res) => {
  res.json({
    success: true,
    data: {
      balance: req.user.coinBalance
    }
  });
});

// @route   GET /api/users/activity
// @desc    Get user activity/tournament history
// @access  Private
router.get('/activity', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const tournaments = await Tournament.find({
      'participants.user': req.user._id
    })
    .populate('creator', 'username')
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('title game status startDate entryFee prizePool participants results');

    const activity = tournaments.map(tournament => {
      const participation = tournament.participants.find(p => 
        p.user.toString() === req.user._id.toString()
      );
      
      return {
        tournament: {
          id: tournament._id,
          title: tournament.title,
          game: tournament.game,
          status: tournament.status,
          startDate: tournament.startDate,
          entryFee: tournament.entryFee,
          prizePool: tournament.prizePool,
          creator: tournament.creator
        },
        joinedAt: participation?.joinedAt,
        status: participation?.status,
        isWinner: tournament.results?.winner?.toString() === req.user._id.toString()
      };
    });

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Activity fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get user leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const users = await User.find({})
      .select('username stats')
      .sort({ 'stats.totalEarnings': -1 })
      .limit(limit);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      tournamentsWon: user.stats.tournamentsWon,
      totalEarnings: user.stats.totalEarnings,
      winRate: user.stats.tournamentsJoined > 0 
        ? Math.round((user.stats.tournamentsWon / user.stats.tournamentsJoined) * 100)
        : 0
    }));

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/users/gaming-accounts
// @desc    Add gaming account
// @access  Private
router.post('/gaming-accounts', auth, [
  body('platform')
    .isIn(['riot', 'steam', 'battlenet', 'epic'])
    .withMessage('Invalid platform'),
  body('username')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Username must be between 1 and 50 characters'),
  body('platformId')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Platform ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { platform, username, platformId } = req.body;

    // Check if account already exists
    const existingAccount = req.user.gamingAccounts.find(
      account => account.platform === platform && account.platformId === platformId
    );

    if (existingAccount) {
      return res.status(400).json({
        success: false,
        error: 'Gaming account already linked'
      });
    }

    req.user.gamingAccounts.push({
      platform,
      username,
      platformId
    });

    await req.user.save();

    res.status(201).json({
      success: true,
      data: req.user.gamingAccounts,
      message: 'Gaming account added successfully'
    });
  } catch (error) {
    console.error('Add gaming account error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/users/gaming-accounts
// @desc    Get user gaming accounts
// @access  Private
router.get('/gaming-accounts', auth, (req, res) => {
  res.json({
    success: true,
    data: req.user.gamingAccounts
  });
});

// @route   DELETE /api/users/gaming-accounts/:id
// @desc    Remove gaming account
// @access  Private
router.delete('/gaming-accounts/:id', auth, async (req, res) => {
  try {
    const accountId = req.params.id;
    
    req.user.gamingAccounts = req.user.gamingAccounts.filter(
      account => account._id.toString() !== accountId
    );

    await req.user.save();

    res.json({
      success: true,
      data: req.user.gamingAccounts,
      message: 'Gaming account removed successfully'
    });
  } catch (error) {
    console.error('Remove gaming account error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
