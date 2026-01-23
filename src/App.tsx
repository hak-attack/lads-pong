import { useState } from 'react'
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { Leaderboard } from '@/components/leaderboard'
import { Matches } from '@/components/matches'
import { Players } from '@/components/players'
import { ThemeToggle } from '@/components/theme-toggle'
import { Toaster } from '@/components/ui/toaster'
import { AddMatchDialog } from '@/components/add-match-dialog'
import { Button } from '@/components/ui/button'
import { Trophy, Users, Activity, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/use-theme'

function AppContent() {
  useTheme() // Initialize theme
  const [addMatchDialogOpen, setAddMatchDialogOpen] = useState(false)
  const location = useLocation()
  const isStandingsPage = location.pathname === '/' || location.pathname === ''

  return (
    <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-bold">Lads Pong</h1>
            <ThemeToggle />
          </div>
        </header>

        <main className="container mx-auto max-w-2xl">
          <Routes>
            <Route path="/" element={<Leaderboard />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/players" element={<Players />} />
          </Routes>
        </main>

        <div className="fixed bottom-5 left-4 right-4 flex items-stretch gap-2 z-50">
          <nav className="flex-1 border rounded-2xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm p-2">
            <div className="flex items-center justify-around gap-1">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    cn(
                      'flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium transition-all rounded-2xl flex-1',
                      isActive
                        ? 'text-primary bg-accent'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    )
                  }
                >
                  <Trophy className="h-5 w-5" />
                  <span>Standings</span>
                </NavLink>
                <NavLink
                  to="/matches"
                  className={({ isActive }) =>
                    cn(
                      'flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium transition-all rounded-2xl flex-1',
                      isActive
                        ? 'text-primary bg-accent'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    )
                  }
                >
                  <Activity className="h-5 w-5" />
                  <span>Matches</span>
                </NavLink>
                <NavLink
                  to="/players"
                  className={({ isActive }) =>
                    cn(
                      'flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium transition-all rounded-2xl flex-1',
                      isActive
                        ? 'text-primary bg-accent'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    )
                  }
                >
                  <Users className="h-5 w-5" />
                  <span>Players</span>
                </NavLink>
            </div>
          </nav>
          {isStandingsPage && (
            <Button
              onClick={() => setAddMatchDialogOpen(true)}
              className="h-[74px] w-[74px] rounded-2xl shadow-lg p-0"
              size="icon"
              variant="default"
            >
              <Plus className="h-6 w-6" />
            </Button>
          )}
        </div>

        <AddMatchDialog
          open={addMatchDialogOpen}
          onOpenChange={setAddMatchDialogOpen}
        />

        <Toaster />
      </div>
  )
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  )
}

export default App
