'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { buttonVariants } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { TripFlowSteps } from '@/components/trip-flow-steps'
import { cn } from '@/lib/utils'
import { Plus, Trash2, ArrowRight } from 'lucide-react'
import { apiClient } from '@/lib/api'

interface Section {
  id: string
  title: string
  description: string
  dateFrom: string
  dateTo: string
  budget: string
}

// Start with an empty array instead of initial mock sections

export default function BuilderPage() {
  const params = useParams()
  const router = useRouter()
  const tripId = (params.id as string) ?? '1'
  const [sections, setSections] = useState<Section[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadSections() {
      try {
        const data = await apiClient(`/itinerary/sections/${tripId}`)
        if (data.length > 0) {
          setSections(data.map((s: any) => ({
            id: s.id,
            title: s.title,
            description: s.description || '',
            dateFrom: s.start_date ? s.start_date.split('T')[0] : '',
            dateTo: s.end_date ? s.end_date.split('T')[0] : '',
            budget: s.budget || ''
          })))
        } else {
          // If no sections exist, add a default one
          setSections([{
            id: `temp-${Date.now()}`,
            title: 'Section 1:',
            description: 'Add details about this part of your trip.',
            dateFrom: '',
            dateTo: '',
            budget: '',
          }])
        }
      } catch (err) {
        console.error('Failed to load sections:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadSections()
  }, [tripId])

  function addSection() {
    setSections(prev => [...prev, {
      id: `temp-${Date.now()}`,
      title: `Section ${prev.length + 1}:`,
      description: 'All the necessary information about this section. This can be anything like travel section, hotel or any other activity',
      dateFrom: '',
      dateTo: '',
      budget: '',
    }])
  }

  async function removeSection(id: string) {
    if (!id.startsWith('temp-')) {
      try {
        await apiClient(`/itinerary/sections/${id}`, { method: 'DELETE' })
      } catch (err) {
        console.error('Failed to delete section:', err)
      }
    }

    setSections(prev => {
      const remaining = prev.filter(s => s.id !== id)
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

  async function handleContinue() {
    setIsSaving(true)
    try {
      await Promise.all(sections.map(async (sec, idx) => {
        const payload = {
          trip_id: tripId,
          section_number: idx + 1,
          title: sec.title,
          description: sec.description,
          start_date: sec.dateFrom || null,
          end_date: sec.dateTo || null,
          budget: sec.budget || 0
        }

        if (sec.id.startsWith('temp-')) {
          await apiClient('/itinerary/sections', { method: 'POST', body: JSON.stringify(payload) })
        } else {
          await apiClient(`/itinerary/sections/${sec.id}`, { method: 'PUT', body: JSON.stringify(payload) })
        }
      }))
      router.push(`/trips/${tripId}/checklist`)
    } catch (err) {
      console.error('Failed to save sections:', err)
      alert('Failed to save itinerary sections.')
    } finally {
      setIsSaving(false)
    }
  }

  function updateSection(id: string, field: keyof Section, value: string) {
    setSections(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  return (
    <div className="p-6 md:p-8 space-y-4 max-w-3xl mx-auto">
      {isLoading ? <div className="text-center p-8 text-muted-foreground">Loading sections...</div> : <>
      <TripFlowSteps current={1} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Build Itinerary</h1>
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">{sections.length} sections</span>
      </div>

      {sections.map((section, idx) => (
        <div key={section.id} className="border border-border rounded-xl p-6 bg-card shadow-sm hover:shadow-md transition-shadow relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">{section.title}</h2>
            <button 
              onClick={() => removeSection(section.id)} 
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <Textarea
              placeholder="All the necessary information about this section. This can be anything like travel section, hotel or any other activity"
              value={section.description}
              onChange={e => updateSection(section.id, 'description', e.target.value)}
              rows={3}
              className="resize-none bg-background text-sm font-medium border-border"
            />
            
            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
              <div className="border border-border rounded-lg bg-background flex items-center px-4 h-12 shadow-sm gap-2">
                <span className="text-sm font-medium text-muted-foreground shrink-0">Date Range:</span>
                <DatePicker
                  value={section.dateFrom}
                  onChange={v => updateSection(section.id, 'dateFrom', v)}
                  placeholder="Start"
                  className="border-0 shadow-none h-8 px-2 bg-transparent hover:bg-muted/50 min-w-[100px]"
                />
                <span className="text-sm font-medium text-muted-foreground shrink-0">to</span>
                <DatePicker
                  value={section.dateTo}
                  onChange={v => updateSection(section.id, 'dateTo', v)}
                  placeholder="End"
                  className="border-0 shadow-none h-8 px-2 bg-transparent hover:bg-muted/50 min-w-[100px]"
                />
              </div>
              <div className="border border-border rounded-lg bg-background flex items-center px-4 h-12 shadow-sm">
                <Input
                  placeholder="Budget of this section"
                  value={section.budget}
                  onChange={e => updateSection(section.id, 'budget', e.target.value)}
                  className="bg-transparent border-0 h-auto p-0 shadow-none focus-visible:ring-0 text-sm font-medium placeholder:text-muted-foreground placeholder:font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Add another section button */}
      <button 
        onClick={addSection}
        className="w-full flex items-center justify-center gap-2 border border-border bg-card hover:bg-muted/50 rounded-xl py-4 transition-colors font-medium text-foreground shadow-sm"
      >
        <Plus className="w-5 h-5" />
        Add another Section
      </button>

      <div className="flex justify-end pt-4 border-t border-border mt-8">
        <button
          onClick={handleContinue}
          disabled={isSaving}
          className={cn(buttonVariants(), 'bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-semibold transition-all shadow-sm disabled:opacity-50')}
        >
          {isSaving ? 'Saving...' : (
            <>Continue to Packing Checklist <ArrowRight className="w-5 h-5 ml-2" /></>
          )}
        </button>
      </div>
      </>}
    </div>
  )
}
