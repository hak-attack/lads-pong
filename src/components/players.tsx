import { useState } from 'react'
import { usePlayers } from '@/hooks/use-players'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/avatar'
import { PlayersSkeleton } from '@/components/players-skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export function Players() {
  const { players, loading, addPlayer, updatePlayer, deletePlayer } = usePlayers()
  const { toast } = useToast()
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null)
  const [deletingPlayer, setDeletingPlayer] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [avatar, setAvatar] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const handleAddPlayer = async () => {
    if (!name.trim()) return

    setActionLoading(true)
    try {
      await addPlayer({
        name: name.trim(),
        nickname: nickname.trim() || undefined,
        avatar: avatar.trim() ? avatar.trim() : undefined,
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
      setActionLoading(false)
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

  const handleEditClick = (player: typeof players[0]) => {
    setEditingPlayer(player.id)
    setName(player.name)
    setNickname(player.nickname || '')
    setAvatar(player.avatar || '')
    setEditDialogOpen(true)
  }

  const handleEditPlayer = async () => {
    if (!name.trim() || !editingPlayer) return

    setActionLoading(true)
    try {
      await updatePlayer(editingPlayer, {
        name: name.trim(),
        nickname: nickname.trim() || undefined,
        avatar: avatar.trim() ? avatar.trim() : undefined,
      })
      toast({
        title: 'Player updated',
        description: `${name} has been updated`,
      })
      setName('')
      setNickname('')
      setAvatar('')
      setEditingPlayer(null)
      setEditDialogOpen(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update player',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteClick = (playerId: string) => {
    setDeletingPlayer(playerId)
    setDeleteDialogOpen(true)
  }

  const handleDeletePlayer = async () => {
    if (!deletingPlayer) return

    setActionLoading(true)
    try {
      const player = players.find((p) => p.id === deletingPlayer)
      await deletePlayer(deletingPlayer)
      toast({
        title: 'Player removed',
        description: `${player?.name || 'Player'} has been removed`,
      })
      setDeletingPlayer(null)
      setDeleteDialogOpen(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove player',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
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

      {loading ? (
        <PlayersSkeleton />
      ) : players.length === 0 ? (
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
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(player)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(player.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Switch
                      checked={player.active}
                      onCheckedChange={(checked) =>
                        handleToggleActive(player.id, checked)
                      }
                    />
                  </div>
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
                Avatar URL (optional)
              </label>
              <Input
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                type="text"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setAddDialogOpen(false)
                  setName('')
                  setNickname('')
                  setAvatar('')
                }}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPlayer}
                disabled={!name.trim() || actionLoading}
              >
                {actionLoading ? 'Adding...' : 'Add Player'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
            <DialogDescription>
              Update player information
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
                Avatar URL (optional)
              </label>
              <Input
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                type="text"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setEditDialogOpen(false)
                  setEditingPlayer(null)
                  setName('')
                  setNickname('')
                  setAvatar('')
                }}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditPlayer}
                disabled={!name.trim() || actionLoading}
              >
                {actionLoading ? 'Updating...' : 'Update Player'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Player</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{' '}
              {deletingPlayer
                ? players.find((p) => p.id === deletingPlayer)?.name
                : 'this player'}
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setDeletingPlayer(null)
              }}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePlayer}
              disabled={actionLoading}
            >
              {actionLoading ? 'Removing...' : 'Remove Player'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
