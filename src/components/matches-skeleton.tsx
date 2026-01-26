import { Card, CardContent } from '@/components/ui/card'

export function MatchesSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} className="border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-muted/60 animate-pulse" />
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="h-5 w-24 bg-muted/60 rounded animate-pulse" />
                    <div className="h-4 w-4 rounded bg-muted/60 animate-pulse" />
                  </div>
                </div>
                <span className="text-muted-foreground mx-2">vs</span>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-muted/60 animate-pulse" />
                  <div className="h-5 w-24 bg-muted/60 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-9 w-9 rounded bg-muted/60 animate-pulse ml-2 flex-shrink-0" />
            </div>
            <div className="h-3 w-20 bg-muted/60 rounded animate-pulse mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
