'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockTrips } from '@/lib/mock-data'
import { Search, ChevronDown, Pencil, Trash2, Plus, Check, X, Save } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Note {
  id: string
  title: string
  body: string
  date: string
  stop: string
  day: string
}

const NOTES_DATA: Record<string, Note[]> = {
  '1': [
    { id: '1-1', title: 'Hotel check-in – Bangkok', body: 'Novotel Siam, check-in after 2pm. Breakfast included (7–10am). Confirm airport transfer the night before.', date: '2026-06-15', stop: 'Bangkok', day: 'Day 1' },
    { id: '1-2', title: 'Elephant sanctuary booking', body: 'Booked for June 21. Pick up at 8am from hotel lobby. Bring sunscreen, comfortable shoes, and a change of clothes.', date: '2026-06-21', stop: 'Chiang Mai', day: 'Day 7' },
    { id: '1-3', title: 'Bali villa address & contacts', body: 'Villa Sari, Jl. Raya Ubud No. 88. +62 812 345 6789. Pool included, breakfast RP 120k extra per person.', date: '2026-06-25', stop: 'Bali', day: 'Day 11' },
  ],
  '2': [
    { id: '2-1', title: 'Hotel check-in – Paris', body: 'Hôtel du Louvre, check-in 3pm. Room 204. Confirm Eurostar booking for Sept 5 departure from Gare du Nord.', date: '2026-09-01', stop: 'Paris', day: 'Day 1' },
    { id: '2-2', title: 'Amsterdam canal bike tour', body: 'MacBike rental near Rijksmuseum. €18/3hr. Bring lock deposit cash. Lock bikes at designated spots only.', date: '2026-09-06', stop: 'Amsterdam', day: 'Day 6' },
  ],
  '3': [
    { id: '3-1', title: 'JR Pass activation', body: 'Activate at Tokyo station JR office on arrival day. Valid 14 days from first use. Keep the physical booklet at all times.', date: '2025-03-25', stop: 'Tokyo', day: 'Day 1' },
    { id: '3-2', title: 'Shinjuku Gyoen – best timing', body: 'Opens 9am, closes 4pm. ¥500 entry. Go early weekday mornings to avoid crowds. Inner garden has the best sakura density.', date: '2025-03-26', stop: 'Tokyo', day: 'Day 2' },
  ],
}

type SortKey   = 'newest' | 'oldest' | 'az'
type FilterKey = 'all' | 'stop' | 'day'
type GroupKey  = 'none' | 'stop' | 'day'

