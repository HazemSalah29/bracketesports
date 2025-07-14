// Text keys and constants for the application
export const KEYS = {
  // Authentication
  AUTH: {
    LOGIN: 'auth.login',
    REGISTER: 'auth.register',
    LOGOUT: 'auth.logout',
    CREATE_ACCOUNT: 'auth.create_account',
    SIGN_IN_EXISTING: 'auth.sign_in_existing',
    USERNAME: 'auth.username',
    EMAIL: 'auth.email',
    PASSWORD: 'auth.password',
    CONFIRM_PASSWORD: 'auth.confirm_password',
    CREATING_ACCOUNT: 'auth.creating_account',
    SIGNING_IN: 'auth.signing_in',
    WELCOME_BACK: 'auth.welcome_back',
    INVALID_CREDENTIALS: 'auth.invalid_credentials',
    ACCOUNT_CREATED: 'auth.account_created',
    AUTHENTICATION_REQUIRED: 'auth.authentication_required',
    PLEASE_LOGIN: 'auth.please_login',
  },

  // Navigation
  NAV: {
    HOME: 'nav.home',
    TOURNAMENTS: 'nav.tournaments',
    LEADERBOARD: 'nav.leaderboard',
    TEAMS: 'nav.teams',
    PROFILE: 'nav.profile',
    DASHBOARD: 'nav.dashboard',
    SETTINGS: 'nav.settings',
  },

  // Common Actions
  ACTIONS: {
    CREATE: 'actions.create',
    JOIN: 'actions.join',
    EDIT: 'actions.edit',
    DELETE: 'actions.delete',
    SAVE: 'actions.save',
    CANCEL: 'actions.cancel',
    SUBMIT: 'actions.submit',
    CONTINUE: 'actions.continue',
    BACK: 'actions.back',
    CLOSE: 'actions.close',
    VIEW: 'actions.view',
    MANAGE: 'actions.manage',
  },

  // Tournament Related
  TOURNAMENT: {
    CREATE_TOURNAMENT: 'tournament.create_tournament',
    JOIN_TOURNAMENT: 'tournament.join_tournament',
    TOURNAMENT_DETAILS: 'tournament.tournament_details',
    TOURNAMENT_RULES: 'tournament.tournament_rules',
    POINTS_REWARD: 'tournament.points_reward',
    PARTICIPANTS: 'tournament.participants',
    STATUS: {
      REGISTERING: 'tournament.status.registering',
      LIVE: 'tournament.status.live',
      COMPLETED: 'tournament.status.completed',
      CANCELLED: 'tournament.status.cancelled',
    },
    TYPE: {
      SOLO: 'tournament.type.solo',
      TEAM: 'tournament.type.team',
    },
  },

  // Team Related
  TEAM: {
    CREATE_TEAM: 'team.create_team',
    JOIN_TEAM: 'team.join_team',
    MANAGE_TEAM: 'team.manage_team',
    TEAM_MEMBERS: 'team.team_members',
    TEAM_CAPTAIN: 'team.team_captain',
    LEAVE_TEAM: 'team.leave_team',
    INVITE_MEMBER: 'team.invite_member',
  },

  // Profile Related
  PROFILE: {
    EDIT_PROFILE: 'profile.edit_profile',
    PROFILE_SETTINGS: 'profile.profile_settings',
    ACCOUNT_SETTINGS: 'profile.account_settings',
    GAMING_ACCOUNTS: 'profile.gaming_accounts',
    LINK_ACCOUNT: 'profile.link_account',
    TOTAL_POINTS: 'profile.total_points',
    TOURNAMENTS_WON: 'profile.tournaments_won',
    CURRENT_RANK: 'profile.current_rank',
    ACHIEVEMENTS: 'profile.achievements',
  },

  // Dashboard
  DASHBOARD: {
    ACTIVE_TOURNAMENTS: 'dashboard.active_tournaments',
    QUICK_ACTIONS: 'dashboard.quick_actions',
    PLAYER_STATS: 'dashboard.player_stats',
    VIEW_ANALYTICS: 'dashboard.view_analytics',
    RANK_PROGRESS: 'dashboard.rank_progress',
  },

  // Settings
  SETTINGS: {
    SETTINGS: 'settings.settings',
    ACCOUNT_SECURITY: 'settings.account_security',
    NOTIFICATIONS: 'settings.notifications',
    PREFERENCES: 'settings.preferences',
    PRIVACY_DATA: 'settings.privacy_data',
    BILLING_SUBSCRIPTIONS: 'settings.billing_subscriptions',
    CHANGE_PASSWORD: 'settings.change_password',
    TWO_FACTOR_AUTH: 'settings.two_factor_auth',
  },

  // Messages and Alerts
  MESSAGES: {
    SUCCESS: {
      ACCOUNT_LINKED: 'messages.success.account_linked',
      TOURNAMENT_JOINED: 'messages.success.tournament_joined',
      TEAM_CREATED: 'messages.success.team_created',
      PROFILE_UPDATED: 'messages.success.profile_updated',
    },
    ERROR: {
      ACCOUNT_LINK_FAILED: 'messages.error.account_link_failed',
      TOURNAMENT_JOIN_FAILED: 'messages.error.tournament_join_failed',
      TEAM_CREATE_FAILED: 'messages.error.team_create_failed',
      GENERIC_ERROR: 'messages.error.generic_error',
    },
    WARNING: {
      ACCOUNT_NOT_LINKED: 'messages.warning.account_not_linked',
      TEAM_REQUIRED: 'messages.warning.team_required',
      INSUFFICIENT_RANK: 'messages.warning.insufficient_rank',
    },
  },

  // Ranks
  RANKS: {
    BRONZE: 'ranks.bronze',
    SILVER: 'ranks.silver',
    GOLD: 'ranks.gold',
    PLATINUM: 'ranks.platinum',
    DIAMOND: 'ranks.diamond',
    MASTER: 'ranks.master',
    GRANDMASTER: 'ranks.grandmaster',
  },

  // Games
  GAMES: {
    COUNTER_STRIKE_2: 'games.counter_strike_2',
    VALORANT: 'games.valorant',
    ROCKET_LEAGUE: 'games.rocket_league',
    LEAGUE_OF_LEGENDS: 'games.league_of_legends',
  },

  // Skill Levels
  SKILL_LEVELS: {
    BEGINNER: 'skill_levels.beginner',
    INTERMEDIATE: 'skill_levels.intermediate',
    EXPERT: 'skill_levels.expert',
    ALL_LEVELS: 'skill_levels.all_levels',
  },
} as const

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    VERIFY_EMAIL: '/api/auth/verify-email',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },

  // User Management
  USERS: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/profile',
    UPLOAD_AVATAR: '/api/user/avatar',
    CHANGE_PASSWORD: '/api/user/change-password',
    ACTIVITY: '/api/user/activity',
    LINK_GAMING_ACCOUNT: '/api/user/gaming-accounts',
    ADD_GAMING_ACCOUNT: '/api/user/gaming-accounts',
    UNLINK_GAMING_ACCOUNT: '/api/user/unlink-gaming-account',
    GET_GAMING_ACCOUNTS: '/api/user/gaming-accounts',
    VERIFY_GAMING_ACCOUNT: '/api/user/gaming-accounts/verify',
  },

  // Tournaments
  TOURNAMENTS: {
    LIST: '/api/tournaments',
    CREATE: '/api/tournaments',
    GET_BY_ID: (id: string) => `/api/tournaments/${id}`,
    UPDATE: (id: string) => `/api/tournaments/${id}`,
    DELETE: (id: string) => `/api/tournaments/${id}`,
    JOIN: (id: string) => `/api/tournaments/${id}/join`,
    LEAVE: (id: string) => `/api/tournaments/${id}/leave`,
    PARTICIPANTS: (id: string) => `/api/tournaments/${id}/participants`,
  },

  // Teams
  TEAMS: {
    LIST: '/api/teams',
    CREATE: '/api/teams',
    GET_BY_ID: (id: string) => `/api/teams/${id}`,
    UPDATE: (id: string) => `/api/teams/${id}`,
    DELETE: (id: string) => `/api/teams/${id}`,
    JOIN: (id: string) => `/api/teams/${id}/join`,
    LEAVE: (id: string) => `/api/teams/${id}/leave`,
    INVITE: (id: string) => `/api/teams/${id}/invite`,
    MEMBERS: (id: string) => `/api/teams/${id}/members`,
  },

  // Leaderboard
  LEADERBOARD: {
    GLOBAL: '/api/leaderboard/global',
    BY_GAME: (game: string) => `/api/leaderboard/game/${game}`,
    BY_SEASON: (season: string) => `/api/leaderboard/season/${season}`,
  },

  // Analytics
  ANALYTICS: {
    USER_STATS: '/api/analytics/user-stats',
    TOURNAMENT_STATS: '/api/analytics/tournament-stats',
    TEAM_STATS: '/api/analytics/team-stats',
    PERFORMANCE: '/api/analytics/performance',
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    MARK_READ: (id: string) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: '/api/notifications/read-all',
    SETTINGS: '/api/notifications/settings',
  },
} as const

