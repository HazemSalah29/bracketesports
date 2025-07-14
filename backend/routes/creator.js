const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Tournament = require('../models/Tournament');
const { auth, creatorAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/creator/apply
// @desc    Apply for creator program
// @access  Private
router.post('/apply', auth, [
  body('experience')
    .trim()
    .isLength({ min: 50, max: 1000 })
    .withMessage('Experience description must be between 50 and 1000 characters'),
  body('motivation')
    .trim()
    .isLength({ min: 50, max: 1000 })
    .withMessage('Motivation must be between 50 and 1000 characters'),
  body('organizationName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Organization name must be less than 100 characters'),
  body('references')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('References must be less than 500 characters')
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

    // Check if user already applied or is already a creator
    if (req.user.isCreator) {
      return res.status(400).json({
        success: false,
        error: 'You are already a creator'
      });
    }

    if (req.user.creatorStatus === 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Creator application is already pending review'
      });
    }

    const { experience, motivation, organizationName, references } = req.body;

    // Update user with creator application
    await User.findByIdAndUpdate(req.user._id, {
      creatorStatus: 'pending',
      creatorApplication: {
        experience,
        motivation,
        organizationName,
        references,
        appliedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Creator application submitted successfully. We will review your application and get back to you soon.'
    });
  } catch (error) {
    console.error('Creator application error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/creator/analytics
// @desc    Get creator analytics
// @access  Private (Creator)
router.get('/analytics', [auth, creatorAuth], async (req, res) => {
  try {
    // Get tournaments created by this user
    const tournaments = await Tournament.find({ creator: req.user._id });
    
    const analytics = {
      tournaments: {
        total: tournaments.length,
        active: tournaments.filter(t => t.status === 'in-progress').length,
        completed: tournaments.filter(t => t.status === 'completed').length,
        cancelled: tournaments.filter(t => t.status === 'cancelled').length
      },
      participants: {
        total: tournaments.reduce((sum, t) => sum + t.participants.length, 0),
        average: tournaments.length > 0 
          ? Math.round(tournaments.reduce((sum, t) => sum + t.participants.length, 0) / tournaments.length)
          : 0
      },
      revenue: {
        total: tournaments.reduce((sum, t) => sum + (t.entryFee * t.participants.length), 0),
        commission: tournaments.reduce((sum, t) => sum + (t.entryFee * t.participants.length * 0.1), 0) // 10% commission
      },
      engagement: {
        averageParticipantsPerTournament: tournaments.length > 0 
          ? tournaments.reduce((sum, t) => sum + t.participants.length, 0) / tournaments.length
          : 0,
        completionRate: tournaments.length > 0
          ? (tournaments.filter(t => t.status === 'completed').length / tournaments.length) * 100
          : 0
      }
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Creator analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/creator/earnings
// @desc    Get creator earnings
// @access  Private (Creator)
router.get('/earnings', [auth, creatorAuth], async (req, res) => {
  try {
    const tournaments = await Tournament.find({ 
      creator: req.user._id,
      status: 'completed'
    }).select('title entryFee participants createdAt');

    const earnings = tournaments.map(tournament => {
      const revenue = tournament.entryFee * tournament.participants.length;
      const commission = revenue * 0.1; // 10% commission
      
      return {
        tournament: {
          id: tournament._id,
          title: tournament.title,
          date: tournament.createdAt
        },
        participants: tournament.participants.length,
        entryFee: tournament.entryFee,
        revenue,
        commission,
        netEarnings: commission
      };
    });

    const totalEarnings = earnings.reduce((sum, e) => sum + e.netEarnings, 0);
    const totalRevenue = earnings.reduce((sum, e) => sum + e.revenue, 0);

    res.json({
      success: true,
      data: {
        summary: {
          totalEarnings,
          totalRevenue,
          totalTournaments: earnings.length,
          averageEarningsPerTournament: earnings.length > 0 ? totalEarnings / earnings.length : 0
        },
        earnings
      }
    });
  } catch (error) {
    console.error('Creator earnings error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/creator/tournaments
// @desc    Get creator's tournaments
// @access  Private (Creator)
router.get('/tournaments', [auth, creatorAuth], async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = { creator: req.user._id };
    if (status) filter.status = status;

    const tournaments = await Tournament.find(filter)
      .populate('participants.user', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Tournament.countDocuments(filter);

    res.json({
      success: true,
      data: {
        tournaments,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Creator tournaments error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
