// English translations
export const en = {
  // Authentication
  'auth.login': 'Login',
  'auth.register': 'Register',
  'auth.logout': 'Logout',
  'auth.create_account': 'Create Account',
  'auth.sign_in_existing': 'Sign in to existing account',
  'auth.username': 'Username',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.confirm_password': 'Confirm Password',
  'auth.creating_account': 'Creating Account...',
  'auth.signing_in': 'Signing In...',
  'auth.welcome_back': 'Welcome back!',
  'auth.invalid_credentials': 'Invalid credentials',
  'auth.account_created': 'Account created successfully!',
  'auth.authentication_required': 'Authentication Required',
  'auth.please_login': 'Please log in to access this page.',

  // Navigation
  'nav.home': 'Home',
  'nav.tournaments': 'Tournaments',
  'nav.leaderboard': 'Leaderboard',
  'nav.teams': 'Teams',
  'nav.profile': 'Profile',
  'nav.dashboard': 'Dashboard',
  'nav.settings': 'Settings',

  // Common Actions
  'actions.create': 'Create',
  'actions.join': 'Join',
  'actions.edit': 'Edit',
  'actions.delete': 'Delete',
  'actions.save': 'Save',
  'actions.cancel': 'Cancel',
  'actions.submit': 'Submit',
  'actions.continue': 'Continue',
  'actions.back': 'Back',
  'actions.close': 'Close',
  'actions.view': 'View',
  'actions.manage': 'Manage',

  // Tournament Related
  'tournament.create_tournament': 'Create Tournament',
  'tournament.join_tournament': 'Join Tournament',
  'tournament.tournament_details': 'Tournament Details',
  'tournament.tournament_rules': 'Tournament Rules',
  'tournament.points_reward': 'Points Reward',
  'tournament.participants': 'Participants',
  'tournament.status.registering': 'Registering',
  'tournament.status.live': 'Live',
  'tournament.status.completed': 'Completed',
  'tournament.status.cancelled': 'Cancelled',
  'tournament.type.solo': 'Solo',
  'tournament.type.team': 'Team',

  // Team Related
  'team.create_team': 'Create Team',
  'team.join_team': 'Join Team',
  'team.manage_team': 'Manage Team',
  'team.team_members': 'Team Members',
  'team.team_captain': 'Team Captain',
  'team.leave_team': 'Leave Team',
  'team.invite_member': 'Invite Member',

  // Profile Related
  'profile.edit_profile': 'Edit Profile',
  'profile.profile_settings': 'Profile Settings',
  'profile.account_settings': 'Account Settings',
  'profile.gaming_accounts': 'Gaming Accounts',
  'profile.link_account': 'Link Account',
  'profile.total_points': 'Total Points',
  'profile.tournaments_won': 'Tournaments Won',
  'profile.current_rank': 'Current Rank',
  'profile.achievements': 'Achievements',

  // Dashboard
  'dashboard.active_tournaments': 'Active Tournaments',
  'dashboard.quick_actions': 'Quick Actions',
  'dashboard.player_stats': 'Player Stats',
  'dashboard.view_analytics': 'View Analytics',
  'dashboard.rank_progress': 'Rank Progress',

  // Settings
  'settings.settings': 'Settings',
  'settings.profile_settings': 'Profile Settings',
  'settings.account_security': 'Account & Security',
  'settings.notifications': 'Notifications',
  'settings.preferences': 'Preferences',
  'settings.privacy_data': 'Privacy & Data',
  'settings.billing_subscriptions': 'Billing & Subscriptions',
  'settings.change_password': 'Change Password',
  'settings.two_factor_auth': 'Two-Factor Authentication',

  // Messages and Alerts
  'messages.success.account_linked': 'Account linked successfully!',
  'messages.success.tournament_joined': 'Successfully joined tournament!',
  'messages.success.team_created': 'Team created successfully!',
  'messages.success.profile_updated': 'Profile updated successfully!',
  'messages.error.account_link_failed': 'Failed to link account. Please try again.',
  'messages.error.tournament_join_failed': 'Failed to join tournament. Please try again.',
  'messages.error.team_create_failed': 'Failed to create team. Please try again.',
  'messages.error.generic_error': 'An error occurred. Please try again.',
  'messages.warning.account_not_linked': 'You need to link your game account to join tournaments.',
  'messages.warning.team_required': 'Team required for this tournament.',
  'messages.warning.insufficient_rank': 'Your rank is too low for this tournament.',

  // Ranks
  'ranks.bronze': 'Bronze',
  'ranks.silver': 'Silver',
  'ranks.gold': 'Gold',
  'ranks.platinum': 'Platinum',
  'ranks.diamond': 'Diamond',
  'ranks.master': 'Master',
  'ranks.grandmaster': 'Grandmaster',

  // Games
  'games.counter_strike_2': 'Counter-Strike 2',
  'games.valorant': 'Valorant',
  'games.rocket_league': 'Rocket League',
  'games.league_of_legends': 'League of Legends',

  // Skill Levels
  'skill_levels.beginner': 'Beginner',
  'skill_levels.intermediate': 'Intermediate',
  'skill_levels.expert': 'Expert',
  'skill_levels.all_levels': 'All Levels',
} as const

export type TranslationKey = keyof typeof en
