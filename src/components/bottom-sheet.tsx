import * as React from 'react'
import { X, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  expanded?: boolean
  onBack?: () => void
  showBackButton?: boolean
}

export function BottomSheet({ 
  open, 
  onOpenChange, 
  children, 
  expanded = false,
  onBack,
  showBackButton = false
}: BottomSheetProps) {
  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 animate-in fade-in-0"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl shadow-lg',
          'animate-in slide-in-from-bottom-full duration-300',
          'transition-all',
          expanded ? 'max-h-[90vh]' : 'max-h-[80vh]',
          'overflow-y-auto'
        )}
      >
        <div className="sticky top-0 bg-background border-b flex items-center justify-between p-4 z-10">
          <div className="w-12 h-1 bg-muted rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
          <div className="flex items-center justify-between w-full">
            {showBackButton && onBack ? (
              <button
                onClick={onBack}
                className="p-2 hover:bg-accent rounded-full transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-accent rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </>
  )
}
