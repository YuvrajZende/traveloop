'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { buttonVariants } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockTrips } from '@/lib/mock-data'
import { Search, ChevronDown, Check, ClipboardCopy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChecklistItem { id: string; label: string; checked: boolean }
interface Category { name: string; items: ChecklistItem[] }

const CHECKLISTS: Record<string, Category[]> = {
  '1': [
    { name: 'Documents', items: [
      { id: 'd1', label: 'Passport', checked: true },
      { id: 'd2', label: 'Flight Tickets (printed)', checked: true },
      { id: 'd3', label: 'Travel insurance', checked: true },
      { id: 'd4', label: 'Hotel booking confirmation', checked: false },
    ]},
    { name: 'Clothing', items: [
      { id: 'c1', label: 'Casual Shirts', checked: true },
      { id: 'c2', label: 'Trousers / Jeans', checked: false },
      { id: 'c3', label: 'Comfortable walking shoes', checked: false },
      { id: 'c4', label: 'Light jacket / windbreaker', checked: false },
    ]},
    { name: 'Electronics', items: [
      { id: 'e1', label: 'Phone charger', checked: true },
      { id: 'e2', label: 'Universal power adapter', checked: false },
      { id: 'e3', label: 'Earphones / headphones', checked: false },
    ]},
  ],
  '2': [
    { name: 'Documents', items: [
      { id: 'p1', label: 'Passport', checked: false },
      { id: 'p2', label: 'Rail Pass (Eurail)', checked: false },
      { id: 'p3', label: 'Travel insurance', checked: false },
    ]},
    { name: 'Clothing', items: [
      { id: 'p4', label: 'Warm layers', checked: false },
      { id: 'p5', label: 'Rain jacket', checked: false },
      { id: 'p6', label: 'Comfortable walking shoes', checked: false },
    ]},
    { name: 'Gear', items: [
      { id: 'p7', label: 'Backpack (carry-on size)', checked: false },
      { id: 'p8', label: 'Travel pillow', checked: false },
      { id: 'p9', label: 'Portable charger', checked: false },
    ]},
  ],
  '3': [
    { name: 'Documents', items: [
      { id: 'j1', label: 'Passport', checked: true },
      { id: 'j2', label: 'JR Pass', checked: true },
      { id: 'j3', label: 'SUICA card', checked: false },
    ]},
    { name: 'Clothing', items: [
      { id: 'j4', label: 'Light spring jacket', checked: false },
      { id: 'j5', label: 'Comfortable walking shoes', checked: false },
      { id: 'j6', label: 'Yukata (optional)', checked: false },
    ]},
    { name: 'Essentials', items: [
      { id: 'j7', label: 'Portable WiFi / SIM card', checked: true },
      { id: 'j8', label: 'IC card (transit)', checked: false },
      { id: 'j9', label: 'Cash (Yen)', checked: false },
    ]},
  ],
}

type SortKey   = 'category' | 'az' | 'status'
type FilterKey = 'all' | 'packed' | 'unpacked'

export default function ChecklistPage() {
  const [tripId,   setTripId]   = useState(mockTrips[0].id)
  const [search,   setSearch]   = useState('')
  const [sortBy,   setSortBy]   = useState<SortKey>('category')
  const [filterBy, setFilterBy] = useState<FilterKey>('all')
  const [copied,   setCopied]   = useState(false)
  const [categories, setCategories] = useState<Record<string, Category[]>>(CHECKLISTS)

  const currentTrip = mockTrips.find(t => t.id === tripId) ?? mockTrips[0]
  const cats = categories[tripId] ?? CHECKLISTS['1']

  function toggleItem(catName: string, itemId: string) {
    setCategories(prev => ({
      ...prev,
      [tripId]: (prev[tripId] ?? CHECKLISTS['1']).map(cat =>
        cat.name === catName
          ? { ...cat, items: cat.items.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item) }
          : cat
      )
    }))
  }

  function resetAll() {
    setCategories(prev => ({
      ...prev,
      [tripId]: (prev[tripId] ?? CHECKLISTS['1']).map(cat => ({
        ...cat, items: cat.items.map(item => ({ ...item, checked: false }))
      }))
    }))
  }

  function shareChecklist() {
    const lines = [`📋 Packing Checklist — ${currentTrip.name}`, '']
    cats.forEach(cat => {
      lines.push(`## ${cat.name}`)
      cat.items.forEach(item => lines.push(`${item.checked ? '✅' : '⬜'} ${item.label}`))
      lines.push('')
    })
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const allItems = cats.flatMap(c => c.items)
  const packedCount = allItems.filter(i => i.checked).length
  const pct = allItems.length ? Math.round((packedCount / allItems.length) * 100) : 0

  // Build filtered/sorted display categories
  const displayCats = cats
    .map(cat => {
      let items = cat.items
      if (search) items = items.filter(i => i.label.toLowerCase().includes(search.toLowerCase()))
      if (filterBy === 'packed')   items = items.filter(i => i.checked)
      if (filterBy === 'unpacked') items = items.filter(i => !i.checked)
      if (sortBy === 'az')     items = [...items].sort((a, b) => a.label.localeCompare(b.label))
      if (sortBy === 'status') items = [...items].sort((a, b) => Number(b.checked) - Number(a.checked))
      return { ...cat, items }
    })
    .filter(cat => cat.items.length > 0)

  function ControlBtn({ value, set, labels, prefix }: { value: string; set: (v: any) => void; labels: Record<string, string>; prefix?: string }) {
    const entries = Object.entries(labels) as [string, string][]
    const isActive = value !== entries[0][0]
    return (
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <button className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-border text-xs shrink-0 h-10 gap-1', isActive && 'border-primary text-primary')}>
            {prefix ?? ''}{labels[value]}
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
    <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto">
      {/* Controls */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background border-border h-10" />
        </div>
        <ControlBtn value="category" set={() => {}} labels={{ category: 'Group by' }} />
        <ControlBtn value={filterBy} set={setFilterBy} labels={{ all: 'All', packed: 'Packed', unpacked: 'Unpacked' }} />
        <ControlBtn value={sortBy}   set={setSortBy}   labels={{ category: 'Category', az: 'A–Z', status: 'Status' }} />
      </div>

      <h1 className="text-2xl font-bold tracking-tight">Packing checklist</h1>

      {/* Trip selector dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <button className="flex items-center gap-2 border border-border rounded-lg px-4 py-2.5 bg-background cursor-pointer hover:bg-muted/30 transition-colors text-sm font-medium">
            Trip: {currentTrip.name}
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
        } />
        <DropdownMenuContent align="start" className="w-64">
          {mockTrips.map(trip => (
            <DropdownMenuItem key={trip.id} onClick={() => setTripId(trip.id)}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{trip.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{trip.status}</p>
              </div>
              {trip.id === tripId && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Progress */}
      <div className="border border-border rounded-xl bg-card p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Packing Progress</p>
          <p className="text-sm font-bold text-primary">{pct}%</p>
        </div>
        <Progress value={pct} className="h-2.5" />
        <p className="text-xs text-muted-foreground">{packedCount} of {allItems.length} items packed</p>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {displayCats.map(category => {
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
                    <Checkbox id={item.id} checked={item.checked} onCheckedChange={() => toggleItem(category.name, item.id)} className="border-border" />
                    <Label htmlFor={item.id} className={cn('text-sm cursor-pointer', item.checked && 'line-through text-muted-foreground')}>
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        {displayCats.length === 0 && (
          <p className="text-center text-muted-foreground py-8 text-sm">No items match your filter.</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button className={cn(buttonVariants({ variant: 'outline' }), 'flex-1 border-border text-sm gap-1.5 h-10')}>
          + Add item
        </button>
        <button onClick={resetAll} className={cn(buttonVariants({ variant: 'outline' }), 'border-border text-sm h-10')}>
          Reset all
        </button>
        <button
          onClick={shareChecklist}
          className={cn(buttonVariants(), 'bg-primary text-primary-foreground hover:bg-primary/90 text-sm h-10 gap-2 transition-all btn-primary-glow', copied && 'bg-primary/80')}
        >
          <ClipboardCopy className="w-4 h-4" />
          {copied ? 'Copied!' : 'Share Checklist'}
        </button>
      </div>
    </div>
  )
}
