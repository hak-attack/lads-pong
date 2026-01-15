import { useState } from 'react'
import { usePlayers } from '@/hooks/use-players'
import { useMatches } from '@/hooks/use-matches'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar } from '@/components/avatar'

interface AddWinDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  playerId: string
}

export function AddWinDialog({
  open,
  onOpenChange,
  playerId,
}: AddWinDialogProps) {
  const { players } = usePlayers()
  const { addMatch } = useMatches()
  const { toast } = useToast()
  const [opponentId, setOpponentId] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const player = players.find((p) => p.id === playerId)
  const opponents = players.filter(
    (p) => p.id !== playerId && p.active
  )

  const handleSubmit = async () => {
    if (!opponentId) return

    setLoading(true)
    try {
      await addMatch(playerId, opponentId)
      toast({
        title: 'Win recorded!',
        description: `${player?.name} defeated ${opponents.find((o) => o.id === opponentId)?.name}`,
      })
      setOpponentId('')
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record win',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Win</DialogTitle>
          <DialogDescription>
            Record a win for {player?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Opponent
            </label>
            <Select value={opponentId} onValueChange={setOpponentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select opponent" />
              </SelectTrigger>
              <SelectContent>
                {opponents.map((opponent) => (
                  <SelectItem key={opponent.id} value={opponent.id}>
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={opponent.avatar}
                        name={opponent.name}
                        size="sm"
                      />
                      <span>
                        {opponent.name}
                        {opponent.nickname && ` (${opponent.nickname})`}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!opponentId || loading}>
              {loading ? 'Recording...' : 'Record Win'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
