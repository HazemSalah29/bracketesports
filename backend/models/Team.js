const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  tag: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 10,
    uppercase: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  logo: {
    type: String
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['captain', 'member', 'substitute'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  game: {
    type: String,
    required: true,
    enum: ['valorant', 'league-of-legends', 'cs2', 'rocket-league']
  },
  region: {
    type: String,
    required: true,
    enum: ['na', 'eu', 'asia', 'oceania', 'sa', 'africa']
  },
  maxMembers: {
    type: Number,
    required: true,
    min: 2,
    max: 10
  },
  isRecruiting: {
    type: Boolean,
    default: true
  },
  requirements: {
    minRank: String,
    minAge: Number,
    region: String,
    other: String
  },
  stats: {
    tournamentsPlayed: {
      type: Number,
      default: 0
    },
    tournamentsWon: {
      type: Number,
      default: 0
    },
    winRate: {
      type: Number,
      default: 0
    }
  },
  socialLinks: {
    discord: String,
    twitter: String,
    twitch: String
  }
}, {
  timestamps: true
});

// Index for better query performance
teamSchema.index({ game: 1, region: 1, isRecruiting: 1 });
teamSchema.index({ captain: 1 });

module.exports = mongoose.model('Team', teamSchema);
