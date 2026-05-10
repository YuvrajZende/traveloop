'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, ChevronDown, Pencil, Trash2, Plus, Check, X, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api'

interface Note {
  id: string
  title: string
  body: string
  date: string
  day: string
}

type SortKey   = 'newest' | 'oldest' | 'az'
type GroupKey  = 'none' | 'day'

export default function NotesPage() {
  const [trips, setTrips] = useState<any[]>([])
  const [tripId, setTripId] = useState<string>('')
  const [notes, setNotes] = useState<Note[]>([])
  
  const [search,   setSearch]   = useState('')
  const [sortBy,   setSortBy]   = useState<SortKey>('newest')
  const [groupBy,  setGroupBy]  = useState<GroupKey>('none')
  
  const [showAdd,  setShowAdd]  = useState(false)
  const [newNote,  setNewNote]  = useState({ title: '', body: '', day_number: 1 })
  const [editingId,  setEditingId]  = useState<string | null>(null)
  const [editData,   setEditData]   = useState({ title: '', body: '', day_number: 1 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadTrips() {
      try {
        const data = await apiClient('/trips')
        setTrips(data || [])
        if (data && data.length > 0) {
          setTripId(data[0].id)
        }
      } catch (err) {
        console.error('Failed to load trips:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadTrips()
  }, [])

  useEffect(() => {
    if (!tripId) return
    async function loadNotes() {
      try {
        const data = await apiClient(`/notes/${tripId}`)
        setNotes((data || []).map((n: any) => ({
          id: n.id,
          title: n.title,
          body: n.content,
          date: n.note_date ? n.note_date.slice(0, 10) : new Date(n.created_at).toISOString().slice(0, 10),
          day: n.day_number ? `Day ${n.day_number}` : 'General',
          day_number: n.day_number || 1
        })))
      } catch (err) {
        console.error('Failed to load notes:', err)
      }
    }
    loadNotes()
  }, [tripId])

  const currentTrip = trips.find(t => t.id === tripId)

  async function deleteNote(id: string) {
    try {
      await apiClient(`/notes/${id}`, { method: 'DELETE' })
      setNotes(prev => prev.filter(n => n.id !== id))
    } catch (err) {
      console.error('Failed to delete note', err)
    }
  }

  async function addNote() {
    if (!newNote.title.trim()) return
    try {
      const added = await apiClient('/notes', {
        method: 'POST',
        body: JSON.stringify({
          trip_id: tripId,
          title: newNote.title,
          content: newNote.body,
          day_number: newNote.day_number,
          note_date: new Date().toISOString()
        })
      })
      setNotes(prev => [{
        id: added.id,
        title: added.title,
        body: added.content,
        date: added.note_date ? added.note_date.slice(0, 10) : new Date(added.created_at).toISOString().slice(0, 10),
        day: added.day_number ? `Day ${added.day_number}` : 'General',
      }, ...prev])
      setNewNote({ title: '', body: '', day_number: 1 })
      setShowAdd(false)
    } catch (err) {
      console.error('Failed to add note', err)
    }
  }

  function startEdit(note: any) {
    setEditingId(note.id)
    setEditData({ title: note.title, body: note.body, day_number: parseInt(note.day.replace('Day ', '')) || 1 })
  }

  async function saveEdit() {
    if (!editingId) return
    try {
      const updated = await apiClient(`/notes/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: editData.title,
          content: editData.body,
          day_number: editData.day_number
        })
      })
      setNotes(prev => prev.map(n => n.id === editingId ? {
        ...n,
        title: updated.title,
        body: updated.content,
        day: updated.day_number ? `Day ${updated.day_number}` : 'General'
      } : n))
      setEditingId(null)
    } catch (err) {
      console.error('Failed to update note', err)
    }
  }

  function cancelEdit() {
    setEditingId(null)
  }

  let filtered = notes.filter(n =>
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
  if (groupBy === 'day') {
    const days = [...new Set(filtered.map(n => n.day))].sort((a, b) => {
      const n1 = parseInt(a.replace('Day ', '')) || 0
      const n2 = parseInt(b.replace('Day ', '')) || 0
      return n1 - n2
    })
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
          <button className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-border text-xs shrink-0 h-10 gap-1 bg-background', isActive && 'border-primary text-primary')}>
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

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading notes...</div>
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto pb-16">
      {/* Controls */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background border-border h-10" />
        </div>
        <ControlBtn value={groupBy} set={setGroupBy} labels={{ none: 'Group by', day: 'By Day' }} />
        <ControlBtn value={sortBy}  set={setSortBy}  labels={{ newest: 'Newest', oldest: 'Oldest', az: 'A–Z' }} />
      </div>

      <h1 className="text-2xl font-bold tracking-tight">Trip Notes</h1>

      {/* Trip selector + Add Note */}
      <div className="flex items-center justify-between gap-3">
        {trips.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <button className="flex items-center gap-2 border border-border rounded-lg px-4 py-2.5 bg-background cursor-pointer hover:bg-muted/30 transition-colors text-sm font-medium">
                Trip: {currentTrip?.title || 'Unknown'}
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            } />
            <DropdownMenuContent align="start" className="w-64 max-h-[300px] overflow-y-auto">
              {trips.map(trip => (
                <DropdownMenuItem key={trip.id} onClick={() => setTripId(trip.id)}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{trip.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{trip.status || 'planning'}</p>
                  </div>
                  {trip.id === tripId && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="text-sm text-muted-foreground border border-border rounded-lg px-4 py-2 bg-muted/20">No trips available</div>
        )}

        <button
          onClick={() => setShowAdd(!showAdd)}
          disabled={!tripId}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-border text-sm gap-1.5 h-10 bg-background')}
        >
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </div>

      {/* Add note form */}
      {showAdd && (
        <div className="border border-border rounded-xl p-5 bg-card shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2">
          <h3 className="text-sm font-semibold">New Note</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Note title..."
              value={newNote.title}
              onChange={e => setNewNote(prev => ({ ...prev, title: e.target.value }))}
              className="bg-background border-border flex-1"
            />
            <Input
              type="number"
              min="1"
              placeholder="Day"
              value={newNote.day_number}
              onChange={e => setNewNote(prev => ({ ...prev, day_number: parseInt(e.target.value) || 1 }))}
              className="bg-background border-border w-20"
              title="Day Number"
            />
          </div>
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
                      <div className="flex gap-2">
                        <Input
                          value={editData.title}
                          onChange={e => setEditData(prev => ({ ...prev, title: e.target.value }))}
                          className="bg-background border-border text-sm font-semibold flex-1"
                          autoFocus
                        />
                        <Input
                          type="number"
                          min="1"
                          value={editData.day_number}
                          onChange={e => setEditData(prev => ({ ...prev, day_number: parseInt(e.target.value) || 1 }))}
                          className="bg-background border-border text-sm w-20"
                        />
                      </div>
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
                        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed whitespace-pre-wrap">{note.body}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-muted-foreground font-medium">{note.day}</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">{note.date}</span>
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

        {filtered.length === 0 && tripId && (
          <p className="text-center text-muted-foreground py-12 text-sm">No notes found for this trip. Click "Add Note" to create one.</p>
        )}
      </div>
    </div>
  )
}
