const express = require('express');
const { body, validationResult } = require('express-validator');
const Team = require('../models/Team');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/teams
// @desc    Get all teams with filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      game,
      region,
      isRecruiting,
      search
    } = req.query;

    const filter = {};
    
    if (game) filter.game = game;
    if (region) filter.region = region;
    if (isRecruiting !== undefined) filter.isRecruiting = isRecruiting === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tag: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const teams = await Team.find(filter)
      .populate('captain', 'username')
      .populate('members.user', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Team.countDocuments(filter);

    res.json({
      success: true,
      data: {
        teams,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/teams/:id
// @desc    Get team by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('captain', 'username stats')
      .populate('members.user', 'username stats');

    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }

    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/teams
// @desc    Create team
// @access  Private
router.post('/', auth, [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Team name must be between 2 and 50 characters'),
  body('tag')
    .trim()
    .isLength({ min: 2, max: 10 })
    .withMessage('Team tag must be between 2 and 10 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Team tag can only contain uppercase letters and numbers'),
  body('game')
    .isIn(['valorant', 'league-of-legends', 'cs2', 'rocket-league'])
    .withMessage('Invalid game selection'),
  body('region')
    .isIn(['na', 'eu', 'asia', 'oceania', 'sa', 'africa'])
    .withMessage('Invalid region selection'),
  body('maxMembers')
    .isInt({ min: 2, max: 10 })
    .withMessage('Max members must be between 2 and 10'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters')
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

    const { name, tag, description, game, region, maxMembers, requirements } = req.body;

    // Check if team tag is already taken
    const existingTeam = await Team.findOne({ tag: tag.toUpperCase() });
    if (existingTeam) {
      return res.status(400).json({
        success: false,
        error: 'Team tag already taken'
      });
    }

    const team = new Team({
      name,
      tag: tag.toUpperCase(),
      description,
      game,
      region,
      maxMembers,
      requirements,
      captain: req.user._id,
      members: [{
        user: req.user._id,
        role: 'captain',
        joinedAt: new Date()
      }]
    });

    await team.save();
    await team.populate('captain', 'username');
    await team.populate('members.user', 'username');

    res.status(201).json({
      success: true,
      data: team,
      message: 'Team created successfully'
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/teams/:id/join
// @desc    Join team
// @access  Private
router.post('/:id/join', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }

    // Check if team is recruiting
    if (!team.isRecruiting) {
      return res.status(400).json({
        success: false,
        error: 'Team is not currently recruiting'
      });
    }

    // Check if user is already a member
    const existingMember = team.members.find(
      m => m.user.toString() === req.user._id.toString()
    );

    if (existingMember) {
      return res.status(400).json({
        success: false,
        error: 'Already a member of this team'
      });
    }

    // Check if team is full
    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({
        success: false,
        error: 'Team is full'
      });
    }

    // Add member
    team.members.push({
      user: req.user._id,
      role: 'member',
      joinedAt: new Date()
    });

    await team.save();
    await team.populate('members.user', 'username');

    res.json({
      success: true,
      data: team,
      message: 'Successfully joined team'
    });
  } catch (error) {
    console.error('Join team error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/teams/:id/leave
// @desc    Leave team
// @access  Private
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }

    // Check if user is a member
    const memberIndex = team.members.findIndex(
      m => m.user.toString() === req.user._id.toString()
    );

    if (memberIndex === -1) {
      return res.status(400).json({
        success: false,
        error: 'Not a member of this team'
      });
    }

    // Check if user is the captain
    if (team.captain.toString() === req.user._id.toString()) {
      if (team.members.length > 1) {
        return res.status(400).json({
          success: false,
          error: 'Captain cannot leave team with members. Transfer captaincy first.'
        });
      } else {
        // Delete team if captain is the only member
        await Team.findByIdAndDelete(req.params.id);
        return res.json({
          success: true,
          message: 'Team disbanded successfully'
        });
      }
    }

    // Remove member
    team.members.splice(memberIndex, 1);
    await team.save();

    res.json({
      success: true,
      data: team,
      message: 'Successfully left team'
    });
  } catch (error) {
    console.error('Leave team error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
