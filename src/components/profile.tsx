import { ThemeToggle } from '@/components/theme-toggle'

export function Profile() {
  return (
    <div className="space-y-2 p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
      
      <div className="space-y-4">
        <div className="text-center text-muted-foreground py-8">
          <p>Profile content coming soon...</p>
        </div>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-semibold">Theme</h3>
            <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
