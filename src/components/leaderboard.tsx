import { useState } from 'react'
import { usePlayers } from '@/hooks/use-players'
import { useMatches } from '@/hooks/use-matches'
import { calculateAllStats } from '@/lib/stats'
import { Avatar } from '@/components/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { LeaderboardSkeleton } from '@/components/leaderboard-skeleton'
import { MatchesSkeleton } from '@/components/matches-skeleton'
import { Button } from '@/components/ui/button'
import { Trophy, TrendingUp, TrendingDown, Target, Award, BarChart3, Zap, ChevronDown, Plus } from 'lucide-react'
import { getFadeInDelayClass } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface LeaderboardProps {
  onAddMatchClick?: () => void
}

type Tab = 'standings' | 'matches'

export function Leaderboard({ onAddMatchClick }: LeaderboardProps) {
  const { players, loading: playersLoading } = usePlayers()
  const { matches, loading: matchesLoading } = useMatches()
  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('standings')

  const isLoading = playersLoading || matchesLoading
  const stats = calculateAllStats(players, matches)
  const getPlayer = (id: string) => players.find((p) => p.id === id)

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        {onAddMatchClick && (
          <Button onClick={onAddMatchClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add Match
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1 border rounded-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <button
          onClick={() => setActiveTab('standings')}
          className={cn(
            'flex-1 px-4 py-3 text-sm font-medium transition-all rounded-full',
            activeTab === 'standings'
              ? 'text-primary bg-accent'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
          )}
        >
          Standings
        </button>
        <button
          onClick={() => setActiveTab('matches')}
          className={cn(
            'flex-1 px-4 py-2 text-sm font-medium transition-all rounded-full',
            activeTab === 'matches'
              ? 'text-primary bg-accent'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
          )}
        >
          Matches
        </button>
      </div>

      {/* Standings Tab Content */}
      {activeTab === 'standings' && (
        <div>
          {isLoading ? (
            <LeaderboardSkeleton />
          ) : stats.length === 0 ? (
            <Card className="animate-fade-in-up border-0">
              <CardContent className="p-6 text-center text-muted-foreground">
                No players yet. Add players to get started!
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {stats.map((stat, index) => {
            const delayClass = getFadeInDelayClass(index)
            const isTopThree = index < 3
            const rankColors = [
              'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
              'bg-gray-400/20 text-gray-700 dark:text-gray-300 border-gray-400/30',
              'bg-amber-600/20 text-amber-700 dark:text-amber-400 border-amber-600/30',
            ]
            const rankColor = isTopThree ? rankColors[index] : 'bg-muted'
            const rankBorder = 'border'
            const isExpanded = expandedPlayerId === stat.player.id

            return (
              <Card
                key={stat.player.id}
                className={`cursor-pointer hover:bg-accent transition-all duration-200 border-0 ${
                  isTopThree ? 'shadow-lg' : ''
                } ${isExpanded ? 'shadow-md' : ''} ${delayClass}`}
                onClick={() => setExpandedPlayerId(isExpanded ? null : stat.player.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${rankColor} ${rankBorder}`}
                      >
                        {index + 1}
                      </div>
                    </div>
                  <Avatar
                    src={stat.player.avatar}
                    name={stat.player.name}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 font-semibold truncate">
                      <span>{stat.player.name}</span>
                      {stat.streak !== 0 && (
                        <span className="flex items-center gap-1 text-xs">
                          {stat.streak > 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                          {Math.abs(stat.streak)}
                        </span>
                      )}
                    </div>
                    {stat.player.nickname && (
                      <div className="text-xs text-muted-foreground truncate">
                        {stat.player.nickname}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right text-sm">
                      <div className="text-muted-foreground">Odds</div>
                      <div className="font-semibold">{stat.odds.toFixed(2)}x</div>
                    </div>
                    <div className="transition-transform duration-300 ease-in-out">
                      <div className={`transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  </div>
                </CardContent>
                
                <div
                  className={`expand-collapse-grid ${isExpanded ? 'expanded' : ''}`}
                >
                  <div className="expand-collapse-content">
                    <div className="px-4 pb-4 space-y-4">
                      <div className="pt-4 border-t">
                        <div className="grid grid-cols-4 gap-1.5">
                          {/* Record Card */}
                          <Card
                            key={`${stat.player.id}-record`}
                            className={`bg-white dark:bg-card border-0 shadow-sm ${
                              isExpanded ? 'animate-fade-in-up' : ''
                            }`}
                            style={{
                              animationDelay: isExpanded ? '0ms' : '0ms',
                            }}
                          >
                          <CardContent className="p-2 flex flex-col">
                            <div className="flex items-center gap-1 mb-1">
                              <div className="p-1 rounded-lg bg-primary/10 dark:bg-primary/20">
                                <Target className="h-3 w-3 text-primary" />
                              </div>
                              <p className="text-[9px] font-medium text-primary/80 dark:text-primary/70 uppercase tracking-wide">
                                Record
                              </p>
                            </div>
                            <p className="text-lg font-bold text-primary dark:text-primary mb-1">
                              {stat.wins}-{stat.losses}
                            </p>
                            <div className="flex items-center gap-1 text-[9px] text-primary/70 dark:text-primary/60 mt-auto">
                              <span className="font-medium text-primary/80 dark:text-primary/70">
                                {stat.wins}W
                              </span>
                              <span className="text-primary/40">•</span>
                              <span className="font-medium text-primary/80 dark:text-primary/70">
                                {stat.losses}L
                              </span>
                            </div>
                          </CardContent>
                          </Card>

                          {/* Win % Card */}
                          <Card
                            key={`${stat.player.id}-winpct`}
                            className={`bg-white dark:bg-card border-0 shadow-sm ${
                              isExpanded ? 'animate-fade-in-up-delay-1' : ''
                            }`}
                            style={{
                              animationDelay: isExpanded ? '100ms' : '0ms',
                            }}
                          >
                          <CardContent className="p-2 flex flex-col">
                            <div className="flex items-center gap-1 mb-1">
                              <div className="p-1 rounded-lg bg-primary/10 dark:bg-primary/20">
                                <BarChart3 className="h-3 w-3 text-primary" />
                              </div>
                              <p className="text-[9px] font-medium text-primary/80 dark:text-primary/70 uppercase tracking-wide">
                                Win %
                              </p>
                            </div>
                            <p className="text-lg font-bold text-primary dark:text-primary mb-1">
                              {stat.winPercentage}%
                            </p>
                            <div className="w-full bg-primary/10 dark:bg-primary/20 rounded-full h-1 overflow-hidden mt-auto flex items-end min-h-[14px]">
                              <div
                                className="h-full bg-primary rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(stat.winPercentage, 100)}%` }}
                              />
                            </div>
                          </CardContent>
                        </Card>

                          {/* Elo Card */}
                          <Card
                            key={`${stat.player.id}-elo`}
                            className={`bg-white dark:bg-card border-0 shadow-sm ${
                              isExpanded ? 'animate-fade-in-up-delay-2' : ''
                            }`}
                            style={{
                              animationDelay: isExpanded ? '200ms' : '0ms',
                            }}
                          >
                          <CardContent className="p-2 flex flex-col">
                            <div className="flex items-center gap-1 mb-1">
                              <div className="p-1 rounded-lg bg-primary/10 dark:bg-primary/20">
                                <Award className="h-3 w-3 text-primary" />
                              </div>
                              <p className="text-[9px] font-medium text-primary/80 dark:text-primary/70 uppercase tracking-wide">
                                Elo
                              </p>
                            </div>
                            <p className="text-lg font-bold text-primary dark:text-primary mb-1">
                              {stat.elo}
                            </p>
                            <div className="flex items-center gap-0.5 text-[9px] text-primary/70 dark:text-primary/60 mt-auto">
                              <Trophy className="h-2 w-2" />
                              <span>
                                {stat.elo >= 1600
                                  ? 'Expert'
                                  : stat.elo >= 1500
                                  ? 'Advanced'
                                  : stat.elo >= 1400
                                  ? 'Intermediate'
                                  : 'Beginner'}
                              </span>
                            </div>
                          </CardContent>
                        </Card>

                          {/* Odds Card */}
                          <Card
                            key={`${stat.player.id}-odds`}
                            className={`bg-white dark:bg-card border-0 shadow-sm ${
                              isExpanded ? 'animate-fade-in-up-delay-3' : ''
                            }`}
                            style={{
                              animationDelay: isExpanded ? '300ms' : '0ms',
                            }}
                          >
                          <CardContent className="p-2 flex flex-col">
                            <div className="flex items-center gap-1 mb-1">
                              <div className="p-1 rounded-lg bg-primary/10 dark:bg-primary/20">
                                <Zap className="h-3 w-3 text-primary" />
                              </div>
                              <p className="text-[9px] font-medium text-primary/80 dark:text-primary/70 uppercase tracking-wide">
                                Odds
                              </p>
                            </div>
                            <p className="text-lg font-bold text-primary dark:text-primary mb-1">
                              {stat.odds.toFixed(2)}x
                            </p>
                            <div className="text-[9px] text-primary/70 dark:text-primary/60 mt-auto">
                              <span>
                                {stat.odds <= 0.8
                                  ? 'Strong Favourite'
                                  : stat.odds <= 1.0
                                  ? 'Favourite'
                                  : stat.odds <= 1.2
                                  ? 'Underdog'
                                  : 'Long Shot'}
                              </span>
                            </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </Card>
            )
          })}
        </div>
          )}
        </div>
      )}

      {/* Matches Tab Content */}
      {activeTab === 'matches' && (
        <div>
          {isLoading ? (
            <MatchesSkeleton />
          ) : matches.length === 0 ? (
            <Card className="animate-fade-in-up border-0">
              <CardContent className="p-6 text-center text-muted-foreground">
                No matches yet. Record some games to see them here!
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {matches.map((match, index) => {
                const delayClass = getFadeInDelayClass(index + 1)
                const winner = getPlayer(match.winnerId)
                const loser = getPlayer(match.loserId)

                if (!winner || !loser) return null

                return (
                  <Card key={match.id} className={`${delayClass} border-0`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Avatar
                              src={winner.avatar}
                              name={winner.name}
                              size="sm"
                            />
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span className="font-semibold truncate">
                                {winner.name}
                              </span>
                              <Trophy className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                            </div>
                          </div>
                          <span className="text-muted-foreground mx-2">vs</span>
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Avatar
                              src={loser.avatar}
                              name={loser.name}
                              size="sm"
                            />
                            <span className="font-medium truncate">
                              {loser.name}
                            </span>
                          </div>
                          <div className="text-center mx-2 flex-shrink-0">
                            <div className="text-lg font-bold">
                              {match.setsWonByWinner}-{match.setsWonByLoser}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {match.winnerScore}-{match.loserScore}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(match.playedAt, { addSuffix: true })}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
