const express = require('express');
const { body, validationResult } = require('express-validator');
const Tournament = require('../models/Tournament');
const User = require('../models/User');
const { auth, optionalAuth, creatorAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tournaments
// @desc    Get all tournaments with filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      game,
      creator,
      search
    } = req.query;

    const filter = { visibility: 'public' };
    
    if (status) filter.status = status;
    if (game) filter.game = game;
    if (creator) filter.creator = creator;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tournaments = await Tournament.find(filter)
      .populate('creator', 'username isCreator')
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
    console.error('Get tournaments error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/tournaments/:id
// @desc    Get tournament by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('creator', 'username isCreator')
      .populate('participants.user', 'username gamingAccounts stats')
      .populate('participants.team', 'name tag logo');

    if (!tournament) {
      return res.status(404).json({
        success: false,
        error: 'Tournament not found'
      });
    }

    // Check if tournament is private and user has access
    if (tournament.visibility === 'private' && (!req.user || tournament.creator._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to private tournament'
      });
    }

    res.json({
      success: true,
      data: tournament
    });
  } catch (error) {
    console.error('Get tournament error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/tournaments
// @desc    Create tournament
// @access  Private (Creator)
router.post('/', [auth, creatorAuth], [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('game')
    .isIn(['valorant', 'league-of-legends', 'cs2', 'rocket-league'])
    .withMessage('Invalid game selection'),
  body('format')
    .isIn(['single-elimination', 'double-elimination', 'round-robin', 'swiss'])
    .withMessage('Invalid tournament format'),
  body('maxParticipants')
    .isInt({ min: 2, max: 1024 })
    .withMessage('Max participants must be between 2 and 1024'),
  body('entryFee')
    .isFloat({ min: 0 })
    .withMessage('Entry fee must be a positive number'),
  body('prizePool')
    .isFloat({ min: 0 })
    .withMessage('Prize pool must be a positive number'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('registrationDeadline')
    .isISO8601()
    .withMessage('Registration deadline must be a valid date')
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

    const tournamentData = {
      ...req.body,
      creator: req.user._id,
      status: 'open'
    };

    // Validate dates
    const startDate = new Date(req.body.startDate);
    const registrationDeadline = new Date(req.body.registrationDeadline);
    const now = new Date();

    if (startDate <= now) {
      return res.status(400).json({
        success: false,
        error: 'Start date must be in the future'
      });
    }

    if (registrationDeadline >= startDate) {
      return res.status(400).json({
        success: false,
        error: 'Registration deadline must be before start date'
      });
    }

    const tournament = new Tournament(tournamentData);
    await tournament.save();

    await tournament.populate('creator', 'username isCreator');

    res.status(201).json({
      success: true,
      data: tournament,
      message: 'Tournament created successfully'
    });
  } catch (error) {
    console.error('Create tournament error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/tournaments/:id/join
// @desc    Join tournament
// @access  Private
router.post('/:id/join', auth, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        error: 'Tournament not found'
      });
    }

    // Check if tournament is open for registration
    if (tournament.status !== 'open') {
      return res.status(400).json({
        success: false,
        error: 'Tournament is not open for registration'
      });
    }

    // Check registration deadline
    if (new Date() > tournament.registrationDeadline) {
      return res.status(400).json({
        success: false,
        error: 'Registration deadline has passed'
      });
    }

    // Check if user is already participating
    const existingParticipant = tournament.participants.find(
      p => p.user.toString() === req.user._id.toString()
    );

    if (existingParticipant) {
      return res.status(400).json({
        success: false,
        error: 'Already registered for this tournament'
      });
    }

    // Check if tournament is full
    if (tournament.participants.length >= tournament.maxParticipants) {
      return res.status(400).json({
        success: false,
        error: 'Tournament is full'
      });
    }

    // Check if user has enough coins for entry fee
    if (req.user.coinBalance < tournament.entryFee) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient coin balance'
      });
    }

    // Deduct entry fee
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 
        coinBalance: -tournament.entryFee,
        'stats.tournamentsJoined': 1
      }
    });

    // Add participant
    tournament.participants.push({
      user: req.user._id,
      joinedAt: new Date(),
      status: 'registered'
    });

    await tournament.save();
    await tournament.populate('participants.user', 'username');

    res.json({
      success: true,
      data: tournament,
      message: 'Successfully joined tournament'
    });
  } catch (error) {
    console.error('Join tournament error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/tournaments/:id/leave
// @desc    Leave tournament
// @access  Private
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        error: 'Tournament not found'
      });
    }

    // Check if user is participating
    const participantIndex = tournament.participants.findIndex(
      p => p.user.toString() === req.user._id.toString()
    );

    if (participantIndex === -1) {
      return res.status(400).json({
        success: false,
        error: 'Not registered for this tournament'
      });
    }

    // Check if tournament has started
    if (tournament.status === 'in-progress') {
      return res.status(400).json({
        success: false,
        error: 'Cannot leave tournament that has started'
      });
    }

    // Refund entry fee
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 
        coinBalance: tournament.entryFee,
        'stats.tournamentsJoined': -1
      }
    });

    // Remove participant
    tournament.participants.splice(participantIndex, 1);
    await tournament.save();

    res.json({
      success: true,
      data: tournament,
      message: 'Successfully left tournament'
    });
  } catch (error) {
    console.error('Leave tournament error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
