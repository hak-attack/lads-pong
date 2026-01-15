import { useState, useEffect } from 'react'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import type { Match } from '@/types'

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'matches'), orderBy('playedAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const matchesData: Match[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        matchesData.push({
          id: doc.id,
          winnerId: data.winnerId,
          loserId: data.loserId,
          playedAt: data.playedAt?.toDate() ?? new Date(),
          createdBy: data.createdBy,
          status: data.status ?? 'completed',
        })
      })
      setMatches(matchesData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const addMatch = async (winnerId: string, loserId: string) => {
    const userId = auth.currentUser?.uid || 'anonymous'
    await addDoc(collection(db, 'matches'), {
      winnerId,
      loserId,
      playedAt: Timestamp.now(),
      createdBy: userId,
      status: 'completed',
    })
  }

  const deleteMatch = async (id: string) => {
    await deleteDoc(doc(db, 'matches', id))
  }

  return { matches, loading, addMatch, deleteMatch }
}
