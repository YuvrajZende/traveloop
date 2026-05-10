'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, Search, Check } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api'

const STATUS_COLORS: Record<string, string> = {
  planning:  'bg-accent text-accent-foreground border-0',
  upcoming:  'bg-primary/10 text-primary border-0',
  ongoing:   'bg-chart-1/20 text-chart-1 border-0',
  completed: 'bg-muted text-muted-foreground border-0',
}

type SortKey  = 'newest' | 'oldest' | 'az'
type FilterKey = 'all' | 'upcoming' | 'planning' | 'completed'
type GroupKey  = 'none' | 'status' | 'year'

const SORT_LABELS: Record<SortKey,  string> = { newest:'Newest first', oldest:'Oldest first', az:'Name A–Z' }
const FILTER_LABELS: Record<FilterKey, string> = { all:'All', upcoming:'Upcoming', planning:'Planning', completed:'Completed' }
const GROUP_LABELS:  Record<GroupKey,  string> = { none:'None', status:'By Status', year:'By Year' }

const STATIC_DESTINATIONS = [
  { city: 'Bali',       country: 'Indonesia',    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
  { city: 'Santorini',  country: 'Greece',        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80' },
  { city: 'Kyoto',      country: 'Japan',         image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80' },
  { city: 'Barcelona',  country: 'Spain',         image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80' },
  { city: 'Cape Town',  country: 'South Africa',  image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80' },
  { city: 'Lisbon',     country: 'Portugal',      image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600&q=80' },
]

export default function DashboardPage() {
  const [search,   setSearch]   = useState('')
  const [sortBy,   setSortBy]   = useState<SortKey>('newest')
  const [filterBy, setFilterBy] = useState<FilterKey>('all')
  const [groupBy,  setGroupBy]  = useState<GroupKey>('none')
  
  const [tripsData, setTripsData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const tripsRes = await apiClient('/trips')
        
        // Map backend trips to frontend structure
        const mappedTrips = tripsRes.map((t: any) => ({
          id: t.id,
          name: t.title,
          status: t.status,
          startDate: t.start_date,
          endDate: t.end_date,
          coverImage: t.cover_image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
          stops: [{ city: t.place }]
        }))
        
        setTripsData(mappedTrips)
      } catch (err) {
        console.error('Failed to load dashboard:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadDashboard()
  }, [])

  // Filter destinations
  const filteredDests = STATIC_DESTINATIONS.filter(d =>
    !search || d.city.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase())
  )

  // Filter trips
  let trips = tripsData.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filterBy === 'all' || t.status === filterBy
    return matchSearch && matchFilter
  })

  // Sort
  trips = [...trips].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    if (sortBy === 'oldest') return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    return a.name.localeCompare(b.name)
  })

  // Group
  let grouped: Array<{ label: string; items: typeof trips }> = []
  if (groupBy === 'status') {
    const statusOrder = ['ongoing', 'upcoming', 'planning', 'completed']
    statusOrder.forEach(status => {
      const items = trips.filter(t => t.status === status)
      if (items.length) grouped.push({ label: status.charAt(0).toUpperCase() + status.slice(1), items })
    })
  } else if (groupBy === 'year') {
    const years = [...new Set(trips.map(t => new Date(t.startDate).getFullYear()))].sort((a, b) => b - a)
    years.forEach(year => {
      const items = trips.filter(t => new Date(t.startDate).getFullYear() === year)
      if (items.length) grouped.push({ label: String(year), items })
    })
  } else {
    grouped = [{ label: '', items: trips }]
  }

  function FilterButton({ value, set, labels }: { value: string; set: (v: any) => void; labels: Record<string, string> }) {
    const entries = Object.entries(labels) as [string, string][]
    const activeLabel = labels[value]
    const isActive = value !== entries[0][0]
    return (
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <button className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-border text-xs shrink-0 h-10 gap-1', isActive && 'border-primary text-primary')}>
            {activeLabel}
            {isActive && <Check className="w-3 h-3" />}
          </button>
        } />
        <DropdownMenuContent align="end" className="w-40">
          {entries.map(([k, label]) => (
            <DropdownMenuItem key={k} onClick={() => set(k)}>
              <span className="flex-1">{label}</span>
              {value === k && <Check className="w-3.5 h-3.5 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="relative min-h-full">
      {/* Banner */}
      <div className="relative h-64 bg-muted overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400&q=80" alt="Travel banner" fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-black/35 flex flex-col items-center justify-center gap-3">
          <h1 className="text-white text-4xl font-bold tracking-tight drop-shadow-lg">Where to next?</h1>
          <p className="text-white/80 text-base">Discover your next adventure</p>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8 pb-24 max-w-6xl mx-auto">
        {/* Controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search destinations, trips..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background border-border h-10" />
          </div>
          <FilterButton value={groupBy}  set={setGroupBy}  labels={GROUP_LABELS} />
          <FilterButton value={filterBy} set={setFilterBy} labels={FILTER_LABELS} />
          <FilterButton value={sortBy}   set={setSortBy}   labels={SORT_LABELS} />
        </div>

        {/* Top Regional Selections — always visible */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-5 rounded-full bg-primary" />
            <h2 className="text-base font-bold tracking-tight">Top Regional Selections</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {filteredDests.map(dest => (
              <div key={dest.city} className="relative rounded-xl overflow-hidden aspect-[3/4] bg-muted group cursor-pointer border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <Image src={dest.image} alt={dest.city} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="200px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-semibold truncate">{dest.city}</p>
                  <p className="text-white/70 text-[11px]">{dest.country}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trips */}
        {grouped.map(group => (
          <section key={group.label || 'all'}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-5 rounded-full bg-primary" />
              <h2 className="text-base font-bold tracking-tight">{group.label || 'Previous Trips'}</h2>
            </div>
            {group.items.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {group.items.map(trip => (
                  <Link key={trip.id} href={`/trips/${trip.id}/summary`}>
                    <Card className="overflow-hidden border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer">
                      <div className="relative h-36 bg-muted overflow-hidden">
                        <Image src={trip.coverImage} alt={trip.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="33vw" />
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold leading-tight">{trip.name}</h3>
                          <Badge className={`text-[10px] capitalize shrink-0 ${STATUS_COLORS[trip.status]}`}>{trip.status}</Badge>
                        </div>
                        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                          <span className="text-xs text-muted-foreground">From</span>
                          <span className="text-xs font-medium truncate">{trip.stops[0]?.city ?? '—'}</span>
                          <span className="text-xs text-muted-foreground">To</span>
                          <span className="text-xs font-medium truncate">{trip.stops[trip.stops.length - 1]?.city ?? '—'}</span>
                          <span className="text-xs text-muted-foreground">Departs</span>
                          <span className="text-xs font-medium">{format(new Date(trip.startDate), 'MMM d, yyyy')}</span>
                          <span className="text-xs text-muted-foreground">Returns</span>
                          <span className="text-xs font-medium">{format(new Date(trip.endDate), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-6 text-center">No trips match the current filter.</p>
            )}
          </section>
        ))}
      </div>

      <div className="fixed bottom-6 right-6">
        <Link href="/trips/new" className={cn(buttonVariants(), 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg gap-1.5 h-11 px-5 text-sm btn-primary-glow transition-all')}>
          <Plus className="w-4 h-4" />Plan a trip
        </Link>
      </div>
    </div>
  )
}
