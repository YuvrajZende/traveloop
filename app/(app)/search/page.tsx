'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { buttonVariants } from '@/components/ui/button'
import { Search, MapPin, Clock, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

const RESULTS = [
  { name: 'Paragliding in Interlaken', location: 'Interlaken, Switzerland', cost: '$150', duration: '2h', type: 'Adventure' },
  { name: 'Paragliding in Queenstown', location: 'Queenstown, New Zealand', cost: '$180', duration: '3h', type: 'Adventure' },
  { name: 'Paragliding in Pokhara', location: 'Pokhara, Nepal', cost: '$80', duration: '1.5h', type: 'Adventure' },
  { name: 'Paragliding in Oludeniz', location: 'Oludeniz, Turkey', cost: '$90', duration: '2h', type: 'Adventure' },
  { name: 'Tandem Paragliding at Bir Billing', location: 'Himachal Pradesh, India', cost: '$60', duration: '1.5h', type: 'Adventure' },
  { name: 'Coastal Paragliding Tour', location: 'Rio de Janeiro, Brazil', cost: '$120', duration: '2.5h', type: 'Adventure' },
  { name: 'Alpine Paragliding Experience', location: 'Chamonix, France', cost: '$200', duration: '3h', type: 'Adventure' },
]

export default function SearchPage() {
  const [query, setQuery] = useState('Paragliding')

  const filtered = RESULTS.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase()) ||
    r.location.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto">
      {/* Search bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search activities, places..."
            className="pl-9 bg-background border-border h-10"
          />
        </div>
        <button className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-border text-xs shrink-0 h-10')}>Group by</button>
        <button className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-border text-xs shrink-0 h-10')}>Filter</button>
        <button className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-border text-xs shrink-0 h-10')}>Sort by...</button>
      </div>

      {/* Results */}
      <div>
        <h2 className="text-base font-semibold mb-4">Results ({filtered.length})</h2>
        <div className="space-y-3">
          {filtered.map((result, i) => (
            <div
              key={i}
              className="border border-border rounded-xl bg-card hover:shadow-md transition-shadow cursor-pointer shadow-sm"
            >
              <div className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{result.name}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    {result.location}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{result.type}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {result.duration}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <DollarSign className="w-3.5 h-3.5" />
                      {result.cost.replace('$', '')}
                    </span>
                  </div>
                </div>
                <button className={cn(buttonVariants({ size: 'sm' }), 'bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 h-9')}>
                  Add to Trip
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
