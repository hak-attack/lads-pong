import { useState } from 'react'
import { useMatches } from '@/hooks/use-matches'
import { usePlayers } from '@/hooks/use-players'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Trash2, Trophy } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export function Matches() {
  const { matches, deleteMatch } = useMatches()
  const { players } = usePlayers()
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

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

  return (
    <div className="space-y-2 p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Matches</h1>
      </div>

      {matches.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No matches yet. Record some games to see them here!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {matches.map((match) => {
            const winner = getPlayer(match.winnerId)
            const loser = getPlayer(match.loserId)

            if (!winner || !loser) return null

            return (
              <Card key={match.id}>
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
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 flex-shrink-0"
                      onClick={() => setDeleteDialogOpen(match.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
    </div>
  )
}
