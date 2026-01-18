import { useState, useEffect } from 'react'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
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
        const numberOfSets = data.numberOfSets ?? 3
        // Calculate sets won: winner needs majority, loser gets the rest
        const setsWonByWinner = data.setsWonByWinner ?? Math.ceil(numberOfSets / 2)
        const setsWonByLoser = data.setsWonByLoser ?? (numberOfSets - setsWonByWinner)
        matchesData.push({
          id: doc.id,
          winnerId: data.winnerId,
          loserId: data.loserId,
          winnerScore: data.winnerScore ?? 0,
          loserScore: data.loserScore ?? 0,
          setsWonByWinner,
          setsWonByLoser,
          numberOfSets,
          scorePerSet: data.scorePerSet ?? 11,
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

  const addMatch = async (
    winnerId: string,
    loserId: string,
    winnerScore: number,
    loserScore: number,
    setsWonByWinner: number,
    setsWonByLoser: number,
    numberOfSets: number,
    scorePerSet: number
  ) => {
    const userId = auth.currentUser?.uid || 'anonymous'
    await addDoc(collection(db, 'matches'), {
      winnerId,
      loserId,
      winnerScore,
      loserScore,
      setsWonByWinner,
      setsWonByLoser,
      numberOfSets,
      scorePerSet,
      playedAt: Timestamp.now(),
      createdBy: userId,
      status: 'completed',
    })
  }

  const updateMatch = async (
    id: string,
    winnerScore: number,
    loserScore: number,
    setsWonByWinner: number,
    setsWonByLoser: number,
    numberOfSets: number,
    scorePerSet: number
  ) => {
    await updateDoc(doc(db, 'matches', id), {
      winnerScore,
      loserScore,
      setsWonByWinner,
      setsWonByLoser,
      numberOfSets,
      scorePerSet,
    })
  }

  const deleteMatch = async (id: string) => {
    await deleteDoc(doc(db, 'matches', id))
  }

  return { matches, loading, addMatch, updateMatch, deleteMatch }
}
