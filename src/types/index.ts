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
