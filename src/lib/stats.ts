import type { Player, Match, PlayerStats } from '@/types'

const INITIAL_ELO = 1500
const K_FACTOR = 32

export function calculateElo(winnerElo: number, loserElo: number): { newWinnerElo: number; newLoserElo: number } {
  const expectedWinner = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400))
  const expectedLoser = 1 / (1 + Math.pow(10, (winnerElo - loserElo) / 400))

  const newWinnerElo = winnerElo + K_FACTOR * (1 - expectedWinner)
  const newLoserElo = loserElo + K_FACTOR * (0 - expectedLoser)

  return {
    newWinnerElo: Math.round(newWinnerElo),
    newLoserElo: Math.round(newLoserElo),
  }
}

export function calculatePlayerStats(
  player: Player,
  matches: Match[]
): Omit<PlayerStats, 'player'> {
  const playerMatches = matches.filter(
    (m) => m.winnerId === player.id || m.loserId === player.id
  )

  let wins = 0
  let losses = 0
  let gamesWon = 0
  let gamesLost = 0
  let currentElo = INITIAL_ELO
  let streak = 0
  let lastResult: 'win' | 'loss' | null = null

  // Process matches chronologically to calculate Elo and streak
  const sortedMatches = [...playerMatches].sort(
    (a, b) => a.playedAt.getTime() - b.playedAt.getTime()
  )

  for (const match of sortedMatches) {
    const isWinner = match.winnerId === player.id
    const isLoser = match.loserId === player.id

    if (isWinner) {
      wins++
      gamesWon += match.setsWonByWinner
      gamesLost += match.setsWonByLoser
      // Calculate Elo assuming opponent has INITIAL_ELO (simplified)
      // In a real system, you'd track opponent Elo at match time
      const opponentElo = INITIAL_ELO
      const { newWinnerElo } = calculateElo(currentElo, opponentElo)
      currentElo = newWinnerElo

      if (lastResult === 'win') {
        streak = streak > 0 ? streak + 1 : 1
      } else {
        streak = 1
      }
      lastResult = 'win'
    } else if (isLoser) {
      losses++
      gamesWon += match.setsWonByLoser
      gamesLost += match.setsWonByWinner
      const opponentElo = INITIAL_ELO
      const { newLoserElo } = calculateElo(opponentElo, currentElo)
      currentElo = newLoserElo

      if (lastResult === 'loss') {
        streak = streak < 0 ? streak - 1 : -1
      } else {
        streak = -1
      }
      lastResult = 'loss'
    }
  }

  const totalGames = gamesWon + gamesLost
  const winPercentage = totalGames > 0 ? (gamesWon / totalGames) * 100 : 0

  // Calculate odds vs field average
  // Using inverted power function to make odds more sensitive to Elo changes
  // Formula: odds = (averageElo / playerElo)^5
  // Better players (higher Elo) = lower odds (favorites)
  // Worse players (lower Elo) = higher odds (underdogs)
  // Power of 5 provides strong sensitivity without being extreme
  const allPlayers = new Set<string>()
  matches.forEach((m) => {
    allPlayers.add(m.winnerId)
    allPlayers.add(m.loserId)
  })

  // For simplicity, assume average Elo is INITIAL_ELO
  // In production, calculate actual average from all players
  const averageElo = INITIAL_ELO
  const baseRatio = currentElo > 0 ? averageElo / currentElo : 1
  // Apply power function to make odds change more drastically (power of 5 for strong sensitivity)
  const odds = Math.pow(baseRatio, 5)

  return {
    wins,
    losses,
    winPercentage: Math.round(winPercentage * 10) / 10,
    elo: currentElo,
    odds: Math.round(odds * 100) / 100,
    streak,
  }
}

export function calculateAllStats(
  players: Player[],
  matches: Match[]
): PlayerStats[] {
  return players
    .filter((p) => p.active)
    .map((player) => ({
      player,
      ...calculatePlayerStats(player, matches),
    }))
    .sort((a, b) => b.elo - a.elo)
}
