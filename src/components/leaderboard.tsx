import { useState } from 'react'
import { usePlayers } from '@/hooks/use-players'
import { useMatches } from '@/hooks/use-matches'
import { calculateAllStats } from '@/lib/stats'
import { Avatar } from '@/components/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { LeaderboardSkeleton } from '@/components/leaderboard-skeleton'
import { Trophy, TrendingUp, TrendingDown, Target, Award, BarChart3, Zap, ChevronDown, ChevronUp } from 'lucide-react'

export function Leaderboard() {
  const { players, loading: playersLoading } = usePlayers()
  const { matches, loading: matchesLoading } = useMatches()
  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null)

  const isLoading = playersLoading || matchesLoading
  const stats = calculateAllStats(players, matches)

  return (
    <div className="space-y-2 p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
      </div>

      {isLoading ? (
        <LeaderboardSkeleton />
      ) : stats.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No players yet. Add players to get started!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {stats.map((stat, index) => {
            const isTopThree = index < 3
            const rankColors = [
              'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-yellow-950 border-yellow-400',
              'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-gray-950 border-gray-400',
              'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-amber-50 border-amber-600',
            ]
            const rankColor = isTopThree ? rankColors[index] : 'bg-muted'
            const rankBorder = isTopThree ? 'border-2' : 'border'
            const isExpanded = expandedPlayerId === stat.player.id

            return (
              <Card
                key={stat.player.id}
                className={`cursor-pointer hover:bg-accent transition-all duration-200 ${
                  isTopThree ? 'shadow-lg' : ''
                } ${isExpanded ? 'shadow-md' : ''}`}
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
                    <div className="font-semibold truncate">
                      {stat.player.name}
                      {stat.player.nickname && (
                        <span className="text-muted-foreground font-normal ml-1">
                          ({stat.player.nickname})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>
                        {stat.wins}-{stat.losses}
                      </span>
                      <span>{stat.winPercentage}%</span>
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        {stat.elo}
                      </span>
                      {stat.streak !== 0 && (
                        <span className="flex items-center gap-1">
                          {stat.streak > 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                          {Math.abs(stat.streak)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right text-sm">
                      <div className="text-muted-foreground">Odds</div>
                      <div className="font-semibold">{stat.odds.toFixed(2)}x</div>
                    </div>
                    <div className="transition-transform duration-300 ease-in-out">
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground transition-all duration-300" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground transition-all duration-300" />
                      )}
                    </div>
                  </div>
                  </div>
                </CardContent>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-4 pb-4 space-y-4">
                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-4 gap-1.5">
                        {/* Record Card */}
                        <Card
                          className={`bg-white dark:bg-card border-0 shadow-sm transition-all duration-300 ease-out ${
                            isExpanded
                              ? 'opacity-100 translate-y-0'
                              : 'opacity-0 -translate-y-2'
                          }`}
                          style={{
                            transitionDelay: isExpanded ? '50ms' : '0ms',
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
                          className={`bg-white dark:bg-card border-0 shadow-sm transition-all duration-300 ease-out ${
                            isExpanded
                              ? 'opacity-100 translate-y-0'
                              : 'opacity-0 -translate-y-2'
                          }`}
                          style={{
                            transitionDelay: isExpanded ? '100ms' : '0ms',
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
                          className={`bg-white dark:bg-card border-0 shadow-sm transition-all duration-300 ease-out ${
                            isExpanded
                              ? 'opacity-100 translate-y-0'
                              : 'opacity-0 -translate-y-2'
                          }`}
                          style={{
                            transitionDelay: isExpanded ? '150ms' : '0ms',
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
                          className={`bg-white dark:bg-card border-0 shadow-sm transition-all duration-300 ease-out ${
                            isExpanded
                              ? 'opacity-100 translate-y-0'
                              : 'opacity-0 -translate-y-2'
                          }`}
                          style={{
                            transitionDelay: isExpanded ? '200ms' : '0ms',
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
            </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
