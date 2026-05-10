'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import StandardHeader from '@/components/layout/StandardHeader'
import type { Trip, Activity } from '@/types'

export default function ItineraryViewPage() {
  const { id } = useParams<{ id: string }>()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/trips/${id}`).then(r => setTrip(r.data.trip)).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ padding: 48, fontFamily: 'DM Sans, sans-serif', color: '#6B7280' }}>Loading...</div>
  if (!trip) return <div style={{ padding: 48, fontFamily: 'DM Sans, sans-serif', color: '#EF4444' }}>Trip not found.</div>

  // Flatten all activities for expense panel
  const allActivities = trip.stops?.flatMap(s => s.activities || []) || []
  const totalExpense = allActivities.reduce((sum, a) => sum + (a.cost || 0), 0)

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <StandardHeader />
      <div style={{ padding: '10px 48px 56px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B7280' }}>Itinerary view</span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 600, marginTop: 6, margin: '6px 0 0' }}>Itinerary for a selected place</h1>
          <p style={{ color: '#6B7280', fontSize: 13.5, marginTop: 6 }}>
            {trip.stops?.[0]?.city || 'Destination'} · {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Day Blocks */}
        {trip.stops?.map((stop, stopIdx) => {
          const activities = stop.activities || []
          return (
            <section key={stop.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 14 }}>
                <div style={{ background: '#1E1E1E', color: '#fff', padding: '14px 20px', borderRadius: 12, display: 'flex', flexDirection: 'column', minWidth: 140 }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, opacity: 0.7, letterSpacing: 0.1 }}>STOP</span>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 38, fontWeight: 600, lineHeight: 1 }}>0{stopIdx + 1}</span>
                  <span style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{stop.city}</span>
                </div>
                <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
                <span style={{ background: 'rgba(30,30,30,0.08)', color: '#1E1E1E', padding: '4px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600 }}>{activities.length} activities</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {activities.map((a: Activity) => (
                  <div key={a.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 20, padding: 18, alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <div style={{ fontSize: 15.5, fontWeight: 600 }}>{a.name}</div>
                        <span style={{ background: 'rgba(45,106,79,0.12)', color: '#2D6A4F', padding: '2px 8px', borderRadius: 999, fontSize: 10.5, fontWeight: 600 }}>{a.type}</span>
                      </div>
                      {a.duration && <div style={{ fontSize: 12.5, color: '#6B7280' }}>{a.duration}</div>}
                    </div>
                    {a.cost !== undefined && <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, fontSize: 15 }}>${a.cost}</span>}
                    <button style={{ background: 'transparent', color: '#1E1E1E', border: 0, cursor: 'pointer' }}>✎</button>
                  </div>
                ))}
                {activities.length === 0 && <p style={{ color: '#6B7280', fontSize: 14 }}>No activities for this stop.</p>}
              </div>
            </section>
          )
        })}

        {/* Bottom panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 24 }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 600, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              ⛰ Physical Activity
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {allActivities.slice(0, 4).map((a: Activity, i: number) => (
                <li key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 3 ? '1px dashed #E5E7EB' : '0' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13.5 }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{a.duration || 'Duration TBD'}</div>
                  </div>
                  <span style={{ background: 'rgba(45,106,79,0.12)', color: '#2D6A4F', padding: '4px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600 }}>Light</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 600, margin: 0 }}>$ Expense</h3>
              <span style={{ background: 'rgba(30,30,30,0.08)', color: '#1E1E1E', padding: '4px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>USD</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {allActivities.map((a: Activity, i: number) => (
                <li key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < allActivities.length - 1 ? '1px dashed #E5E7EB' : '0' }}>
                  <span style={{ fontSize: 13.5 }}>{a.name}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>${a.cost || 0}</span>
                </li>
              ))}
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0 0', borderTop: '2px solid #1E1E1E', marginTop: 6 }}>
                <span style={{ fontWeight: 600 }}>Total</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 18 }}>${totalExpense}</span>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Link href={`/trips/${id}/checklist`}><button style={{ background: 'transparent', color: '#1E1E1E', border: '1.5px solid #1E1E1E', borderRadius: 8, height: 44, padding: '0 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Checklist</button></Link>
          <Link href={`/trips/${id}/notes`}><button style={{ background: 'transparent', color: '#1E1E1E', border: '1.5px solid #1E1E1E', borderRadius: 8, height: 44, padding: '0 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Notes</button></Link>
          <Link href={`/trips/${id}/invoice`}><button style={{ background: '#F5A623', color: '#1E1E1E', border: 0, borderRadius: 8, height: 44, padding: '0 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Invoice</button></Link>
        </div>
      </div>
    </div>
  )
}
