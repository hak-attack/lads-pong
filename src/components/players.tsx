import { useState } from 'react'
import { usePlayers } from '@/hooks/use-players'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Plus } from 'lucide-react'

export function Players() {
  const { players, addPlayer, updatePlayer } = usePlayers()
  const { toast } = useToast()
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [avatar, setAvatar] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddPlayer = async () => {
    if (!name.trim()) return

    setLoading(true)
    try {
      await addPlayer({
        name: name.trim(),
        nickname: nickname.trim() || undefined,
        avatar: avatar.trim() || undefined,
        active: true,
      })
      toast({
        title: 'Player added',
        description: `${name} has been added to the roster`,
      })
      setName('')
      setNickname('')
      setAvatar('')
      setAddDialogOpen(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add player',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (playerId: string, active: boolean) => {
    try {
      await updatePlayer(playerId, { active })
      toast({
        title: active ? 'Player activated' : 'Player deactivated',
        description: `Player status updated`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update player',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-2 p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Players</h1>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Player
        </Button>
      </div>

      {players.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No players yet. Add your first player to get started!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {players.map((player) => (
            <Card key={player.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={player.avatar}
                    name={player.name}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">
                      {player.name}
                      {player.nickname && (
                        <span className="text-muted-foreground font-normal ml-1">
                          ({player.nickname})
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {player.active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <Switch
                    checked={player.active}
                    onCheckedChange={(checked) =>
                      handleToggleActive(player.id, checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Player</DialogTitle>
            <DialogDescription>
              Add a new player to the roster
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Name *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Nickname
              </label>
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="JD"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Avatar URL
              </label>
              <Input
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                type="url"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setAddDialogOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPlayer}
                disabled={!name.trim() || loading}
              >
                {loading ? 'Adding...' : 'Add Player'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
