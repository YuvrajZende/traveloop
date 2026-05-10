'use client'

import { useParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { buttonVariants } from '@/components/ui/button'
import { Search, ArrowDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { apiClient } from '@/lib/api'
import { BackButton } from '@/components/back-button'

export default function ItineraryViewPage() {
  const { id } = useParams<{ id: string }>()
  const [trip, setTrip] = useState<any>(null)
  const [allDays, setAllDays] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadItinerary() {
      try {
        const data = await apiClient(`/itinerary/view/${id}`)
        setTrip(data.trip)
        
        const mappedDays = data.days.map((day: any) => ({
          day: `Day ${day.day_number}`,
          city: day.section_title || data.trip.place,
          activities: day.activities.map((a: any) => ({
            name: a.name,
            cost: parseFloat(a.expense || '0')
          }))
        }))
        setAllDays(mappedDays)
      } catch (err) {
        console.error('Failed to load itinerary:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadItinerary()
  }, [id])

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading itinerary...</div>
  if (!trip) return <div className="p-8 text-center text-muted-foreground">Trip not found.</div>

  // Days data is loaded from API directly into state

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto">
      <BackButton href="/trips" />
      {/* Search + filter */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search itinerary..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-background border-border h-10"
          />
        </div>
        <button className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-border text-xs shrink-0 h-10')}>Group by</button>
        <button className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-border text-xs shrink-0 h-10')}>Filter</button>
        <button className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-border text-xs shrink-0 h-10')}>Sort by...</button>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-xl font-semibold">Itinerary for {trip.title || trip.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">{allDays.length} days planned</p>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_160px] gap-4 px-1">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Physical Activity</div>
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">Expense</div>
      </div>

      {/* Days */}
      <div className="space-y-6">
        {allDays.slice(0, 4).map((dayData, dayIdx) => (
          <div key={dayIdx} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="border border-border rounded-lg px-3 py-1.5 bg-muted/30">
                <span className="text-xs font-semibold">{dayData.day}</span>
              </div>
              <span className="text-xs text-muted-foreground">{dayData.city}</span>
            </div>

            <div className="space-y-2">
              {dayData.activities.slice(0, 3).map((act, actIdx) => (
                <div key={actIdx}>
                  <div className="grid grid-cols-[1fr_160px] gap-4 items-center">
                    <div className="border border-border rounded-lg bg-card h-11 flex items-center px-4 shadow-sm">
                      <span className="text-sm text-foreground truncate">{act.name}</span>
                    </div>
                    <div className="border border-border rounded-lg bg-card h-11 flex items-center justify-end px-4 shadow-sm">
                      <span className="text-sm font-medium text-foreground">${act.cost}</span>
                    </div>
                  </div>
                  {actIdx < dayData.activities.slice(0, 3).length - 1 && (
                    <div className="flex justify-center pt-1">
                      <ArrowDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Link
          href={`/trips/${trip.id}/builder`}
          className={cn(buttonVariants(), 'bg-primary text-primary-foreground hover:bg-primary/90 h-10')}
        >
          Edit Itinerary
        </Link>
        <Link
          href="/trips"
          className={cn(buttonVariants({ variant: 'outline' }), 'border-border h-10')}
        >
          Back to Trips
        </Link>
      </div>
    </div>
  )
}
