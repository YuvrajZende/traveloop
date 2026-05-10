'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import type { ActivityTemplate } from '@/types'

export default function NewTripPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', place: '', startDate: '', endDate: '', firstStopDate: '', travelers: '1 adult' })
  const [suggestions, setSuggestions] = useState<ActivityTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/activities?limit=6').then(r => setSuggestions(r.data.activities.slice(0, 6))).catch(() => {})
  }, [])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/trips', {
        name: form.name || `Trip to ${form.place}`,
        description: `A trip to ${form.place}`,
        startDate: form.startDate,
        endDate: form.endDate,
        status: 'upcoming',
      })
      router.push(`/trips/${res.data.trip.id}/build`)
    } catch {
      setError('Failed to create trip. Please check the dates.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { background: '#F3F4F6', border: '2px solid transparent', borderRadius: 8, height: 46, padding: '0 16px', fontFamily: 'inherit', fontSize: 14, outline: 'none', width: '100%' }
  const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6 }
  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 500 }

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', padding: '36px 48px 56px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 32 }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B7280' }}>New trip · step 1 of 3</span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 44, fontWeight: 600, marginTop: 6, lineHeight: 1.05, margin: '6px 0 0' }}>Plan a new trip</h1>
          <p style={{ color: '#6B7280', fontSize: 14, marginTop: 8, maxWidth: 560 }}>Start with a destination and dates. We&apos;ll help you fill in stops, activities, and budget on the next steps.</p>
        </div>
        <button style={{ background: 'transparent', color: '#1E1E1E', border: '1.5px solid #1E1E1E', borderRadius: 8, height: 44, padding: '0 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Save draft</button>
      </div>

      {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 32 }}>
          <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Trip Name:</label>
            <input style={inputStyle} placeholder="e.g. Paris & Rome Adventure" value={form.name} onChange={set('name')} />
          </div>
          <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Select a Place:</label>
            <input style={inputStyle} placeholder="e.g. Paris, Rome, Barcelona..." value={form.place} onChange={set('place')} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Start Date:</label>
            <input type="date" style={inputStyle} value={form.startDate} onChange={set('startDate')} required />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>End Date:</label>
            <input type="date" style={inputStyle} value={form.endDate} onChange={set('endDate')} required />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>First stop start date:</label>
            <input type="date" style={inputStyle} value={form.firstStopDate} onChange={set('firstStopDate')} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Travelers</label>
            <input style={inputStyle} value={form.travelers} onChange={set('travelers')} placeholder="1 adult" />
          </div>
        </div>

        {/* Suggestions */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 600, margin: '0 0 6px' }}>Suggestions for places to visit / activities to perform</h2>
          <div style={{ color: '#6B7280', fontSize: 13.5, marginBottom: 18 }}>Based on your destination and travel window</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {(suggestions.length > 0 ? suggestions : [
              { id: '1', name: 'Eiffel Tower Visit', type: 'sightseeing', cost: 25, duration: '3 hrs', description: 'Visit the iconic iron tower and enjoy the view.' },
              { id: '2', name: 'Colosseum Tour', type: 'sightseeing', cost: 16, duration: '3 hrs', description: 'Ancient Roman amphitheater, guided tour.' },
              { id: '3', name: 'Seine River Cruise', type: 'scenic', cost: 15, duration: '1.5 hrs', description: 'Scenic boat tour along the Seine at golden hour.' },
              { id: '4', name: 'Vatican Museums', type: 'culture', cost: 20, duration: '4 hrs', description: 'Sistine Chapel and world-class art collections.' },
              { id: '5', name: 'Louvre Museum', type: 'culture', cost: 17, duration: '4 hrs', description: "World's largest art museum." },
              { id: '6', name: 'Pasta Making Class', type: 'food', cost: 65, duration: '3 hrs', description: 'Learn to make authentic Italian pasta from scratch.' },
            ] as ActivityTemplate[]).map(s => (
              <div key={s.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 170, background: 'linear-gradient(135deg,#F4D9A4,#E0AC58)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0,0,0,0.45)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.04em' }}>
                  {s.type?.toUpperCase()}
                </div>
                <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>{s.name}</h3>
                  </div>
                  <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.55, margin: 0 }}>{s.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                    <span style={{ fontSize: 12.5, color: '#6B7280' }}>{s.duration} · ${s.cost}</span>
                    <button type="button" style={{ background: 'transparent', color: '#1E1E1E', border: '1.5px solid #1E1E1E', borderRadius: 8, height: 34, padding: '0 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E5E7EB', paddingTop: 24 }}>
          <button type="button" onClick={() => router.back()} style={{ background: 'transparent', color: '#1E1E1E', border: 0, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>← Back</button>
          <button type="submit" disabled={loading} style={{ background: '#F5A623', color: '#1E1E1E', border: 0, borderRadius: 8, height: 52, padding: '0 28px', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating...' : 'Continue to itinerary →'}
          </button>
        </div>
      </form>
    </div>
  )
}
