// Riot Games API Client - Frontend Interface
// SECURITY COMPLIANCE: All Riot API calls must go through backend
// Frontend never directly accesses Riot APIs to protect API keys

import { apiClient } from './api-client'

// WARNING: DO NOT ADD RIOT API KEYS TO FRONTEND CODE
// This violates Riot Games API policies and exposes sensitive credentials

// Riot Games API Interfaces
export interface RiotAccount {
  puuid: string
  gameName: string
  tagLine: string
}

export interface ValorantPlayerStats {
  puuid: string
  kills: number
  deaths: number
  assists: number
  score: number
  roundsPlayed: number
  roundsWon: number
  headshots: number
  bodyshots: number
  legshots: number
  damageDealt: number
  damageReceived: number
}

export interface LeaguePlayerStats {
  puuid: string
  summonerId: string
  summonerName: string
  profileIconId: number
  summonerLevel: number
  kills: number
  deaths: number
  assists: number
  win: boolean
  championId: number
  championName: string
  role: string
  lane: string
}

// SECURITY COMPLIANT: Frontend proxy to backend Riot API
// NO API KEYS IN FRONTEND - All Riot API calls go through backend
class RiotAPIProxy {
  /**
   * Verify a Riot account through secure backend API
   * COMPLIANT: No direct Riot API access from frontend
   */
  async verifyAccount(data: { username: string; tagline: string; game: string }) {
    try {
      return await apiClient.riot.verifyAccount(data);
    } catch (error) {
      console.error('Account verification failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Account verification failed'
      };
    }
  }

  /**
   * Get player profile through backend API
   * SECURE: Backend handles all Riot API authentication
   */
  async getPlayerProfile(puuid: string) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`https://bracketesports-backend.onrender.com/api/riot/player/${puuid}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get player profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get player profile'
      };
    }
  }

  /**
   * Get player match history through backend API
   * SECURE: All Riot API interactions go through backend
   */
  async getPlayerMatches(puuid: string, game: 'valorant' | 'lol', count: number = 5) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`https://bracketesports-backend.onrender.com/api/riot/matches/${puuid}?game=${game}&count=${count}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get player matches:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get player matches'
      };
    }
  }

  /**
   * Get player stats for tournaments through backend API
   * POLICY COMPLIANT: No direct Riot API access, no MMR calculations
   */
  async getPlayerStats(puuid: string, game: 'valorant' | 'lol', matchCount: number = 10) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`https://bracketesports-backend.onrender.com/api/riot/stats/${puuid}?game=${game}&count=${matchCount}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get player stats:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get player stats'
      };
    }
  }
}

// Export singleton instance
export const riotAPI = new RiotAPIProxy();

// Default export for backward compatibility
export default riotAPI;

// POLICY COMPLIANCE NOTES:
// ✅ No API keys in frontend code
// ✅ All Riot API calls go through backend
// ✅ No MMR/ELO calculations
// ✅ Focus on positive player experience
// ✅ Tournament stats only, no ranking alternatives