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
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/avatar'

interface AddMatchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMatchDialog({
  open,
  onOpenChange,
}: AddMatchDialogProps) {
  const { players } = usePlayers()
  const { addMatch } = useMatches()
  const { toast } = useToast()
  const [winnerId, setWinnerId] = useState<string>('')
  const [loserId, setLoserId] = useState<string>('')
  const [numberOfSets, setNumberOfSets] = useState<string>('3')
  const [scorePerSet, setScorePerSet] = useState<string>('11')
  const [winnerScore, setWinnerScore] = useState<string>('')
  const [loserScore, setLoserScore] = useState<string>('')
  const [setsWonByLoser, setSetsWonByLoser] = useState<string>('0')
  const [loading, setLoading] = useState(false)

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

  const activePlayers = players.filter((p) => p.active)
  const selectedWinner = activePlayers.find((p) => p.id === winnerId)
  const selectedLoser = activePlayers.find((p) => p.id === loserId)

  // Filter out the selected winner from loser options and vice versa
  const availableLosers = activePlayers.filter((p) => p.id !== winnerId)
  const availableWinners = activePlayers.filter((p) => p.id !== loserId)

  const handleSubmit = async () => {
    if (!winnerId || !loserId) {
      toast({
        title: 'Missing players',
        description: 'Please select both winner and loser',
        variant: 'destructive',
      })
      return
    }

    if (winnerId === loserId) {
      toast({
        title: 'Invalid selection',
        description: 'Winner and loser must be different players',
        variant: 'destructive',
      })
      return
    }

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

    setLoading(true)
    try {
      await addMatch(
        winnerId,
        loserId,
        winnerScoreNum,
        loserScoreNum,
        setsWonByWinnerNum,
        setsWonByLoserNum,
        numberOfSetsNum,
        scorePerSetNum
      )
      toast({
        title: 'Match recorded!',
        description: `${selectedWinner?.name} defeated ${selectedLoser?.name} ${setsWonByWinnerNum}-${setsWonByLoserNum} (last set: ${winnerScoreNum}-${loserScoreNum})`,
      })
      // Reset form
      setWinnerId('')
      setLoserId('')
      setNumberOfSets('3')
      setScorePerSet('11')
      setWinnerScore('')
      setLoserScore('')
      setSetsWonByLoser('0')
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record match',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setWinnerId('')
      setLoserId('')
      setNumberOfSets('3')
      setScorePerSet('11')
      setWinnerScore('')
      setLoserScore('')
      setSetsWonByLoser('0')
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Match</DialogTitle>
          <DialogDescription>
            Record a new match result
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="min-w-0">
              <label className="text-sm font-medium mb-2 block">
                Winner
              </label>
              <Select value={winnerId} onValueChange={setWinnerId}>
                <SelectTrigger className="min-w-0">
                  <SelectValue placeholder="Select winner" />
                </SelectTrigger>
                <SelectContent>
                  {availableWinners.map((player) => {
                    const firstName = player.name.split(' ')[0]
                    return (
                      <SelectItem key={player.id} value={player.id}>
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={player.avatar}
                            name={player.name}
                            size="sm"
                          />
                          <span>{firstName}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-0">
              <label className="text-sm font-medium mb-2 block">
                Loser
              </label>
              <Select value={loserId} onValueChange={setLoserId}>
                <SelectTrigger className="min-w-0">
                  <SelectValue placeholder="Select loser" />
                </SelectTrigger>
                <SelectContent>
                  {availableLosers.map((player) => {
                    const firstName = player.name.split(' ')[0]
                    return (
                      <SelectItem key={player.id} value={player.id}>
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={player.avatar}
                            name={player.name}
                            size="sm"
                          />
                          <span>{firstName}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
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
                {selectedWinner ? `${selectedWinner.name} Last Set Score` : 'Winner Last Set Score'}
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
                {selectedLoser ? `${selectedLoser.name} Last Set Score` : 'Loser Last Set Score'}
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
                Sets Won by {selectedLoser ? selectedLoser.name : 'Loser'}
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
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!winnerId || !loserId || loading}>
              {loading ? 'Recording...' : 'Record Match'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
