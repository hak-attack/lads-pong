import { Card, CardContent } from '@/components/ui/card'

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} className="border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-muted/60 animate-pulse" />
              </div>
              <div className="h-10 w-10 rounded-full bg-muted/60 animate-pulse" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-5 w-32 bg-muted/60 rounded animate-pulse" />
                <div className="flex items-center gap-3">
                  <div className="h-4 w-16 bg-muted/60 rounded animate-pulse" />
                  <div className="h-4 w-12 bg-muted/60 rounded animate-pulse" />
                  <div className="h-4 w-12 bg-muted/60 rounded animate-pulse" />
                  <div className="h-4 w-12 bg-muted/60 rounded animate-pulse" />
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="h-4 w-8 bg-muted/60 rounded animate-pulse ml-auto" />
                <div className="h-5 w-12 bg-muted/60 rounded animate-pulse ml-auto" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
