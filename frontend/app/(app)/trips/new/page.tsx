'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { popularDestinations } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { MapPin } from 'lucide-react'
import { TripFlowSteps } from '@/components/trip-flow-steps'
import { BackButton } from '@/components/back-button'

const ALL_CITIES = [
  { city: 'Tokyo', country: 'Japan' }, { city: 'Osaka', country: 'Japan' }, { city: 'Kyoto', country: 'Japan' },
  { city: 'Nara', country: 'Japan' }, { city: 'Sapporo', country: 'Japan' }, { city: 'Fukuoka', country: 'Japan' },
  { city: 'Bangkok', country: 'Thailand' }, { city: 'Chiang Mai', country: 'Thailand' }, { city: 'Phuket', country: 'Thailand' },
  { city: 'Bali', country: 'Indonesia' }, { city: 'Jakarta', country: 'Indonesia' }, { city: 'Yogyakarta', country: 'Indonesia' },
  { city: 'Singapore', country: 'Singapore' }, { city: 'Kuala Lumpur', country: 'Malaysia' }, { city: 'Penang', country: 'Malaysia' },
  { city: 'Hanoi', country: 'Vietnam' }, { city: 'Ho Chi Minh City', country: 'Vietnam' }, { city: 'Da Nang', country: 'Vietnam' },
  { city: 'Seoul', country: 'South Korea' }, { city: 'Busan', country: 'South Korea' }, { city: 'Jeju', country: 'South Korea' },
  { city: 'Beijing', country: 'China' }, { city: 'Shanghai', country: 'China' }, { city: 'Chengdu', country: 'China' },
  { city: 'Hong Kong', country: 'Hong Kong' }, { city: 'Taipei', country: 'Taiwan' },
  { city: 'Mumbai', country: 'India' }, { city: 'Delhi', country: 'India' }, { city: 'Jaipur', country: 'India' }, { city: 'Goa', country: 'India' },
  { city: 'Dubai', country: 'UAE' }, { city: 'Abu Dhabi', country: 'UAE' }, { city: 'Doha', country: 'Qatar' },
  { city: 'Paris', country: 'France' }, { city: 'Lyon', country: 'France' }, { city: 'Nice', country: 'France' }, { city: 'Bordeaux', country: 'France' },
  { city: 'Rome', country: 'Italy' }, { city: 'Milan', country: 'Italy' }, { city: 'Florence', country: 'Italy' }, { city: 'Venice', country: 'Italy' }, { city: 'Naples', country: 'Italy' },
  { city: 'Barcelona', country: 'Spain' }, { city: 'Madrid', country: 'Spain' }, { city: 'Seville', country: 'Spain' }, { city: 'Granada', country: 'Spain' },
  { city: 'London', country: 'UK' }, { city: 'Edinburgh', country: 'UK' }, { city: 'Manchester', country: 'UK' },
  { city: 'Amsterdam', country: 'Netherlands' }, { city: 'Berlin', country: 'Germany' }, { city: 'Munich', country: 'Germany' }, { city: 'Hamburg', country: 'Germany' },
  { city: 'Vienna', country: 'Austria' }, { city: 'Salzburg', country: 'Austria' }, { city: 'Prague', country: 'Czech Republic' },
  { city: 'Budapest', country: 'Hungary' }, { city: 'Warsaw', country: 'Poland' }, { city: 'Krakow', country: 'Poland' },
  { city: 'Athens', country: 'Greece' }, { city: 'Santorini', country: 'Greece' }, { city: 'Mykonos', country: 'Greece' },
  { city: 'Lisbon', country: 'Portugal' }, { city: 'Porto', country: 'Portugal' },
  { city: 'Istanbul', country: 'Turkey' }, { city: 'Cappadocia', country: 'Turkey' },
  { city: 'Zurich', country: 'Switzerland' }, { city: 'Interlaken', country: 'Switzerland' }, { city: 'Geneva', country: 'Switzerland' },
  { city: 'Brussels', country: 'Belgium' }, { city: 'Copenhagen', country: 'Denmark' }, { city: 'Stockholm', country: 'Sweden' },
  { city: 'Oslo', country: 'Norway' }, { city: 'Helsinki', country: 'Finland' }, { city: 'Dublin', country: 'Ireland' },
  { city: 'Reykjavik', country: 'Iceland' }, { city: 'Dubrovnik', country: 'Croatia' }, { city: 'Split', country: 'Croatia' },
  { city: 'New York', country: 'USA' }, { city: 'Los Angeles', country: 'USA' }, { city: 'San Francisco', country: 'USA' },
  { city: 'Chicago', country: 'USA' }, { city: 'Miami', country: 'USA' }, { city: 'Las Vegas', country: 'USA' },
  { city: 'New Orleans', country: 'USA' }, { city: 'Seattle', country: 'USA' }, { city: 'Boston', country: 'USA' },
  { city: 'Toronto', country: 'Canada' }, { city: 'Vancouver', country: 'Canada' }, { city: 'Montreal', country: 'Canada' },
  { city: 'Mexico City', country: 'Mexico' }, { city: 'Cancun', country: 'Mexico' }, { city: 'Tulum', country: 'Mexico' },
  { city: 'Rio de Janeiro', country: 'Brazil' }, { city: 'São Paulo', country: 'Brazil' },
  { city: 'Buenos Aires', country: 'Argentina' }, { city: 'Lima', country: 'Peru' }, { city: 'Cusco', country: 'Peru' },
  { city: 'Bogotá', country: 'Colombia' }, { city: 'Cartagena', country: 'Colombia' },
  { city: 'Cairo', country: 'Egypt' }, { city: 'Luxor', country: 'Egypt' }, { city: 'Marrakech', country: 'Morocco' },
  { city: 'Cape Town', country: 'South Africa' }, { city: 'Nairobi', country: 'Kenya' }, { city: 'Zanzibar', country: 'Tanzania' },
  { city: 'Sydney', country: 'Australia' }, { city: 'Melbourne', country: 'Australia' }, { city: 'Brisbane', country: 'Australia' },
  { city: 'Auckland', country: 'New Zealand' }, { city: 'Queenstown', country: 'New Zealand' },
]

