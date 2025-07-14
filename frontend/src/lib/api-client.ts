// API Client for BracketEsports - Frontend to Backend Communication
// Replaces Prisma direct database calls with HTTP API calls

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
    makeRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials: { email: string; password: string }) =>
    makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  logout: () => makeRequest('/api/auth/logout', { method: 'POST' }),
};

// User API
export const userApi = {
  getProfile: () => makeRequest('/api/users/me'),

  updateProfile: (data: any) =>
    makeRequest('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getCoinBalance: () => makeRequest('/api/users/coins/balance'),

  getUserActivity: (limit?: number) =>
    makeRequest(`/api/users/activity${limit ? `?limit=${limit}` : ''}`),

  getLeaderboard: (limit?: number) =>
    makeRequest(`/api/users/leaderboard${limit ? `?limit=${limit}` : ''}`),

  addGamingAccount: (accountData: {
    platform: string;
    username: string;
    platformId: string;
  }) =>
    makeRequest('/api/users/gaming-accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    }),

  getGamingAccounts: () => makeRequest('/api/users/gaming-accounts'),

  deleteGamingAccount: (accountId: string) =>
    makeRequest(`/api/users/gaming-accounts/${accountId}`, {
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
    return makeRequest(`/api/tournaments${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => makeRequest(`/api/tournaments/${id}`),

  create: (tournamentData: any) =>
    makeRequest('/api/tournaments', {
      method: 'POST',
      body: JSON.stringify(tournamentData),
    }),

  update: (id: string, data: any) =>
    makeRequest(`/api/tournaments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    makeRequest(`/api/tournaments/${id}`, { method: 'DELETE' }),

  join: (id: string) =>
    makeRequest(`/api/tournaments/${id}/join`, { method: 'POST' }),

  leave: (id: string) =>
    makeRequest(`/api/tournaments/${id}/leave`, { method: 'POST' }),
};

// Creator API
export const creatorApi = {
  apply: (applicationData: {
    organizationName?: string;
    experience: string;
    references?: string;
    motivation: string;
  }) =>
    makeRequest('/api/creator/apply', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    }),

  getAnalytics: () => makeRequest('/api/creator/analytics'),

  getEarnings: () => makeRequest('/api/creator/earnings'),
};

// Analytics API
export const analyticsApi = {
  getPlatformStats: () => makeRequest('/api/analytics/platform'),

  getUserAnalytics: () => makeRequest('/api/analytics/user'),

  getCreatorDashboard: () => makeRequest('/api/analytics/creator-dashboard'),

  getTournamentStats: () => makeRequest('/api/analytics/tournaments'),
};

// Coins API
export const coinsApi = {
  getBalance: () => makeRequest('/api/users/coins/balance'),

  purchaseCoins: (data: { packageId: string }) =>
    makeRequest('/api/coins/purchase', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Teams API
export const teamsApi = {
  getAll: () => makeRequest('/api/teams'),

  getById: (id: string) => makeRequest(`/api/teams/${id}`),

  create: (teamData: any) =>
    makeRequest('/api/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    }),

  join: (id: string) =>
    makeRequest(`/api/teams/${id}/join`, { method: 'POST' }),

  leave: (id: string) =>
    makeRequest(`/api/teams/${id}/leave`, { method: 'POST' }),
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
