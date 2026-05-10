'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, MapPin, Clock, DollarSign, Globe, Star, Check, Compass, Mountain, Utensils, ShoppingBag, Camera, Palette, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api'
import { BackButton } from '@/components/back-button'

/* ── Types ─────────────────────────── */
interface Activity {
  id: string
  name: string
  description: string | null
  location: string | null
  activity_type: string | null
  estimated_cost: number | null
  start_time: string | null
  end_time: string | null
  section_title: string | null
  trip_title: string | null
  place: string | null
}

interface City {
  id: string
  name: string
  country: string | null
  description: string | null
  image_url: string | null
  popularity_score: number
  suggestion_count: number
}

/* ── Helpers ───────────────────────── */
const TYPE_ICONS: Record<string, any> = {
  sightseeing: Camera,
  food: Utensils,
  adventure: Mountain,
  shopping: ShoppingBag,
  culture: Palette,
  relaxation: Sparkles,
  other: Compass,
}

function formatDuration(start: string | null, end: string | null): string {
  if (!start || !end) return '—'
  const ms = new Date(end).getTime() - new Date(start).getTime()
  const hrs = Math.round(ms / 3600000 * 10) / 10
  if (hrs < 1) return `${Math.round(hrs * 60)}min`
  return `${hrs}h`
}

function formatCost(cost: number | null): string {
  if (cost === null || cost === undefined) return '—'
  return `$${Number(cost).toLocaleString()}`
}

type Tab = 'activities' | 'cities'
type SortActivity = 'name' | 'estimated_cost' | 'created_at'
type SortCity = 'name' | 'popularity_score' | 'country'
type GroupBy = 'none' | 'type' | 'place'
type ActivityType = '' | 'sightseeing' | 'food' | 'adventure' | 'shopping' | 'culture' | 'relaxation' | 'other'
type Duration = '' | 'short' | 'medium' | 'long'

