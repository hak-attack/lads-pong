import { useState } from 'react'
import { useMatches } from '@/hooks/use-matches'
import { usePlayers } from '@/hooks/use-players'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/avatar'
import { MatchesSkeleton } from '@/components/matches-skeleton'
import { Trophy } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { getFadeInDelayClass } from '@/lib/utils'

export function Lobby() {
  const { matches, loading: matchesLoading } = useMatches()
  const { players, loading: playersLoading } = usePlayers()
  const [displayCount, setDisplayCount] = useState(3)

  const isLoading = matchesLoading || playersLoading
  const getPlayer = (id: string) => players.find((p) => p.id === id)
  const displayedMatches = matches.slice(0, displayCount)
  const hasMoreMatches = matches.length > displayCount

  return (
    <div className="space-y-2 p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Lobby</h1>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-4">Latest matches</h2>
        </div>

        {isLoading ? (
          <MatchesSkeleton />
        ) : matches.length === 0 ? (
          <Card className="animate-fade-in-up-delay-2 border-0">
            <CardContent className="p-6 text-center text-muted-foreground">
              No matches yet. Record some games to see them here!
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-2">
              {displayedMatches.map((match, index) => {
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

            {hasMoreMatches && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="secondary"
                  onClick={() => setDisplayCount(displayCount + 3)}
                >
                  Load more
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
