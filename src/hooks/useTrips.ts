import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import type { Trip } from '@/types'

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/trips')
      setTrips(res.data.trips)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch trips'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrips()
  }, [fetchTrips])

  const deleteTrip = async (id: string) => {
    await api.delete(`/trips/${id}`)
    setTrips(prev => prev.filter(t => t.id !== id))
  }

  return { trips, loading, error, refetch: fetchTrips, deleteTrip }
}
