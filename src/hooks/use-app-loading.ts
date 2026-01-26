import { useEffect, useState } from 'react'
import { usePlayers } from './use-players'
import { useMatches } from './use-matches'

export function useAppLoading() {
  const { loading: playersLoading } = usePlayers()
  const { loading: matchesLoading } = useMatches()
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    if (!playersLoading && !matchesLoading && isInitialLoad) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsInitialLoad(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [playersLoading, matchesLoading, isInitialLoad])

  return isInitialLoad
}
