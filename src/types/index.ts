export interface Player {
  id: string
  name: string
  nickname?: string
  avatar?: string
  active: boolean
  createdAt: Date
}

export interface Match {
  id: string
  winnerId: string
  loserId: string
  winnerScore: number // Last set score for winner
  loserScore: number // Last set score for loser
  setsWonByWinner: number // Total sets won by winner
  setsWonByLoser: number // Total sets won by loser
  numberOfSets: number // 3 or 5
  scorePerSet: number // 11 or 21
  playedAt: Date
  createdBy: string
  status: 'completed'
}

export interface PlayerStats {
  player: Player
  wins: number
  losses: number
  winPercentage: number
  elo: number
  odds: number
  streak: number
}
