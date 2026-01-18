import { Card, CardContent } from '@/components/ui/card'

export function PlayersSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted/60 animate-pulse" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-5 w-32 bg-muted/60 rounded animate-pulse" />
                <div className="h-4 w-16 bg-muted/60 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-muted/60 animate-pulse" />
                <div className="h-8 w-8 rounded bg-muted/60 animate-pulse" />
                <div className="h-6 w-11 rounded-full bg-muted/60 animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
