'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { buttonVariants } from '@/components/ui/button'
import { TripFlowSteps } from '@/components/trip-flow-steps'
import { mockTrips } from '@/lib/mock-data'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChecklistItem { id: string; label: string; checked: boolean }
interface Category { name: string; items: ChecklistItem[] }

const CHECKLISTS: Record<string, Category[]> = {
  '1': [
    { name: 'Documents', items: [
      { id: 'd1', label: 'Passport', checked: true },
      { id: 'd2', label: 'Flight Tickets', checked: true },
      { id: 'd3', label: 'Travel Insurance', checked: true },
      { id: 'd4', label: 'Hotel Confirmation', checked: false },
    ]},
    { name: 'Clothing', items: [
      { id: 'c1', label: 'Casual Shirts', checked: true },
      { id: 'c2', label: 'Trousers / Shorts', checked: false },
      { id: 'c3', label: 'Walking Shoes', checked: false },
      { id: 'c4', label: 'Light Jacket', checked: false },
    ]},
    { name: 'Electronics', items: [
      { id: 'e1', label: 'Phone Charger', checked: true },
      { id: 'e2', label: 'Universal Adapter', checked: false },
      { id: 'e3', label: 'Earphones', checked: false },
    ]},
  ],
  '2': [
    { name: 'Documents', items: [
      { id: 'p1', label: 'Passport', checked: false },
      { id: 'p2', label: 'Eurail Pass', checked: false },
      { id: 'p3', label: 'Travel Insurance', checked: false },
    ]},
    { name: 'Clothing', items: [
      { id: 'p4', label: 'Warm Layers', checked: false },
      { id: 'p5', label: 'Rain Jacket', checked: false },
      { id: 'p6', label: 'Walking Shoes', checked: false },
    ]},
    { name: 'Gear', items: [
      { id: 'p7', label: 'Carry-On Backpack', checked: false },
      { id: 'p8', label: 'Travel Pillow', checked: false },
      { id: 'p9', label: 'Portable Charger', checked: false },
    ]},
  ],
  '3': [
    { name: 'Documents', items: [
      { id: 'j1', label: 'Passport', checked: true },
      { id: 'j2', label: 'JR Pass', checked: true },
      { id: 'j3', label: 'SUICA Card', checked: false },
    ]},
    { name: 'Clothing', items: [
      { id: 'j4', label: 'Light Spring Jacket', checked: false },
      { id: 'j5', label: 'Walking Shoes', checked: false },
    ]},
    { name: 'Essentials', items: [
      { id: 'j7', label: 'Portable WiFi / SIM', checked: true },
      { id: 'j8', label: 'Cash (Yen)', checked: false },
    ]},
  ],
}

export default function TripChecklistPage() {
  const params = useParams()
  const router = useRouter()
  const tripId = (params.id as string) ?? '1'

  const trip = mockTrips.find(t => t.id === tripId) ?? mockTrips[0]
  const fallbackCats = CHECKLISTS['1']
  const [categories, setCategories] = useState<Category[]>(CHECKLISTS[tripId] ?? fallbackCats)

  function toggleItem(catName: string, itemId: string) {
    setCategories(prev => prev.map(cat =>
      cat.name === catName
        ? { ...cat, items: cat.items.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item) }
        : cat
    ))
  }

  const allItems = categories.flatMap(c => c.items)
  const packed = allItems.filter(i => i.checked).length
  const pct = allItems.length ? Math.round((packed / allItems.length) * 100) : 0

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto">
      <TripFlowSteps current={2} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Packing Checklist</h1>
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">{trip.name}</span>
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
    </div>
  )
}
