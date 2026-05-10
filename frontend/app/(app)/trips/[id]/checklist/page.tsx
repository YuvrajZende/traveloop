'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { buttonVariants } from '@/components/ui/button'
import { TripFlowSteps } from '@/components/trip-flow-steps'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api'
import { BackButton } from '@/components/back-button'

interface ChecklistItem { id: string; label: string; checked: boolean }
interface Category { id: string; name: string; items: ChecklistItem[] }

// Checklists are now fetched from the API

export default function TripChecklistPage() {
  const params = useParams()
  const router = useRouter()
  const tripId = (params.id as string) ?? '1'

  const [categories, setCategories] = useState<Category[]>([])
  const [trip, setTrip] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [isAdding, setIsAdding] = useState(false)
  const [newItemLabel, setNewItemLabel] = useState('')
  const [newItemCategory, setNewItemCategory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function loadChecklist() {
      try {
        const [checklistRes, tripRes] = await Promise.all([
          apiClient(`/checklist/${tripId}`),
          apiClient(`/itinerary/view/${tripId}`) // Just to get the trip name
        ])
        setTrip(tripRes.trip)
        setCategories((checklistRes.categories || checklistRes).map((c: any) => ({
          id: c.id,
          name: c.name,
          items: c.items.map((i: any) => ({
            id: i.id,
            label: i.name,
            checked: i.is_packed
          }))
        })))
      } catch (err) {
        console.error('Failed to load checklist:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadChecklist()
  }, [tripId])

  async function toggleItem(catName: string, itemId: string) {
    // Optimistic UI update
    setCategories(prev => prev.map(cat =>
      cat.name === catName
        ? { ...cat, items: cat.items.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item) }
        : cat
    ))

    // API Call
    try {
      await apiClient(`/checklist/items/${itemId}/toggle`, { method: 'PATCH' })
    } catch (err) {
      console.error('Failed to toggle item:', err)
      // Revert if failed
      setCategories(prev => prev.map(cat =>
        cat.name === catName
          ? { ...cat, items: cat.items.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item) }
          : cat
      ))
    }
  }

  async function submitNewItem() {
    if (!newItemLabel.trim()) return
    setIsSubmitting(true)

    try {
      let targetCatId = newItemCategory
      
      // If no categories exist or none selected, create a default "Essentials" category
      if (!targetCatId) {
        if (categories.length > 0) {
          targetCatId = categories[0].id
        } else {
          const newCat = await apiClient('/checklist/categories', {
            method: 'POST',
            body: JSON.stringify({ trip_id: tripId, name: 'Essentials', sort_order: 1 })
          })
          targetCatId = newCat.id
          setCategories([{ id: newCat.id, name: newCat.name, items: [] }])
        }
      }

      const newItem = await apiClient('/checklist/items', {
        method: 'POST',
        body: JSON.stringify({ category_id: targetCatId, name: newItemLabel, sort_order: 99 })
      })

      setCategories(prev => prev.map(cat => 
        cat.id === targetCatId 
          ? { ...cat, items: [...cat.items, { id: newItem.id, label: newItem.name, checked: false }] }
          : cat
      ))
      
      setNewItemLabel('')
      setIsAdding(false)
    } catch (err) {
      console.error('Failed to add item:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const allItems = categories.flatMap(c => c.items)
  const packed = allItems.filter(i => i.checked).length
  const pct = allItems.length ? Math.round((packed / allItems.length) * 100) : 0

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto">
      {isLoading ? <div className="text-center p-8 text-muted-foreground">Loading checklist...</div> : <>
      <BackButton href={`/trips/${tripId}/builder`} />
      <TripFlowSteps current={2} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Packing Checklist</h1>
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">{trip?.title || trip?.name || 'Trip'}</span>
      </div>

      {/* Progress */}
      <div className="border border-border rounded-xl bg-card p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Packing Progress</p>
          <p className="text-sm font-bold text-primary">{pct}%</p>
        </div>
        <Progress value={pct} className="h-2.5" />
        <p className="text-xs text-muted-foreground">{packed} of {allItems.length} items packed</p>
      </div>

      <div className="flex justify-end pt-2">
        <button onClick={() => setIsAdding(true)} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-border gap-1.5')}>
          + Add item
        </button>
      </div>

      {isAdding && (
        <div className="flex items-center gap-3 border border-border rounded-xl p-4 bg-muted/30 shadow-sm animate-in fade-in slide-in-from-top-2">
          <input 
            placeholder="What do you need to pack?" 
            value={newItemLabel} 
            onChange={e => setNewItemLabel(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && submitNewItem()}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 border-border"
            autoFocus
          />
          {categories.length > 0 && (
            <select 
              value={newItemCategory} 
              onChange={e => setNewItemCategory(e.target.value)}
              className="h-10 px-3 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="" disabled>Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
          <button onClick={submitNewItem} className={cn(buttonVariants({ size: 'sm' }), "h-10 px-4")} disabled={isSubmitting}>
            {isSubmitting ? '...' : 'Add'}
          </button>
          <button onClick={() => setIsAdding(false)} className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), "h-10")}>Cancel</button>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-4">
        {categories.map(category => {
          const catPacked = category.items.filter(i => i.checked).length
          return (
            <div key={category.name} className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-5 py-3 bg-muted/40 border-b border-border">
                <span className="text-sm font-semibold">{category.name}</span>
                <span className="text-xs text-muted-foreground font-medium">{catPacked}/{category.items.length} packed</span>
              </div>
              <div className="px-5 py-4 space-y-3">
                {category.items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <Checkbox
                      id={item.id}
                      checked={item.checked}
                      onCheckedChange={() => toggleItem(category.name, item.id)}
                      className="border-border"
                    />
                    <Label htmlFor={item.id} className={cn('text-sm cursor-pointer', item.checked && 'line-through text-muted-foreground')}>
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Flow navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <button
          onClick={() => router.push(`/trips/${tripId}/builder`)}
          className={cn(buttonVariants({ variant: 'outline' }), 'gap-2 h-11 border-border')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Itinerary
        </button>
        <button
          onClick={() => router.push(`/trips/${tripId}/summary`)}
          className={cn(buttonVariants(), 'bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-11 px-6 btn-primary-glow transition-all')}
        >
          Continue to Summary
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      </>}
    </div>
  )
}
