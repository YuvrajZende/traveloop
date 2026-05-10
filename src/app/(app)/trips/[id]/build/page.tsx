'use client'

import { useReducer, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/api'

interface Section {
  id: string
  description: string
  startDate: string
  endDate: string
  budget: string
}

type Action =
  | { type: 'ADD' }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE'; id: string; field: keyof Section; value: string }

function reducer(state: Section[], action: Action): Section[] {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: Date.now().toString(), description: '', startDate: '', endDate: '', budget: '' }]
    case 'REMOVE':
      return state.filter(s => s.id !== action.id)
    case 'UPDATE':
      return state.map(s => s.id === action.id ? { ...s, [action.field]: action.value } : s)
    default:
      return state
  }
}

export default function ItineraryBuilderPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [tripName, setTripName] = useState('Loading...')
  const [tripDates, setTripDates] = useState('')
  const [sections, dispatch] = useReducer(reducer, [
    { id: '1', description: '', startDate: '', endDate: '', budget: '' }
  ])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get(`/trips/${id}`).then(r => {
      const t = r.data.trip
      setTripName(t.name)
      const s = new Date(t.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const e = new Date(t.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      setTripDates(`${s} – ${e}`)
      if (t.stops?.length > 0) {
        dispatch({ type: 'REMOVE', id: '1' })
        t.stops.forEach((stop: { id: string; description?: string; startDate: string; endDate: string; budget?: number }) => {
          // Populate from existing stops - handled by resetting
        })
      }
    }).catch(() => {})
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      for (let i = 0; i < sections.length; i++) {
        const s = sections[i]
        if (s.startDate && s.endDate) {
          await api.post(`/trips/${id}/stops`, {
            city: `Section ${i + 1}`,
            startDate: s.startDate,
            endDate: s.endDate,
            budget: s.budget ? parseFloat(s.budget) : undefined,
            description: s.description,
            order: i,
          })
        }
      }
      router.push(`/trips/${id}/view`)
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = { background: '#F3F4F6', border: '2px solid transparent', borderRadius: 8, height: 46, padding: '0 16px', fontFamily: 'inherit', fontSize: 14, outline: 'none', width: '100%' }

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', padding: '32px 48px 56px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B7280' }}>Itinerary builder · step 2 of 3</span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 600, marginTop: 6, margin: '6px 0 0' }}>{tripName}</h1>
          <p style={{ color: '#6B7280', fontSize: 13.5, marginTop: 6 }}>{tripDates}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => router.push(`/trips/${id}/view`)} style={{ background: 'transparent', color: '#1E1E1E', border: '1.5px solid #1E1E1E', borderRadius: 8, height: 44, padding: '0 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Preview</button>
          <button onClick={handleSave} disabled={saving} style={{ background: '#F5A623', color: '#1E1E1E', border: 0, borderRadius: 8, height: 44, padding: '0 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving...' : 'Save itinerary'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {sections.map((s, i) => (
          <div key={s.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 13, fontWeight: 700, background: '#1E1E1E', color: '#fff', padding: '4px 10px', borderRadius: 6, letterSpacing: '0.04em' }}>SECTION {i + 1}</span>
              </div>
              {sections.length > 1 && (
                <button onClick={() => dispatch({ type: 'REMOVE', id: s.id })} style={{ background: 'transparent', color: '#EF4444', border: 0, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Remove</button>
              )}
            </div>
            <textarea
              value={s.description}
              onChange={e => dispatch({ type: 'UPDATE', id: s.id, field: 'description', value: e.target.value })}
              placeholder="Describe this part of the trip — cities, activities, notes..."
              style={{ background: '#F3F4F6', border: '2px solid transparent', borderRadius: 8, padding: '14px 16px', fontFamily: 'inherit', fontSize: 14, outline: 'none', resize: 'vertical', minHeight: 96, width: '100%' }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500 }}>Date Range:</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="date" value={s.startDate} onChange={e => dispatch({ type: 'UPDATE', id: s.id, field: 'startDate', value: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                  <span style={{ color: '#6B7280' }}>to</span>
                  <input type="date" value={s.endDate} onChange={e => dispatch({ type: 'UPDATE', id: s.id, field: 'endDate', value: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500 }}>Budget of this section</label>
                <div style={{ display: 'flex', alignItems: 'center', background: '#F3F4F6', borderRadius: 8, height: 46, padding: '0 16px', gap: 4 }}>
                  <span style={{ color: '#6B7280', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>$</span>
                  <input type="number" value={s.budget} onChange={e => dispatch({ type: 'UPDATE', id: s.id, field: 'budget', value: e.target.value })} placeholder="0" style={{ border: 0, background: 'transparent', outline: 'none', flex: 1, fontFamily: 'JetBrains Mono, monospace', fontSize: 14, textAlign: 'right' }} />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => dispatch({ type: 'ADD' })}
          style={{ background: 'transparent', border: '1.5px dashed #C9CBD0', color: '#6B7280', borderRadius: 8, height: 64, width: '100%', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          + Add another Section
        </button>
      </div>
    </div>
  )
}