// Database Table Names
export const DB_TABLES = {
  USERS: 'users',
  TOURNAMENTS: 'tournaments',
  TEAMS: 'teams',
  TEAM_MEMBERS: 'team_members',
  TOURNAMENT_PARTICIPANTS: 'tournament_participants',
  GAMING_ACCOUNTS: 'gaming_accounts',
  ACHIEVEMENTS: 'achievements',
  USER_ACHIEVEMENTS: 'user_achievements',
  NOTIFICATIONS: 'notifications',
  RANKS: 'ranks',
  SEASONS: 'seasons',
} as const

// Cache Keys
export const CACHE_KEYS = {
  USER_PROFILE: (userId: string) => `user:profile:${userId}`,
  TOURNAMENTS: 'tournaments:list',
  LEADERBOARD: (type: string) => `leaderboard:${type}`,
  TEAM: (teamId: string) => `team:${teamId}`,
  USER_STATS: (userId: string) => `stats:user:${userId}`,
} as const

// Event Names for Real-time Updates
export const EVENTS = {
  TOURNAMENT_JOINED: 'tournament:joined',
  TOURNAMENT_LEFT: 'tournament:left',
  TOURNAMENT_STARTED: 'tournament:started',
  TOURNAMENT_ENDED: 'tournament:ended',
  TEAM_CREATED: 'team:created',
  TEAM_JOINED: 'team:joined',
  TEAM_LEFT: 'team:left',
  RANK_UPDATED: 'rank:updated',
  ACHIEVEMENT_UNLOCKED: 'achievement:unlocked',
} as const