const SUGGESTED_PLACES = [
  ...popularDestinations,
  { city: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80', costIndex: '$$$', rating: 4.6 },
  { city: 'Rome', country: 'Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80', costIndex: '$$$', rating: 4.8 },
]

export default function NewTripPage() {
  const router = useRouter()
  const [form, setForm] = useState({ place: '', tripStart: '', endDate: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  function set(field: string, val: string) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  const suggestions = form.place.trim().length >= 1
    ? ALL_CITIES.filter(c =>
        c.city.toLowerCase().includes(form.place.toLowerCase()) ||
        c.country.toLowerCase().includes(form.place.toLowerCase())
      ).slice(0, 8)
    : []

  function selectSuggestion(city: string) {
    set('place', city)
    setShowSuggestions(false)
    setActiveIdx(-1)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showSuggestions || suggestions.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)) }
    if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); selectSuggestion(suggestions[activeIdx].city) }
    if (e.key === 'Escape') { setShowSuggestions(false); setActiveIdx(-1) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.place) { setError('Please select or enter a place.'); return }
    if (!form.tripStart || !form.endDate) { setError('Please select both start and end dates.'); return }
    
    setIsLoading(true)
    try {
      const { apiClient } = await import('@/lib/api')
      
      const payload = {
        title: `Trip to ${form.place}`,
        place: form.place,
        start_date: form.tripStart ? new Date(form.tripStart).toISOString().split('T')[0] : null,
        end_date: form.endDate ? new Date(form.endDate).toISOString().split('T')[0] : null,
        total_budget: 0,
        is_preplanned: false
      }
      
      const newTrip = await apiClient('/trips', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      
      router.push(`/trips/${newTrip.id}/builder`)
    } catch (err: any) {
      setError(err.message || 'Failed to create trip. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto">
      <BackButton href="/trips" />
      <TripFlowSteps current={0} />

      <h1 className="text-2xl font-bold tracking-tight">Plan a new trip</h1>

      <div className="border border-border rounded-2xl bg-card p-6 shadow-sm space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Place autocomplete */}
          <div className="grid grid-cols-[10rem_1fr] items-start gap-4">
            <Label className="text-sm font-medium pt-2.5">Select a Place :</Label>
            <div className="relative">
              <Input
                ref={inputRef}
                placeholder="Type a city or country..."
                value={form.place}
                onChange={e => { set('place', e.target.value); setShowSuggestions(true); setActiveIdx(-1) }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={handleKeyDown}
                className="bg-background border-border h-10"
                autoComplete="off"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 border border-border rounded-xl bg-popover shadow-lg overflow-hidden">
                  {suggestions.map((s, idx) => (
                    <button
                      key={`${s.city}-${s.country}`}
                      type="button"
                      onMouseDown={() => selectSuggestion(s.city)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted transition-colors',
                        idx === activeIdx && 'bg-muted'
                      )}
                    >
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="text-sm font-medium">{s.city}</span>
                      <span className="text-xs text-muted-foreground">{s.country}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[10rem_1fr] items-center gap-4">
            <Label className="text-sm font-medium">Start Date :</Label>
            <DatePicker value={form.tripStart} onChange={v => set('tripStart', v)} placeholder="Select start date" />
          </div>

          <div className="grid grid-cols-[10rem_1fr] items-center gap-4">
            <Label className="text-sm font-medium">End Date :</Label>
            <DatePicker value={form.endDate} onChange={v => set('endDate', v)} placeholder="Select end date" />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="pt-1">
            <button type="submit" disabled={isLoading} className={cn(buttonVariants(), 'bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 btn-primary-glow transition-all disabled:opacity-50')}>
              {isLoading ? 'Creating trip...' : 'Continue to Build Itinerary'}
            </button>
          </div>
        </form>
      </div>

      {/* Suggestions */}
      <div>
        <div className="border border-border rounded-lg px-4 py-3 bg-muted/30 mb-4">
          <h2 className="text-sm font-semibold">Suggestions for Places to Visit / Activities to Perform</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {SUGGESTED_PLACES.slice(0, 6).map(dest => (
            <Card
              key={dest.city}
              className="overflow-hidden border-border cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              onClick={() => { set('place', dest.city); inputRef.current?.focus() }}
            >
              <div className="relative h-32 bg-muted">
                <Image src={dest.image} alt={dest.city} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="250px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-semibold">{dest.city}</p>
                  <p className="text-white/70 text-xs">{dest.country}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
