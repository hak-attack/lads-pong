import { useState } from 'react'
import { usePlayers } from '@/hooks/use-players'
import { useMatches } from '@/hooks/use-matches'
import { calculateAllStats } from '@/lib/stats'
import { BottomSheet } from '@/components/bottom-sheet'
import { Avatar } from '@/components/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AddWinDialog } from '@/components/add-win-dialog'
import { AddLossDialog } from '@/components/add-loss-dialog'
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react'

export function Leaderboard() {
  const { players } = usePlayers()
  const { matches } = useMatches()
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
  const [dialogPlayerId, setDialogPlayerId] = useState<string | null>(null)
  const [addWinOpen, setAddWinOpen] = useState(false)
  const [addLossOpen, setAddLossOpen] = useState(false)

  const stats = calculateAllStats(players, matches)
  const selectedPlayer = stats.find((s) => s.player.id === selectedPlayerId)

  return (
    <div className="space-y-2 p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
      </div>

      {stats.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No players yet. Add players to get started!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {stats.map((stat, index) => (
            <Card
              key={stat.player.id}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setSelectedPlayerId(stat.player.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold">
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
          ))}
        </div>
      )}

      <BottomSheet
        open={selectedPlayerId !== null}
        onOpenChange={(open) => !open && setSelectedPlayerId(null)}
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

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => {
                setDialogPlayerId(selectedPlayer.player.id)
                setSelectedPlayerId(null)
                setAddWinOpen(true)
              }}>
                Add Win
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogPlayerId(selectedPlayer.player.id)
                  setSelectedPlayerId(null)
                  setAddLossOpen(true)
                }}
              >
                Add Loss
              </Button>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Record</span>
                <span className="font-semibold">
                  {selectedPlayer.wins}-{selectedPlayer.losses}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Win %</span>
                <span className="font-semibold">
                  {selectedPlayer.winPercentage}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Elo</span>
                <span className="font-semibold">{selectedPlayer.elo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Odds</span>
                <span className="font-semibold">
                  {selectedPlayer.odds.toFixed(2)}x
                </span>
              </div>
            </div>
          </div>
        )}
      </BottomSheet>

      <AddWinDialog
        open={addWinOpen}
        onOpenChange={(open) => {
          setAddWinOpen(open)
          if (!open) setDialogPlayerId(null)
        }}
        playerId={dialogPlayerId || ''}
      />
      <AddLossDialog
        open={addLossOpen}
        onOpenChange={(open) => {
          setAddLossOpen(open)
          if (!open) setDialogPlayerId(null)
        }}
        playerId={dialogPlayerId || ''}
      />
    </div>
  )
}
