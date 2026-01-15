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
  deleteField,
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
    const playerData: Record<string, any> = {
      name: player.name,
      active: player.active,
      createdAt: Timestamp.now(),
    }
    
    // Only include nickname if it's a non-empty string
    if (player.nickname && player.nickname.trim()) {
      playerData.nickname = player.nickname.trim()
    }
    
    // Only include avatar if it's a non-empty string
    if (player.avatar && player.avatar.trim()) {
      playerData.avatar = player.avatar.trim()
    }
    
    await addDoc(collection(db, 'players'), playerData)
  }

  const updatePlayer = async (id: string, updates: Partial<Player>) => {
    const updateData: Record<string, any> = {}
    
    if (updates.name !== undefined) {
      updateData.name = updates.name
    }
    if (updates.active !== undefined) {
      updateData.active = updates.active
    }
    if (updates.nickname !== undefined) {
      if (updates.nickname) {
        updateData.nickname = updates.nickname
      } else {
        updateData.nickname = deleteField() // Remove field if empty
      }
    }
    if (updates.avatar !== undefined) {
      if (updates.avatar) {
        updateData.avatar = updates.avatar
      } else {
        updateData.avatar = deleteField() // Remove field if empty
      }
    }
    
    await updateDoc(doc(db, 'players', id), updateData)
  }

  const deletePlayer = async (id: string) => {
    await deleteDoc(doc(db, 'players', id))
  }

  return { players, loading, addPlayer, updatePlayer, deletePlayer }
}
