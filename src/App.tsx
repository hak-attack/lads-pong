import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { Leaderboard } from '@/components/leaderboard'
import { Players } from '@/components/players'
import { Lobby } from '@/components/lobby'
import { Profile } from '@/components/profile'
import { Toaster } from '@/components/ui/toaster'
import { AddMatchDialog } from '@/components/add-match-dialog'
import { Loader } from '@/components/loader'
import { Trophy, Users, Home, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/use-theme'
import { useAppLoading } from '@/hooks/use-app-loading'

function AnimatedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  return (
    <div key={location.pathname}>
      {children}
    </div>
  )
}

function AppContent() {
  useTheme() // Initialize theme
  const [addMatchDialogOpen, setAddMatchDialogOpen] = useState(false)
  const isInitialLoading = useAppLoading()
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)

  // Track when initial load completes
  useEffect(() => {
    if (!isInitialLoading && !hasLoadedOnce) {
      setHasLoadedOnce(true)
    }
  }, [isInitialLoading, hasLoadedOnce])

  return (
    <div className="min-h-screen bg-background">
      {isInitialLoading && <Loader />}

      <main className="container mx-auto max-w-2xl">
        <Routes>
          <Route
            path="/"
            element={
              <AnimatedRoute>
                <Leaderboard onAddMatchClick={() => setAddMatchDialogOpen(true)} />
              </AnimatedRoute>
            }
          />
          <Route
            path="/players"
            element={
              <AnimatedRoute>
                <Players />
              </AnimatedRoute>
            }
          />
          <Route
            path="/lobby"
            element={
              <AnimatedRoute>
                <Lobby />
              </AnimatedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <AnimatedRoute>
                <Profile />
              </AnimatedRoute>
            }
          />
        </Routes>
      </main>

      <div className={`fixed bottom-1 left-4 right-4 z-50 ${!hasLoadedOnce ? 'animate-fade-in-up-delay-5' : ''}`}>
        <nav className="border rounded-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm p-1">
          <div className="flex items-center justify-around gap-0">
            <NavLink
              to="/lobby"
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium transition-all rounded-full flex-1',
                  isActive
                    ? 'text-primary bg-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )
              }
            >
              <Home className="h-4 w-4" />
              <span>Lobby</span>
            </NavLink>
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium transition-all rounded-full flex-1',
                  isActive
                    ? 'text-primary bg-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )
              }
            >
              <Trophy className="h-4 w-4" />
              <span>Standings</span>
            </NavLink>
            <NavLink
              to="/players"
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium transition-all rounded-full flex-1',
                  isActive
                    ? 'text-primary bg-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )
              }
            >
              <Users className="h-4 w-4" />
              <span>Players</span>
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium transition-all rounded-full flex-1',
                  isActive
                    ? 'text-primary bg-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )
              }
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </NavLink>
          </div>
        </nav>
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
