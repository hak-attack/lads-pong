import { useState } from 'react'
import { useMatches } from '@/hooks/use-matches'
import { usePlayers } from '@/hooks/use-players'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/avatar'
import { MatchesSkeleton } from '@/components/matches-skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Trash2, Trophy, Edit } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { getFadeInDelayClass } from '@/lib/utils'
import type { Match } from '@/types'

export function Matches() {
  const { matches, loading: matchesLoading, deleteMatch, updateMatch } = useMatches()
  const { players, loading: playersLoading } = usePlayers()
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState<string | null>(null)
  const [editingMatch, setEditingMatch] = useState<Match | null>(null)
  const [numberOfSets, setNumberOfSets] = useState<string>('3')
  const [scorePerSet, setScorePerSet] = useState<string>('11')
  const [winnerScore, setWinnerScore] = useState<string>('')
  const [loserScore, setLoserScore] = useState<string>('')
  const [setsWonByLoser, setSetsWonByLoser] = useState<string>('')
  const [deleting, setDeleting] = useState(false)
  const [updating, setUpdating] = useState(false)

  // Reset sets won by loser when numberOfSets changes
  const handleNumberOfSetsChange = (value: string) => {
    setNumberOfSets(value)
    if (value === '1') {
      setSetsWonByLoser('0')
    } else if (parseInt(value) < parseInt(numberOfSets)) {
      // If reducing sets, ensure loser sets is still valid
      const maxLoserSets = Math.floor(parseInt(value) / 2)
      if (parseInt(setsWonByLoser) > maxLoserSets) {
        setSetsWonByLoser(maxLoserSets.toString())
      }
    }
  }

  const isLoading = matchesLoading || playersLoading
  const getPlayer = (id: string) => players.find((p) => p.id === id)

  const handleDelete = async (matchId: string) => {
    setDeleting(true)
    try {
      await deleteMatch(matchId)
      toast({
        title: 'Match deleted',
        description: 'The match has been removed',
      })
      setDeleteDialogOpen(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete match',
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
    }
  }

  const handleEditClick = (match: Match) => {
    setEditingMatch(match)
    setNumberOfSets(match.numberOfSets.toString())
    setScorePerSet(match.scorePerSet.toString())
    setWinnerScore(match.winnerScore.toString())
    setLoserScore(match.loserScore.toString())
    setSetsWonByLoser(match.setsWonByLoser.toString())
    setEditDialogOpen(match.id)
  }

  const handleUpdate = async () => {
    if (!editingMatch) return

    const winnerScoreNum = parseInt(winnerScore, 10)
    const loserScoreNum = parseInt(loserScore, 10)
    const setsWonByLoserNum = parseInt(setsWonByLoser, 10)
    const numberOfSetsNum = parseInt(numberOfSets, 10)
    const scorePerSetNum = parseInt(scorePerSet, 10)

    // Calculate winner sets automatically (minimum required to win)
    const setsWonByWinnerNum = Math.ceil(numberOfSetsNum / 2)

    if (isNaN(winnerScoreNum) || isNaN(loserScoreNum) || winnerScoreNum < 0 || loserScoreNum < 0) {
      toast({
        title: 'Invalid score',
        description: 'Please enter valid last set scores (non-negative numbers)',
        variant: 'destructive',
      })
      return
    }

    if (winnerScoreNum <= loserScoreNum) {
      toast({
        title: 'Invalid score',
        description: 'Winner score must be greater than loser score in the last set',
        variant: 'destructive',
      })
      return
    }

    if (winnerScoreNum > scorePerSetNum || loserScoreNum > scorePerSetNum) {
      toast({
        title: 'Invalid score',
        description: `Last set scores cannot exceed ${scorePerSetNum}`,
        variant: 'destructive',
      })
      return
    }

    if (isNaN(setsWonByLoserNum) || setsWonByLoserNum < 0) {
      toast({
        title: 'Invalid sets',
        description: 'Please enter valid number of sets won by loser',
        variant: 'destructive',
      })
      return
    }

    // For 1 set matches, loser always has 0 sets
    if (numberOfSetsNum === 1) {
      if (setsWonByLoserNum !== 0) {
        toast({
          title: 'Invalid sets',
          description: 'In a 1 set match, the loser must have 0 sets',
          variant: 'destructive',
        })
        return
      }
    } else {
      const maxLoserSets = Math.floor(numberOfSetsNum / 2)
      if (setsWonByLoserNum > maxLoserSets) {
        toast({
          title: 'Invalid sets',
          description: `Loser cannot have won more than ${maxLoserSets} sets in a best of ${numberOfSetsNum} match`,
          variant: 'destructive',
        })
        return
      }
    }

    setUpdating(true)
    try {
      await updateMatch(
        editingMatch.id,
        winnerScoreNum,
        loserScoreNum,
        setsWonByWinnerNum,
        setsWonByLoserNum,
        numberOfSetsNum,
        scorePerSetNum
      )
      toast({
        title: 'Score updated',
        description: 'The match score has been updated',
      })
      setEditDialogOpen(null)
      setEditingMatch(null)
      setNumberOfSets('3')
      setScorePerSet('11')
      setWinnerScore('')
      setLoserScore('')
      setSetsWonByLoser('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update score',
        variant: 'destructive',
      })
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="space-y-2 p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Matches</h1>
      </div>

      {isLoading ? (
        <MatchesSkeleton />
      ) : matches.length === 0 ? (
        <Card className="animate-fade-in-up-delay-1 border-0">
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
                    <div className="flex gap-1 ml-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(match)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteDialogOpen(match.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

      <Dialog
        open={deleteDialogOpen !== null}
        onOpenChange={(open) => !open && setDeleteDialogOpen(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Match</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this match? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteDialogOpen && handleDelete(deleteDialogOpen)
              }
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editDialogOpen !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditDialogOpen(null)
            setEditingMatch(null)
            setNumberOfSets('3')
            setScorePerSet('11')
            setWinnerScore('')
            setLoserScore('')
            setSetsWonByLoser('')
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Score</DialogTitle>
            <DialogDescription>
              Update the game scores for this match
            </DialogDescription>
          </DialogHeader>
          {editingMatch && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 flex-1">
                  <Avatar
                    src={getPlayer(editingMatch.winnerId)?.avatar}
                    name={getPlayer(editingMatch.winnerId)?.name || ''}
                    size="sm"
                  />
                  <span className="font-semibold">
                    {getPlayer(editingMatch.winnerId)?.name}
                  </span>
                </div>
                <span className="text-muted-foreground">vs</span>
                <div className="flex items-center gap-2 flex-1">
                  <Avatar
                    src={getPlayer(editingMatch.loserId)?.avatar}
                    name={getPlayer(editingMatch.loserId)?.name || ''}
                    size="sm"
                  />
                  <span className="font-medium">
                    {getPlayer(editingMatch.loserId)?.name}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Number of Sets
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[1, 3, 5].map((num) => (
                      <Button
                        key={num}
                        type="button"
                        variant={numberOfSets === num.toString() ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleNumberOfSetsChange(num.toString())}
                      >
                        {num} {num === 1 ? 'Set' : 'Sets'}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Score Per Set
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[11, 21].map((num) => (
                      <Button
                        key={num}
                        type="button"
                        variant={scorePerSet === num.toString() ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setScorePerSet(num.toString())}
                      >
                        First to {num}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {getPlayer(editingMatch.winnerId)?.name} Last Set Score
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max={scorePerSet}
                    value={winnerScore}
                    onChange={(e) => setWinnerScore(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {getPlayer(editingMatch.loserId)?.name} Last Set Score
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max={scorePerSet}
                    value={loserScore}
                    onChange={(e) => setLoserScore(e.target.value)}
                  />
                </div>
              </div>
              {parseInt(numberOfSets) > 1 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Sets Won by {getPlayer(editingMatch.loserId)?.name}
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: Math.floor(parseInt(numberOfSets) / 2) + 1 }, (_, i) => i).map((num) => (
                      <Button
                        key={num}
                        type="button"
                        variant={setsWonByLoser === num.toString() ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSetsWonByLoser(num.toString())}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditDialogOpen(null)
                    setEditingMatch(null)
                    setNumberOfSets('3')
                    setScorePerSet('11')
                    setWinnerScore('')
                    setLoserScore('')
                    setSetsWonByLoser('')
                  }}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={updating}>
                  {updating ? 'Updating...' : 'Update Score'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
