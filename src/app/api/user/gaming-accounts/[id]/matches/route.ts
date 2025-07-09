import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { riotAPI } from '@/lib/riot-api'
import { ApiResponse, authenticate } from '@/lib/api-utils'

// GET /api/user/gaming-accounts/[id]/matches - Get match history for a gaming account
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request)
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    const accountId = params.id

    // Find the gaming account
    const gamingAccount = await prisma.gamingAccount.findFirst({
      where: {
        id: accountId,
        userId: user.id
      }
    })

    if (!gamingAccount) {
      return ApiResponse.error('Gaming account not found', 404)
    }

    // For non-Riot accounts, return empty array
    if (gamingAccount.platform !== 'riot') {
      return ApiResponse.success([], 'Match history not available for this platform')
    }

    if (!gamingAccount.verified) {
      return ApiResponse.error('Account must be verified to fetch match history', 400)
    }

    const metadata = gamingAccount.metadata as any
    if (!metadata?.puuid) {
      return ApiResponse.error('Account PUUID not found. Please re-verify your account.', 400)
    }

    console.log('Fetching match history for:', {
      accountId,
      platform: gamingAccount.platform,
      puuid: metadata.puuid,
      game: metadata.game
    })

    try {
      // Determine the game from metadata
      const game = metadata.game || 'VALORANT'
      
      let transformedMatches = []
      
      if (game === 'VALORANT') {
        console.log('Fetching Valorant match history...')
        // Fetch Valorant match history
        const matchHistory = await riotAPI.getValorantMatchHistory(metadata.puuid)
        console.log('Valorant match history response:', matchHistory)
        
        if (!matchHistory.history || matchHistory.history.length === 0) {
          return ApiResponse.success([], 'No recent matches found')
        }
        
        const matchIds = matchHistory.history.slice(0, 5) // Get last 5 matches for better performance
        console.log(`Fetching details for ${matchIds.length} matches...`)
        
        // Fetch detailed match data
        const detailedMatches = []
        for (const match of matchIds) {
          try {
            console.log(`Fetching match details for: ${match.matchId}`)
            const matchDetails = await riotAPI.getValorantMatch(match.matchId)
            detailedMatches.push(matchDetails)
          } catch (error) {
            console.error(`Failed to fetch match ${match.matchId}:`, error)
            // Continue with other matches instead of failing completely
          }
        }
        
        console.log(`Successfully fetched ${detailedMatches.length} match details`)
        
        // Transform Valorant matches
        transformedMatches = detailedMatches.map((match: any) => {
          // Find the player's stats in the match
          const playerStats = match.players?.find((p: any) => p.puuid === metadata.puuid)
          const playerTeam = match.teams?.find((t: any) => 
            match.players?.some((p: any) => p.puuid === metadata.puuid && p.teamId === t.teamId)
          )
          
          return {
            matchId: match.matchId,
            gameCreation: match.gameStartMillis,
            gameDuration: Math.floor(match.gameLengthMillis / 1000),
            queueId: match.gameMode || 'Competitive',
            mapId: match.mapName || match.mapId,
            result: playerTeam?.won ? 'win' : 'loss',
            score: playerTeam ? `${playerTeam.roundsWon}-${playerTeam.roundsPlayed - playerTeam.roundsWon}` : 'N/A',
            agent: playerStats?.characterId || 'Unknown',
            stats: {
              kills: playerStats?.kills || 0,
              deaths: playerStats?.deaths || 0,
              assists: playerStats?.assists || 0,
              score: playerStats?.score || 0,
              damage: playerStats?.damageDealt || 0
            }
          }
        })
        
      } else if (game === 'LEAGUE_OF_LEGENDS') {
        console.log('Fetching League of Legends match history...')
        // Fetch League of Legends match history
        const matchIds = await riotAPI.getLeagueMatchHistory(metadata.puuid)
        console.log('League match IDs:', matchIds)
        
        if (!matchIds || matchIds.length === 0) {
          return ApiResponse.success([], 'No recent matches found')
        }
        
        const recentMatchIds = matchIds.slice(0, 5) // Get last 5 matches
        console.log(`Fetching details for ${recentMatchIds.length} League matches...`)
        
        // Fetch detailed match data
        const detailedMatches = []
        for (const matchId of recentMatchIds) {
          try {
            console.log(`Fetching League match details for: ${matchId}`)
            const matchDetails = await riotAPI.getLeagueMatch(matchId)
            detailedMatches.push(matchDetails)
          } catch (error) {
            console.error(`Failed to fetch match ${matchId}:`, error)
            // Continue with other matches
          }
        }
        
        console.log(`Successfully fetched ${detailedMatches.length} League match details`)
        
        // Transform League matches
        transformedMatches = detailedMatches.map((match: any) => {
          const participant = match.info?.participants?.find((p: any) => p.puuid === metadata.puuid)
          
          return {
            matchId: match.metadata?.matchId,
            gameCreation: match.info?.gameCreation,
            gameDuration: match.info?.gameDuration,
            queueId: match.info?.queueId?.toString() || 'Ranked',
            mapId: 'Summoner\'s Rift',
            result: participant?.win ? 'win' : 'loss',
            score: `${participant?.kills || 0}/${participant?.deaths || 0}/${participant?.assists || 0}`,
            champion: participant?.championName || 'Unknown',
            stats: {
              kills: participant?.kills || 0,
              deaths: participant?.deaths || 0,
              assists: participant?.assists || 0,
              cs: participant?.totalMinionsKilled || 0,
              damage: participant?.totalDamageDealtToChampions || 0
            }
          }
        })
      } else {
        return ApiResponse.error('Unsupported game for match history', 400)
      }

      console.log(`Returning ${transformedMatches.length} transformed matches`)
      return ApiResponse.success(transformedMatches, 'Match history retrieved successfully')

    } catch (riotError: any) {
      console.error('Riot API error details:', {
        message: riotError.message,
        status: riotError.status,
        response: riotError.response?.data
      })
      
      if (riotError.message.includes('403') || riotError.status === 403) {
        return ApiResponse.error('Unable to access match history. API key may be invalid or expired.', 403)
      } else if (riotError.message.includes('404') || riotError.status === 404) {
        return ApiResponse.error('No match history found for this account.', 404)
      } else if (riotError.message.includes('429') || riotError.status === 429) {
        return ApiResponse.error('Rate limit exceeded. Please try again in a few seconds.', 429)
      } else if (riotError.message.includes('500') || riotError.status >= 500) {
        return ApiResponse.error('Riot servers are currently unavailable. Please try again later.', 500)
      }
      
      // Return empty array instead of error to allow fallback to mock data
      console.warn('Falling back due to Riot API error:', riotError.message)
      return ApiResponse.success([], `Unable to fetch match history: ${riotError.message}`)
    }

  } catch (error) {
    console.error('Match history error:', error)
    return ApiResponse.serverError('An error occurred while fetching match history')
  }
}