export default function NotesPage() {
  const [tripId, setTripId] = useState(mockTrips[0].id)
  const [notes, setNotes] = useState<Record<string, Note[]>>(NOTES_DATA)
  const [search,   setSearch]   = useState('')
  const [sortBy,   setSortBy]   = useState<SortKey>('newest')
  const [groupBy,  setGroupBy]  = useState<GroupKey>('none')
  const [showAdd,  setShowAdd]  = useState(false)
  const [newNote,  setNewNote]  = useState({ title: '', body: '' })
  const [editingId,  setEditingId]  = useState<string | null>(null)
  const [editData,   setEditData]   = useState({ title: '', body: '' })

  const currentTrip = mockTrips.find(t => t.id === tripId) ?? mockTrips[0]
  const tripNotes = notes[tripId] ?? []

  function deleteNote(id: string) {
    setNotes(prev => ({ ...prev, [tripId]: (prev[tripId] ?? []).filter(n => n.id !== id) }))
  }

  function addNote() {
    if (!newNote.title.trim()) return
    const note: Note = {
      id: `${tripId}-${Date.now()}`,
      title: newNote.title,
      body: newNote.body,
      date: new Date().toISOString().slice(0, 10),
      stop: currentTrip.stops[0]?.city ?? 'General',
      day: 'Day 1',
    }
    setNotes(prev => ({ ...prev, [tripId]: [...(prev[tripId] ?? []), note] }))
    setNewNote({ title: '', body: '' })
    setShowAdd(false)
  }

  function startEdit(note: Note) {
    setEditingId(note.id)
    setEditData({ title: note.title, body: note.body })
  }

  function saveEdit() {
    if (!editingId) return
    setNotes(prev => ({
      ...prev,
      [tripId]: (prev[tripId] ?? []).map(n => n.id === editingId ? { ...n, ...editData } : n),
    }))
    setEditingId(null)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  let filtered = tripNotes.filter(n =>
    !search ||
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.body.toLowerCase().includes(search.toLowerCase())
  )

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'oldest') return a.date.localeCompare(b.date)
    if (sortBy === 'az')     return a.title.localeCompare(b.title)
    return b.date.localeCompare(a.date)
  })

  // Build grouped sections
  let sections: Array<{ label: string; items: Note[] }> = []
  if (groupBy === 'stop') {
    const stops = [...new Set(filtered.map(n => n.stop))]
    stops.forEach(stop => {
      const items = filtered.filter(n => n.stop === stop)
      if (items.length) sections.push({ label: stop, items })
    })
  } else if (groupBy === 'day') {
    const days = [...new Set(filtered.map(n => n.day))]
    days.forEach(day => {
      const items = filtered.filter(n => n.day === day)
      if (items.length) sections.push({ label: day, items })
    })
  } else {
    sections = [{ label: '', items: filtered }]
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
          <Input placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background border-border h-10" />
        </div>
        <ControlBtn value={groupBy} set={setGroupBy} labels={{ none: 'Group by', stop: 'By Stop', day: 'By Day' }} />
        <ControlBtn value={sortBy}  set={setSortBy}  labels={{ newest: 'Newest', oldest: 'Oldest', az: 'A–Z' }} />
      </div>

      <h1 className="text-2xl font-bold tracking-tight">Trip Notes</h1>

      {/* Trip selector + Add Note */}
      <div className="flex items-center gap-3">
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

        <button
          onClick={() => setShowAdd(!showAdd)}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-border text-sm gap-1.5 h-10')}
        >
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </div>

      {/* Add note form */}
      {showAdd && (
        <div className="border border-border rounded-xl p-5 bg-card shadow-sm space-y-4">
          <h3 className="text-sm font-semibold">New Note</h3>
          <Input
            placeholder="Note title..."
            value={newNote.title}
            onChange={e => setNewNote(prev => ({ ...prev, title: e.target.value }))}
            className="bg-background border-border"
          />
          <Textarea
            placeholder="Note details..."
            value={newNote.body}
            onChange={e => setNewNote(prev => ({ ...prev, body: e.target.value }))}
            rows={4}
            className="bg-background border-border text-sm resize-none"
          />
          <div className="flex gap-2">
            <button onClick={addNote} className={cn(buttonVariants({ size: 'sm' }), 'bg-primary text-primary-foreground h-9 btn-primary-glow')}>
              Save note
            </button>
            <button onClick={() => setShowAdd(false)} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-border h-9')}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, si) => (
          <div key={section.label || si} className="space-y-3">
            {section.label && (
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-primary" />
                <h2 className="text-sm font-semibold">{section.label}</h2>
                <span className="text-xs text-muted-foreground">({section.items.length})</span>
              </div>
            )}
            {section.items.map(note => {
              const isEditing = editingId === note.id
              return (
                <div key={note.id} className="border border-border rounded-xl bg-card px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
                  {isEditing ? (
                    /* Inline edit mode */
                    <div className="space-y-3">
                      <Input
                        value={editData.title}
                        onChange={e => setEditData(prev => ({ ...prev, title: e.target.value }))}
                        className="bg-background border-border text-sm font-semibold"
                        autoFocus
                      />
                      <Textarea
                        value={editData.body}
                        onChange={e => setEditData(prev => ({ ...prev, body: e.target.value }))}
                        rows={3}
                        className="bg-background border-border text-sm resize-none"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={saveEdit}
                          className={cn(buttonVariants({ size: 'sm' }), 'bg-primary text-primary-foreground h-8 gap-1.5 text-xs btn-primary-glow')}
                        >
                          <Save className="w-3.5 h-3.5" />
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-border h-8 gap-1.5 text-xs')}
                        >
                          <X className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View mode */
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{note.title}</p>
                        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{note.body}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-muted-foreground font-medium">{note.day}</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">{note.stop}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(note)}
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12 text-sm">No notes found.</p>
        )}
      </div>
    </div>
  )
}
