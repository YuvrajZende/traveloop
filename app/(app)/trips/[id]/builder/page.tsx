'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { buttonVariants } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { TripFlowSteps } from '@/components/trip-flow-steps'
import { cn } from '@/lib/utils'
import { Plus, Trash2, ArrowRight } from 'lucide-react'

interface Section {
  id: string
  title: string
  description: string
  dateFrom: string
  dateTo: string
  budget: string
}

const INITIAL_SECTIONS: Section[] = [
  { id: '1', title: 'Section 1: Arrival & Check-in', description: 'Hotel check-in, transfer from airport, settle in and explore the neighborhood.', dateFrom: '2026-06-15', dateTo: '2026-06-20', budget: '500' },
  { id: '2', title: 'Section 2: City Exploration', description: 'Museum visits, walking tours, local cuisine tasting, and guided city experiences.', dateFrom: '2026-06-20', dateTo: '2026-06-25', budget: '400' },
  { id: '3', title: 'Section 3: Day Trips', description: 'Excursions to nearby towns, natural landmarks, and cultural heritage sites.', dateFrom: '2026-06-25', dateTo: '2026-07-05', budget: '900' },
]

export default function BuilderPage() {
  const params = useParams()
  const router = useRouter()
  const tripId = (params.id as string) ?? '1'
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS)

  function addSection() {
    setSections(prev => [...prev, {
      id: String(Date.now()),
      title: `Section ${prev.length + 1}:`,
      description: 'Add details about this part of your trip — activities, stays, or transport.',
      dateFrom: '',
      dateTo: '',
      budget: '',
    }])
  }

  function removeSection(id: string) {
    setSections(prev => {
      const remaining = prev.filter(s => s.id !== id)
      // Renumber sections that still have the "Section N:" prefix
      let counter = 1
      return remaining.map(s => {
        if (/^Section \d+:/.test(s.title)) {
          const updated = { ...s, title: s.title.replace(/^Section \d+:/, `Section ${counter}:`) }
          counter++
          return updated
        }
        return s
      })
    })
  }

  function updateSection(id: string, field: keyof Section, value: string) {
    setSections(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  return (
    <div className="p-6 md:p-8 space-y-4 max-w-3xl mx-auto">
      <TripFlowSteps current={1} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Build Itinerary</h1>
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">{sections.length} sections</span>
      </div>

      {sections.map((section, idx) => (
        <div key={section.id} className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
          {/* Section header strip */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-muted/30">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
              {idx + 1}
            </span>
            <Input
              value={section.title}
              onChange={e => updateSection(section.id, 'title', e.target.value)}
              className="border-0 bg-transparent p-0 h-auto text-sm font-semibold shadow-none focus-visible:ring-0 flex-1"
            />
            <button
              onClick={() => removeSection(section.id)}
              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">{section.description}</p>

            <div className="grid grid-cols-2 gap-3">
              {/* Date range */}
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">Start Date</p>
                <DatePicker
                  value={section.dateFrom}
                  onChange={v => updateSection(section.id, 'dateFrom', v)}
                  placeholder="Start date"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">End Date</p>
                <DatePicker
                  value={section.dateTo}
                  onChange={v => updateSection(section.id, 'dateTo', v)}
                  placeholder="End date"
                />
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Section Budget</p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">$</span>
                <Input
                  placeholder="0"
                  value={section.budget}
                  onChange={e => updateSection(section.id, 'budget', e.target.value)}
                  className="pl-7 bg-background border-border h-10"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addSection}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'w-full border-dashed border-border gap-2 text-sm font-medium h-12 hover:border-primary hover:text-primary transition-colors'
        )}
      >
        <Plus className="w-4 h-4" />
        Add another Section
      </button>

      {/* Flow navigation */}
      <div className="flex items-center justify-end pt-2 border-t border-border">
        <button
          onClick={() => router.push(`/trips/${tripId}/checklist`)}
          className={cn(buttonVariants(), 'bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-11 px-6 btn-primary-glow transition-all')}
        >
          Continue to Packing Checklist
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
