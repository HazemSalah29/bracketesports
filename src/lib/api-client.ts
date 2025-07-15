// API Client for BracketEsports - Frontend to Backend Communication
// Updated to use working Render backend endpoints

const API_BASE_URL = 'https://bracketesports-backend.onrender.com/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
  );
};

// Helper function to make authenticated requests
const makeRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getAuthToken();

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
};

// Authentication API
export const authApi = {
  register: (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) =>
    makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials: { email: string; password: string }) =>
    makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  logout: () => makeRequest('/auth/logout', { method: 'POST' }),
};

// User API
export const userApi = {
  getProfile: () => makeRequest('/users/profile'),

  updateProfile: (data: any) =>
    makeRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getCoinBalance: () => makeRequest('/coins/balance'),

  getUserActivity: (limit?: number) =>
    makeRequest(`/users/activity${limit ? `?limit=${limit}` : ''}`),

  getLeaderboard: (limit?: number) =>
    makeRequest(`/users/leaderboard${limit ? `?limit=${limit}` : ''}`),

  addGamingAccount: (accountData: {
    platform: string;
    username: string;
    platformId: string;
  }) =>
    makeRequest('/users/gaming-accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    }),

  getGamingAccounts: () => makeRequest('/users/gaming-accounts'),

  deleteGamingAccount: (accountId: string) =>
    makeRequest(`/users/gaming-accounts/${accountId}`, {
      method: 'DELETE',
    }),
};

// Tournament API
export const tournamentApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    game?: string;
  }) => {
    const query = params ? new URLSearchParams(params as any).toString() : '';
    return makeRequest(`/tournaments${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => makeRequest(`/tournaments/${id}`),

  create: (tournamentData: any) =>
    makeRequest('/tournaments', {
      method: 'POST',
      body: JSON.stringify(tournamentData),
    }),

  update: (id: string, data: any) =>
    makeRequest(`/tournaments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    makeRequest(`/tournaments/${id}`, { method: 'DELETE' }),

  join: (id: string) =>
    makeRequest(`/tournaments/${id}/join`, { method: 'POST' }),

  leave: (id: string) =>
    makeRequest(`/tournaments/${id}/leave`, { method: 'POST' }),
};

// Creator API
export const creatorApi = {
  apply: (applicationData: {
    organizationName?: string;
    experience: string;
    references?: string;
    motivation: string;
  }) =>
    makeRequest('/creator/apply', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    }),

  getAnalytics: () => makeRequest('/creator/analytics'),

  getEarnings: () => makeRequest('/creator/earnings'),
};

// Analytics API
export const analyticsApi = {
  getPlatformStats: () => makeRequest('/analytics/platform'),

  getUserAnalytics: () => makeRequest('/analytics/user'),

  getCreatorDashboard: () => makeRequest('/analytics/creator-dashboard'),

  getTournamentStats: () => makeRequest('/analytics/tournaments'),
};

// Coins API
export const coinsApi = {
  getBalance: () => makeRequest('/coins/balance'),

  getPackages: () => makeRequest('/coins/packages'),

  getExchangeRate: () => makeRequest('/coins/exchange-rate'),

  purchaseCoins: (data: { packageId: string }) =>
    makeRequest('/coins/purchase', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getHistory: (limit?: number) =>
    makeRequest(`/coins/history${limit ? `?limit=${limit}` : ''}`),

  transferCoins: (toUserId: string, amount: number) =>
    makeRequest('/coins/transfer', {
      method: 'POST',
      body: JSON.stringify({ toUserId, amount }),
    }),
};

// Teams API
export const teamsApi = {
  getAll: () => makeRequest('/teams'),

  getById: (id: string) => makeRequest(`/teams/${id}`),

  create: (teamData: any) =>
    makeRequest('/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    }),

  join: (id: string) => makeRequest(`/teams/${id}/join`, { method: 'POST' }),

  leave: (id: string) => makeRequest(`/teams/${id}/leave`, { method: 'POST' }),
};

// Health API
export const healthApi = {
  check: () => makeRequest('/health'),
};

// Riot API
export const riotApi = {
  verifyAccount: (data: { username: string; tagline: string; game: string }) =>
    makeRequest('/riot/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Combined API client object
export const apiClient = {
  auth: authApi,
  user: userApi,
  tournament: tournamentApi,
  creator: creatorApi,
  analytics: analyticsApi,
  coins: coinsApi,
  teams: teamsApi,
  health: healthApi,
  riot: riotApi,

  // Legacy methods for backward compatibility
  login: authApi.login,
  register: authApi.register,
  logout: authApi.logout,
  getProfile: userApi.getProfile,
  getCoinBalance: coinsApi.getBalance,
  getUserActivity: userApi.getUserActivity,
  getTournaments: tournamentApi.getAll,
  joinTournament: tournamentApi.join,
  getTeams: teamsApi.getAll,
  getGamingAccounts: userApi.getGamingAccounts,
  addGamingAccount: userApi.addGamingAccount,
  deleteGamingAccount: userApi.deleteGamingAccount,
  purchaseCoins: coinsApi.purchaseCoins,
};

export default apiClient;
