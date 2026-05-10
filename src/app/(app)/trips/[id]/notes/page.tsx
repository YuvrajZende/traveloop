'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import StandardHeader from '@/components/layout/StandardHeader'
import NoteCard from '@/components/notes/NoteCard'
import type { Note, Trip } from '@/types'

export default function NotesPage() {
  const { id } = useParams<{ id: string }>()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [tab, setTab] = useState('All')
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get(`/trips/${id}`),
      api.get(`/trips/${id}/notes`),
    ]).then(([tripRes, notesRes]) => {
      setTrip(tripRes.data.trip)
      setNotes(notesRes.data.notes)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  const addNote = async () => {
    if (!newTitle.trim() || !newContent.trim()) return
    setSaving(true)
    try {
      const res = await api.post(`/trips/${id}/notes`, { title: newTitle, content: newContent })
      setNotes(prev => [res.data.note, ...prev])
      setNewTitle('')
      setNewContent('')
      setShowAdd(false)
    } catch {} finally {
      setSaving(false)
    }
  }

  const filteredNotes = notes.filter(n => {
    if (tab === 'by Day') return !!n.dayRef
    if (tab === 'by stop') return !!n.stopRef
    return true
  })

  if (loading) return <div style={{ padding: 48, fontFamily: 'DM Sans, sans-serif', color: '#6B7280' }}>Loading...</div>

  const inputStyle = { background: '#F3F4F6', border: '2px solid transparent', borderRadius: 8, padding: '0 16px', fontFamily: 'inherit', fontSize: 14, outline: 'none', width: '100%' }

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <StandardHeader />
      <div style={{ padding: '8px 48px 56px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B7280' }}>Trip journal</span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 600, marginTop: 4, margin: '4px 0 0' }}>Trip notes</h1>
          <p style={{ color: '#6B7280', fontSize: 13.5, marginTop: 6 }}>Trip: {trip?.name} · {notes.length} notes</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'inline-flex', gap: 4, padding: 4, background: '#F3F4F6', borderRadius: 999 }}>
            {['All', 'by Day', 'by stop'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 18px', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer', color: tab === t ? '#1E1E1E' : '#6B7280', border: 0, background: tab === t ? '#fff' : 'transparent', fontFamily: 'inherit', boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.06)' : 'none' }}>{t}</button>
            ))}
          </div>
          <button onClick={() => setShowAdd(true)} style={{ background: '#F5A623', color: '#1E1E1E', border: 0, borderRadius: 8, height: 44, padding: '0 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Add Note</button>
        </div>

        {/* Add note form */}
        {showAdd && (
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, margin: 0 }}>New Note</h3>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Note title..." style={{ ...inputStyle, height: 46 }} />
            <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Note content..." style={{ ...inputStyle, height: 'auto', minHeight: 120, padding: '14px 16px', resize: 'vertical' }} />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAdd(false)} style={{ background: 'transparent', color: '#1E1E1E', border: '1.5px solid #1E1E1E', borderRadius: 8, height: 44, padding: '0 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={addNote} disabled={saving} style={{ background: '#F5A623', color: '#1E1E1E', border: 0, borderRadius: 8, height: 44, padding: '0 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredNotes.map(note => <NoteCard key={note.id} note={note} />)}
          {filteredNotes.length === 0 && <p style={{ color: '#6B7280', fontSize: 14 }}>No notes yet. Add your first note!</p>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowAdd(true)} style={{ background: 'transparent', color: '#1E1E1E', border: '1.5px solid #1E1E1E', borderRadius: 8, height: 44, padding: '0 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Add Note</button>
        </div>
      </div>
    </div>
  )
}
