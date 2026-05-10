'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import StandardHeader from '@/components/layout/StandardHeader'
import type { ChecklistItem, Trip } from '@/types'

export default function ChecklistPage() {
  const { id } = useParams<{ id: string }>()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [newLabel, setNewLabel] = useState('')
  const [newCategory, setNewCategory] = useState('Documents')

  useEffect(() => {
    Promise.all([
      api.get(`/trips/${id}`),
      api.get(`/trips/${id}/checklist`),
    ]).then(([tripRes, checkRes]) => {
      setTrip(tripRes.data.trip)
      setItems(checkRes.data.items)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  const toggleItem = async (itemId: string, packed: boolean) => {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, packed } : i))
    try {
      await api.patch(`/trips/${id}/checklist/${itemId}`, { packed })
    } catch {
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, packed: !packed } : i))
    }
  }

  const addItem = async () => {
    if (!newLabel.trim()) return
    try {
      const res = await api.post(`/trips/${id}/checklist`, { label: newLabel, category: newCategory })
      setItems(prev => [...prev, res.data.item])
      setNewLabel('')
    } catch {}
  }

  const categories = [...new Set(items.map(i => i.category))]
  const packedCount = items.filter(i => i.packed).length
  const progress = items.length ? Math.round((packedCount / items.length) * 100) : 0

  if (loading) return <div style={{ padding: 48, fontFamily: 'DM Sans, sans-serif', color: '#6B7280' }}>Loading...</div>

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <StandardHeader />
      <div style={{ padding: '8px 48px 56px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B7280' }}>Packing checklist</span>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 600, marginTop: 4, margin: '4px 0 0' }}>Trip: {trip?.name}</h1>
            <p style={{ color: '#6B7280', fontSize: 13.5, marginTop: 6 }}>
              {trip && `${new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
            </p>
          </div>
          <span style={{ background: 'rgba(45,106,79,0.12)', color: '#2D6A4F', padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>{packedCount} / {items.length} packed</span>
        </div>

        {/* Progress */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
            <span style={{ fontWeight: 600 }}>Progress: {packedCount}/{items.length} items packed</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#6B7280' }}>{progress}%</span>
          </div>
          <div style={{ background: '#E5E7EB', borderRadius: 999, height: 10, overflow: 'hidden' }}>
            <div style={{ background: '#1E1E1E', height: '100%', borderRadius: 999, width: `${progress}%`, transition: 'width 0.25s' }} />
          </div>
        </div>

        {/* Category groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {categories.map(cat => {
            const catItems = items.filter(i => i.category === cat)
            const catPacked = catItems.filter(i => i.packed).length
            return (
              <div key={cat} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ color: '#6B7280', fontSize: 14 }}>›</span>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 19, fontWeight: 600, margin: 0 }}>{cat}</h3>
                    <span style={{ background: 'rgba(45,106,79,0.12)', color: '#2D6A4F', padding: '4px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600 }}>{catPacked}/{catItems.length}</span>
                  </div>
                  <button style={{ background: 'transparent', color: '#1E1E1E', border: 0, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>+ Add</button>
                </div>
                <ul style={{ listStyle: 'none', padding: '8px 22px 12px', margin: 0 }}>
                  {catItems.map(item => (
                    <li key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
                      <button
                        onClick={() => toggleItem(item.id, !item.packed)}
                        style={{
                          width: 20, height: 20, borderRadius: 5, border: item.packed ? 'none' : '1.5px solid #E5E7EB',
                          background: item.packed ? '#1E1E1E' : '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', flexShrink: 0, color: '#fff'
                        }}
                      >
                        {item.packed && <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </button>
                      <span style={{ fontSize: 14, color: item.packed ? '#6B7280' : '#1E1E1E', textDecoration: item.packed ? 'line-through' : 'none' }}>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Add item */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 20, display: 'flex', gap: 10 }}>
          <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="New item label..." style={{ background: '#F3F4F6', border: '2px solid transparent', borderRadius: 8, height: 44, padding: '0 16px', fontFamily: 'inherit', fontSize: 14, outline: 'none', flex: 1 }} />
          <select value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ background: '#F3F4F6', border: '2px solid transparent', borderRadius: 8, height: 44, padding: '0 12px', fontFamily: 'inherit', fontSize: 14, outline: 'none' }}>
            <option>Documents</option><option>Clothing</option><option>Electronics</option><option>Other</option>
          </select>
          <button onClick={addItem} style={{ background: '#F5A623', color: '#1E1E1E', border: 0, borderRadius: 8, height: 44, padding: '0 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Add</button>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button style={{ background: 'transparent', border: '1.5px dashed #C9CBD0', color: '#6B7280', borderRadius: 8, height: 44, flex: 1, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Add item to checklist</button>
          <button onClick={() => setItems(prev => prev.map(i => ({ ...i, packed: false })))} style={{ background: 'transparent', color: '#1E1E1E', border: '1.5px solid #1E1E1E', borderRadius: 8, height: 44, padding: '0 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Reset all</button>
          <button style={{ background: 'transparent', color: '#1E1E1E', border: '1.5px solid #1E1E1E', borderRadius: 8, height: 44, padding: '0 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>↗ Share Checklist</button>
        </div>
      </div>
    </div>
  )
}
