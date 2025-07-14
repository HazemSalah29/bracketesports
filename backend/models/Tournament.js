const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  game: {
    type: String,
    required: true,
    enum: ['valorant', 'league-of-legends', 'cs2', 'rocket-league']
  },
  format: {
    type: String,
    required: true,
    enum: ['single-elimination', 'double-elimination', 'round-robin', 'swiss']
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 2,
    max: 1024
  },
  entryFee: {
    type: Number,
    required: true,
    min: 0
  },
  prizePool: {
    type: Number,
    required: true,
    min: 0
  },
  prizeDistribution: [{
    position: Number,
    percentage: Number,
    amount: Number
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'open', 'in-progress', 'completed', 'cancelled'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'invite-only'],
    default: 'public'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'checked-in', 'disqualified'],
      default: 'registered'
    }
  }],
  rules: {
    type: String,
    maxlength: 2000
  },
  discordServer: {
    type: String
  },
  streamUrl: {
    type: String
  },
  isTeamBased: {
    type: Boolean,
    default: false
  },
  teamSize: {
    type: Number,
    min: 1,
    max: 10,
    default: 1
  },
  regions: [{
    type: String,
    enum: ['na', 'eu', 'asia', 'oceania', 'sa', 'africa']
  }],
  brackets: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  results: {
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    runnerUp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    finalScores: {
      type: mongoose.Schema.Types.Mixed
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
tournamentSchema.index({ game: 1, status: 1, startDate: 1 });
tournamentSchema.index({ creator: 1 });

module.exports = mongoose.model('Tournament', tournamentSchema);