export default function SearchPage() {
  const [tab, setTab] = useState<Tab>('activities')
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  /* Activity states */
  const [activities, setActivities] = useState<Activity[]>([])
  const [groupedActivities, setGroupedActivities] = useState<Record<string, Activity[]> | null>(null)
  const [activitySort, setActivitySort] = useState<SortActivity>('name')
  const [activityGroupBy, setActivityGroupBy] = useState<GroupBy>('none')
  const [activityType, setActivityType] = useState<ActivityType>('')
  const [activityDuration, setActivityDuration] = useState<Duration>('')

  /* City states */
  const [cities, setCities] = useState<City[]>([])
  const [citySort, setCitySort] = useState<SortCity>('popularity_score')

  const [isLoading, setIsLoading] = useState(false)

  /* Debounce query */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400)
    return () => clearTimeout(t)
  }, [query])

  /* Fetch activities */
  const fetchActivities = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedQuery) params.set('q', debouncedQuery)
      if (activityType) params.set('type', activityType)
      if (activityDuration) params.set('duration', activityDuration)
      if (activitySort) params.set('sort_by', activitySort)
      if (activityGroupBy !== 'none') params.set('group_by', activityGroupBy)
      params.set('order', 'asc')

      const data = await apiClient(`/search/activities?${params.toString()}`)

      if (data?.grouped) {
        setGroupedActivities(data.data)
        setActivities([])
      } else {
        setGroupedActivities(null)
        setActivities(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Activity search failed:', err)
      setActivities([])
      setGroupedActivities(null)
    } finally {
      setIsLoading(false)
    }
  }, [debouncedQuery, activityType, activityDuration, activitySort, activityGroupBy])

  /* Fetch cities */
  const fetchCities = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedQuery) params.set('q', debouncedQuery)
      if (citySort) params.set('sort_by', citySort)
      params.set('order', 'desc')

      const data = await apiClient(`/search/cities?${params.toString()}`)
      setCities(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('City search failed:', err)
      setCities([])
    } finally {
      setIsLoading(false)
    }
  }, [debouncedQuery, citySort])

  useEffect(() => {
    if (tab === 'activities') fetchActivities()
    else fetchCities()
  }, [tab, fetchActivities, fetchCities])

  /* ── Render helpers ──────────────── */
  function ActivityCard({ result }: { result: Activity }) {
    const TypeIcon = TYPE_ICONS[result.activity_type || 'other'] || Compass
    return (
      <div className="border border-border rounded-xl bg-card hover:shadow-md transition-all duration-200 cursor-pointer shadow-sm group">
        <div className="px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <TypeIcon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm font-semibold truncate">{result.name}</p>
            </div>
            {result.description && (
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{result.description}</p>
            )}
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{result.location || result.place || 'Unknown location'}</span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              {result.activity_type && (
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium capitalize">{result.activity_type}</span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(result.start_time, result.end_time)}
              </span>
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <DollarSign className="w-3.5 h-3.5" />
                {formatCost(result.estimated_cost)}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  function CityCard({ city }: { city: City }) {
    const initials = city.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    return (
      <div className="border border-border rounded-xl bg-card hover:shadow-md transition-all duration-200 cursor-pointer shadow-sm group">
        <div className="px-5 py-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
            <span className="text-sm font-bold text-primary">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{city.name}</p>
            {city.country && (
              <p className="text-xs text-muted-foreground mt-0.5">{city.country}</p>
            )}
            {city.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{city.description}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-medium">Score: {city.popularity_score}</span>
              </span>
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                {city.suggestion_count} suggestion{city.suggestion_count !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  function ControlDropdown({ value, set, labels }: { value: string; set: (v: any) => void; labels: Record<string, string> }) {
    const entries = Object.entries(labels) as [string, string][]
    const defaultKey = entries[0][0]
    const isActive = value !== defaultKey
    return (
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <button className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'border-border text-xs shrink-0 h-10 gap-1 bg-background',
            isActive && 'border-primary text-primary'
          )}>
            {labels[value] || labels[defaultKey]}
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

  const totalResults = tab === 'activities'
    ? (groupedActivities ? Object.values(groupedActivities).reduce((s, a) => s + a.length, 0) : activities.length)
    : cities.length

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto pb-16">
      <BackButton href="/dashboard" />
      {/* Search bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={tab === 'activities' ? 'Search activities, places...' : 'Search cities, countries...'}
            className="pl-9 bg-background border-border h-10"
          />
        </div>
        {tab === 'activities' && (
          <>
            <ControlDropdown
              value={activityGroupBy}
              set={setActivityGroupBy}
              labels={{ none: 'Group by', type: 'By Type', place: 'By Place' }}
            />
            <ControlDropdown
              value={activityType}
              set={setActivityType}
              labels={{ '': 'Filter', sightseeing: 'Sightseeing', food: 'Food', adventure: 'Adventure', shopping: 'Shopping', culture: 'Culture', relaxation: 'Relaxation', other: 'Other' }}
            />
            <ControlDropdown
              value={activitySort}
              set={setActivitySort}
              labels={{ name: 'Sort: A–Z', estimated_cost: 'Sort: Cost', created_at: 'Sort: Newest' }}
            />
          </>
        )}
        {tab === 'cities' && (
          <ControlDropdown
            value={citySort}
            set={setCitySort}
            labels={{ popularity_score: 'Sort: Popular', name: 'Sort: A–Z', country: 'Sort: Country' }}
          />
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-muted/30 w-fit">
        <button
          onClick={() => setTab('activities')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md transition-all',
            tab === 'activities'
              ? 'bg-background shadow-sm text-foreground border border-border'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Compass className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
          Activities
        </button>
        <button
          onClick={() => setTab('cities')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md transition-all',
            tab === 'cities'
              ? 'bg-background shadow-sm text-foreground border border-border'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Globe className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
          Cities
        </button>
      </div>

      {/* Duration quick-filter for activities */}
      {tab === 'activities' && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Duration:</span>
          {(['', 'short', 'medium', 'long'] as Duration[]).map(d => (
            <button
              key={d}
              onClick={() => setActivityDuration(d)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full border transition-all',
                activityDuration === d
                  ? 'bg-primary/10 text-primary border-primary font-medium'
                  : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
              )}
            >
              {d === '' ? 'All' : d === 'short' ? '< 2h' : d === 'medium' ? '2–5h' : '> 5h'}
            </button>
          ))}
        </div>
      )}

      {/* Results header */}
      <h2 className="text-2xl font-bold tracking-tight">
        Results
        {!isLoading && <span className="text-sm text-muted-foreground font-normal ml-2">({totalResults})</span>}
      </h2>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-12 text-muted-foreground animate-pulse">
          Searching...
        </div>
      )}

      {/* Activity results */}
      {!isLoading && tab === 'activities' && (
        <div className="space-y-6">
          {groupedActivities ? (
            Object.entries(groupedActivities).map(([group, items]) => (
              <div key={group} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full bg-primary" />
                  <h3 className="text-sm font-semibold capitalize">{group}</h3>
                  <span className="text-xs text-muted-foreground">({items.length})</span>
                </div>
                <div className="space-y-3">
                  {items.map((a: Activity) => <ActivityCard key={a.id} result={a} />)}
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-3">
              {activities.map(a => <ActivityCard key={a.id} result={a} />)}
            </div>
          )}

          {!groupedActivities && activities.length === 0 && (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Compass className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">
                {debouncedQuery ? `No activities found for "${debouncedQuery}"` : 'Search for activities across all trips'}
              </p>
              <p className="text-xs text-muted-foreground">Try searching for "sightseeing", "food", or a city name</p>
            </div>
          )}
        </div>
      )}

      {/* City results */}
      {!isLoading && tab === 'cities' && (
        <div className="space-y-3">
          {cities.map(c => <CityCard key={c.id} city={c} />)}

          {cities.length === 0 && (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Globe className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">
                {debouncedQuery ? `No cities found for "${debouncedQuery}"` : 'Browse popular travel destinations'}
              </p>
              <p className="text-xs text-muted-foreground">Try searching for a country or city name</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
