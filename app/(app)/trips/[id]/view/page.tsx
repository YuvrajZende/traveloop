'use client'

import { useParams } from 'next/navigation'
import { mockTrips } from '@/lib/mock-data'
import { Input } from '@/components/ui/input'
import { buttonVariants } from '@/components/ui/button'
import { Search, ArrowDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function ItineraryViewPage() {
  const { id } = useParams<{ id: string }>()
  const trip = mockTrips.find(t => t.id === id) ?? mockTrips[0]
  const [search, setSearch] = useState('')

  const allDays: Array<{ day: string; city: string; activities: Array<{ name: string; cost: number }> }> = []
  let dayCounter = 1
  for (const stop of trip.stops) {
    for (let d = 0; d < stop.days; d++) {
      const dayActivities = stop.activities.filter((_, idx) => idx % stop.days === d % stop.days)
      allDays.push({
        day: `Day ${dayCounter}`,
        city: stop.city,
        activities: dayActivities.length > 0
          ? dayActivities.map(a => ({ name: a.name, cost: a.cost }))
          : stop.activities.slice(0, 3).map(a => ({ name: a.name, cost: a.cost })),
      })
      dayCounter++
      if (allDays.length >= 4) break
    }
    if (allDays.length >= 4) break
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto">
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
        <h1 className="text-xl font-semibold">Itinerary for {trip.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">{trip.stops.length} stops · {trip.stops.reduce((acc, s) => acc + s.days, 0)} days</p>
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
