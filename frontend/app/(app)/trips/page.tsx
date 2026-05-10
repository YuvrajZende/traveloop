'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, Calendar, MapPin, Check } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api'
import type { Trip } from '@/lib/types'

const STATUS_COLORS: Record<string, string> = {
  planning:  'bg-accent text-accent-foreground border-0',
  upcoming:  'bg-primary/10 text-primary border-0',
  ongoing:   'bg-chart-1/20 text-chart-1 border-0',
  completed: 'bg-muted text-muted-foreground border-0',
}
const STATUS_ACCENTS: Record<string, string> = {
  ongoing: 'bg-chart-1', upcoming: 'bg-primary', planning: 'bg-accent-foreground', completed: 'bg-muted-foreground',
}

type SortKey   = 'newest' | 'oldest' | 'az'
type FilterKey = 'all' | 'ongoing' | 'upcoming' | 'planning' | 'completed'
type GroupKey  = 'status' | 'month' | 'none'

const SORT_LABELS:   Record<SortKey,   string> = { newest:'Newest first', oldest:'Oldest first', az:'Name A–Z' }
const FILTER_LABELS: Record<FilterKey, string> = { all:'All', ongoing:'Ongoing', upcoming:'Upcoming', planning:'Planning', completed:'Completed' }
const GROUP_LABELS:  Record<GroupKey,  string> = { status:'By Status', month:'By Month', none:'No grouping' }

function TripCard({ trip }: { trip: Trip }) {
  const router = useRouter()
  return (
    <div
      className="border border-border rounded-xl bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex cursor-pointer group"
      onClick={() => router.push(`/trips/${trip.id}/view`)}
    >
      <div className="relative w-40 shrink-0 bg-muted">
        <Image src={trip.coverImage} alt={trip.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="160px" />
      </div>
      <div className="flex-1 p-5 min-w-0 flex flex-col justify-center gap-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-base font-semibold text-foreground">{trip.name}</p>
          <Badge className={`text-[10px] capitalize shrink-0 ${STATUS_COLORS[trip.status]}`}>{trip.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {trip.stops.map(s => s.city).join(' → ')}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {trip.stops.length} {trip.stops.length === 1 ? 'stop' : 'stops'}
          </span>
        </div>
      </div>
      <div className="flex items-center pr-5" onClick={e => e.stopPropagation()}>
        <Link href={`/trips/${trip.id}/builder`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'text-xs border-border')}>
          Edit
        </Link>
      </div>
    </div>
  )
}

export default function TripsPage() {
  const [search,   setSearch]   = useState('')
  const [sortBy,   setSortBy]   = useState<SortKey>('newest')
  const [filterBy, setFilterBy] = useState<FilterKey>('all')
  const [groupBy,  setGroupBy]  = useState<GroupKey>('status')

  const [tripsData, setTripsData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTrips() {
      try {
        const data = await apiClient('/trips')
        const mappedTrips = data.map((t: any) => ({
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
        console.error('Failed to load trips:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTrips()
  }, [])

  let filtered = tripsData.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.stops.some((s: any) => s.city.toLowerCase().includes(search.toLowerCase()))
    const matchFilter = filterBy === 'all' || t.status === filterBy
    return matchSearch && matchFilter
  })

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    if (sortBy === 'oldest') return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    return a.name.localeCompare(b.name)
  })

  let sections: Array<{ label: string; accent: string; items: Trip[] }> = []
  if (groupBy === 'status') {
    const order = ['ongoing', 'upcoming', 'planning', 'completed']
    order.forEach(status => {
      const items = filtered.filter(t => t.status === status)
      if (items.length) sections.push({ label: status.charAt(0).toUpperCase() + status.slice(1), accent: STATUS_ACCENTS[status] ?? 'bg-muted-foreground', items })
    })
  } else if (groupBy === 'month') {
    const months = [...new Set(filtered.map(t => format(new Date(t.startDate), 'MMMM yyyy')))].sort()
    months.forEach(m => {
      const items = filtered.filter(t => format(new Date(t.startDate), 'MMMM yyyy') === m)
      sections.push({ label: m, accent: 'bg-primary', items })
    })
  } else {
    sections = [{ label: 'All Trips', accent: 'bg-primary', items: filtered }]
  }

  function ControlBtn({ value, set, labels }: { value: string; set: (v: any) => void; labels: Record<string, string> }) {
    const entries = Object.entries(labels) as [string, string][]
    const isActive = value !== entries[0][0]
    return (
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <button className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-border text-xs shrink-0 h-10 gap-1', isActive && 'border-primary text-primary')}>
            {labels[value]}
            {isActive && <Check className="w-3 h-3" />}
          </button>
        } />
        <DropdownMenuContent align="end" className="w-44">
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
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search trips or destinations..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background border-border h-10" />
        </div>
        <ControlBtn value={groupBy}  set={setGroupBy}  labels={GROUP_LABELS} />
        <ControlBtn value={filterBy} set={setFilterBy} labels={FILTER_LABELS} />
        <ControlBtn value={sortBy}   set={setSortBy}   labels={SORT_LABELS} />
      </div>

      {sections.map(section => (
        <section key={section.label} className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-1 h-4 rounded-full ${section.accent}`} />
            <h2 className="text-sm font-bold tracking-tight">{section.label}</h2>
            <span className="text-xs text-muted-foreground">({section.items.length})</span>
          </div>
          {section.items.map(trip => <TripCard key={trip.id} trip={trip} />)}
        </section>
      ))}

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-16">No trips match your search.</p>
      )}
    </div>
  )
}
