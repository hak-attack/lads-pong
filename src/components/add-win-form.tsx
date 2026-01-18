import { useState } from 'react'
import { usePlayers } from '@/hooks/use-players'
import { useMatches } from '@/hooks/use-matches'
import { useToast } from '@/hooks/use-toast'
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

interface AddWinFormProps {
  playerId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function AddWinForm({ playerId, onSuccess, onCancel }: AddWinFormProps) {
  const { players } = usePlayers()
  const { addMatch } = useMatches()
  const { toast } = useToast()
  const [opponentId, setOpponentId] = useState<string>('')
  const [numberOfSets, setNumberOfSets] = useState<string>('3')
  const [scorePerSet, setScorePerSet] = useState<string>('11')
  const [winnerScore, setWinnerScore] = useState<string>('')
  const [loserScore, setLoserScore] = useState<string>('')
  const [setsWonByLoser, setSetsWonByLoser] = useState<string>('0')

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
  const [loading, setLoading] = useState(false)

  const player = players.find((p) => p.id === playerId)
  const opponents = players.filter(
    (p) => p.id !== playerId && p.active
  )
  const selectedOpponent = opponents.find((o) => o.id === opponentId)

  const handleSubmit = async () => {
    if (!opponentId) return

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
        description: 'Please enter valid number of sets won by opponent',
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
          description: `Opponent cannot have won more than ${maxLoserSets} sets in a best of ${numberOfSetsNum} match`,
          variant: 'destructive',
        })
        return
      }
    }

    setLoading(true)
    try {
      await addMatch(
        playerId,
        opponentId,
        winnerScoreNum,
        loserScoreNum,
        setsWonByWinnerNum,
        setsWonByLoserNum,
        numberOfSetsNum,
        scorePerSetNum
      )
      toast({
        title: 'Win recorded!',
        description: `${player?.name} defeated ${selectedOpponent?.name} ${setsWonByWinnerNum}-${setsWonByLoserNum} (last set: ${winnerScoreNum}-${loserScoreNum})`,
      })
      setOpponentId('')
      setNumberOfSets('3')
      setScorePerSet('11')
      setWinnerScore('')
      setLoserScore('')
      setSetsWonByLoser(parseInt(numberOfSets) === 1 ? '0' : '0')
      onSuccess?.()
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
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-2">Add Win</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Record a win for {player?.name}
        </p>
      </div>

      <div className="space-y-4">
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
              {player?.name} Last Set Score
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
              {selectedOpponent ? `${selectedOpponent.name} Last Set Score` : 'Opponent Last Set Score'}
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
              Sets Won by {selectedOpponent ? selectedOpponent.name : 'Opponent'}
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

        <div className="flex gap-2 justify-end pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!opponentId || loading}>
            {loading ? 'Recording...' : 'Record Win'}
          </Button>
        </div>
      </div>
    </div>
  )
}
