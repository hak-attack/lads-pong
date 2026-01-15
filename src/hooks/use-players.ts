import { useState, useEffect } from 'react'
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Player } from '@/types'

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'players'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const playersData: Player[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        playersData.push({
          id: doc.id,
          name: data.name,
          nickname: data.nickname,
          avatar: data.avatar,
          active: data.active ?? true,
          createdAt: data.createdAt?.toDate() ?? new Date(),
        })
      })
      setPlayers(playersData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const addPlayer = async (player: Omit<Player, 'id' | 'createdAt'>) => {
    await addDoc(collection(db, 'players'), {
      ...player,
      createdAt: Timestamp.now(),
    })
  }

  const updatePlayer = async (id: string, updates: Partial<Player>) => {
    await updateDoc(doc(db, 'players', id), updates)
  }

  const deletePlayer = async (id: string) => {
    await deleteDoc(doc(db, 'players', id))
  }

  return { players, loading, addPlayer, updatePlayer, deletePlayer }
}
