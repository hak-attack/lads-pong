import { useState } from 'react'
import { usePlayers } from '@/hooks/use-players'
import { useMatches } from '@/hooks/use-matches'
import { calculateAllStats } from '@/lib/stats'
import { BottomSheet } from '@/components/bottom-sheet'
import { Avatar } from '@/components/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AddMatchDialog } from '@/components/add-match-dialog'
import { LeaderboardSkeleton } from '@/components/leaderboard-skeleton'
import { Trophy, TrendingUp, TrendingDown, Target, Award, BarChart3, Zap, Plus } from 'lucide-react'

export function Leaderboard() {
  const { players, loading: playersLoading } = usePlayers()
  const { matches, loading: matchesLoading } = useMatches()
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
  const [addMatchDialogOpen, setAddMatchDialogOpen] = useState(false)

  const isLoading = playersLoading || matchesLoading
  const stats = calculateAllStats(players, matches)
  const selectedPlayer = stats.find((s) => s.player.id === selectedPlayerId)

  return (
    <div className="space-y-2 p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={() => setAddMatchDialogOpen(true)}
        className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg z-50 p-0"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <AddMatchDialog
        open={addMatchDialogOpen}
        onOpenChange={setAddMatchDialogOpen}
      />

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

            return (
              <Card
                key={stat.player.id}
                className={`cursor-pointer hover:bg-accent transition-colors ${
                  isTopThree ? 'shadow-lg' : ''
                }`}
                onClick={() => setSelectedPlayerId(stat.player.id)}
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
                  <div className="text-right text-sm">
                    <div className="text-muted-foreground">Odds</div>
                    <div className="font-semibold">{stat.odds.toFixed(2)}x</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            )
          })}
        </div>
      )}

      <BottomSheet
        open={selectedPlayerId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPlayerId(null)
          }
        }}
      >
        {selectedPlayer && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar
                src={selectedPlayer.player.avatar}
                name={selectedPlayer.player.name}
                size="lg"
              />
              <div>
                <h2 className="text-xl font-bold">{selectedPlayer.player.name}</h2>
                {selectedPlayer.player.nickname && (
                  <p className="text-muted-foreground">
                    {selectedPlayer.player.nickname}
                  </p>
                )}
              </div>
            </div>

                <div className="grid grid-cols-4 gap-1.5 pt-4">
                  {/* Record Card */}
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-2 flex flex-col">
                      <div className="flex items-center gap-1 mb-1">
                        <div className="p-1 rounded-lg bg-blue-500/10 dark:bg-blue-400/20">
                          <Target className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-[9px] font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                          Record
                        </p>
                      </div>
                      <p className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-1">
                        {selectedPlayer.wins}-{selectedPlayer.losses}
                      </p>
                      <div className="flex items-center gap-1 text-[9px] text-blue-600 dark:text-blue-400 mt-auto">
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {selectedPlayer.wins}W
                        </span>
                        <span className="text-blue-400">•</span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          {selectedPlayer.losses}L
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Win % Card */}
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-2 flex flex-col">
                      <div className="flex items-center gap-1 mb-1">
                        <div className="p-1 rounded-lg bg-green-500/10 dark:bg-green-400/20">
                          <BarChart3 className="h-3 w-3 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-[9px] font-medium text-green-700 dark:text-green-300 uppercase tracking-wide">
                          Win %
                        </p>
                      </div>
                      <p className="text-lg font-bold text-green-900 dark:text-green-100 mb-1">
                        {selectedPlayer.winPercentage}%
                      </p>
                      <div className="w-full bg-green-200 dark:bg-green-900/50 rounded-full h-1 overflow-hidden mt-auto flex items-end min-h-[14px]">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(selectedPlayer.winPercentage, 100)}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Elo Card */}
                  <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 border-amber-200 dark:border-amber-800">
                    <CardContent className="p-2 flex flex-col">
                      <div className="flex items-center gap-1 mb-1">
                        <div className="p-1 rounded-lg bg-amber-500/10 dark:bg-amber-400/20">
                          <Award className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                        </div>
                        <p className="text-[9px] font-medium text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                          Elo
                        </p>
                      </div>
                      <p className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-1">
                        {selectedPlayer.elo}
                      </p>
                      <div className="flex items-center gap-0.5 text-[9px] text-amber-600 dark:text-amber-400 mt-auto">
                        <Trophy className="h-2 w-2" />
                        <span>
                          {selectedPlayer.elo >= 1600
                            ? 'Expert'
                            : selectedPlayer.elo >= 1500
                            ? 'Advanced'
                            : selectedPlayer.elo >= 1400
                            ? 'Intermediate'
                            : 'Beginner'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Odds Card */}
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-2 flex flex-col">
                      <div className="flex items-center gap-1 mb-1">
                        <div className="p-1 rounded-lg bg-purple-500/10 dark:bg-purple-400/20">
                          <Zap className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                        </div>
                        <p className="text-[9px] font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                          Odds
                        </p>
                      </div>
                      <p className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-1">
                        {selectedPlayer.odds.toFixed(2)}x
                      </p>
                      <div className="text-[9px] text-purple-600 dark:text-purple-400 mt-auto">
                        <span>
                          {selectedPlayer.odds <= 0.8
                            ? 'Strong Favourite'
                            : selectedPlayer.odds <= 1.0
                            ? 'Favourite'
                            : selectedPlayer.odds <= 1.2
                            ? 'Underdog'
                            : 'Long Shot'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}
