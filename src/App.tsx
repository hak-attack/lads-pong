import { HashRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Leaderboard } from '@/components/leaderboard'
import { Matches } from '@/components/matches'
import { Players } from '@/components/players'
import { ThemeToggle } from '@/components/theme-toggle'
import { Toaster } from '@/components/ui/toaster'
import { Trophy, Users, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/use-theme'

function App() {
  useTheme() // Initialize theme

  return (
    <HashRouter>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-bold">Ping Pong Rankings</h1>
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

        <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto max-w-2xl">
            <div className="flex items-center justify-around">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-1 px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                <Trophy className="h-5 w-5" />
                <span>Leaderboard</span>
              </NavLink>
              <NavLink
                to="/matches"
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-1 px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
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
                    'flex flex-col items-center gap-1 px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                <Users className="h-5 w-5" />
                <span>Players</span>
              </NavLink>
            </div>
          </div>
        </nav>

        <Toaster />
      </div>
    </HashRouter>
  )
}

export default App
