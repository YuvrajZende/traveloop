'use client'

import { useState } from 'react'
import Link from 'next/link'
import StandardHeader from '@/components/layout/StandardHeader'
import TripCardWide from '@/components/trips/TripCardWide'
import { useTrips } from '@/hooks/useTrips'
import type { Trip } from '@/types'

function SectionGroupHeader({ title, count, color }: { title: string; count: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: color, display: 'inline-block', flexShrink: 0 }} />
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 600, margin: 0 }}>{title}</h2>
      <span style={{ background: 'rgba(30,30,30,0.08)', color: '#1E1E1E', padding: '4px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600 }}>{count}</span>
      <span style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
    </div>
  )
}

export default function TripsPage() {
  const { trips, loading, deleteTrip } = useTrips()

  const ongoing = trips.filter((t: Trip) => t.status === 'ongoing')
  const upcoming = trips.filter((t: Trip) => t.status === 'upcoming')
  const completed = trips.filter((t: Trip) => t.status === 'completed')

  if (loading) return <div style={{ padding: 48, fontFamily: 'DM Sans, sans-serif', color: '#6B7280' }}>Loading trips...</div>

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <StandardHeader />
      <div style={{ padding: '8px 48px 56px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B7280' }}>My Trips</span>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 600, marginTop: 4, margin: '4px 0 0' }}>All your journeys, in one place</h1>
          </div>
          <Link href="/trips/new">
            <button style={{ background: '#F5A623', color: '#1E1E1E', border: 0, borderRadius: 8, height: 44, padding: '0 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              + New Trip
            </button>
          </Link>
        </div>

        <section>
          <SectionGroupHeader title="Ongoing" count={ongoing.length} color="#F5A623" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {ongoing.length === 0 ? <p style={{ color: '#6B7280', fontSize: 14 }}>No ongoing trips.</p> : ongoing.map((t: Trip) => <TripCardWide key={t.id} trip={t} onDelete={deleteTrip} />)}
          </div>
        </section>

        <section>
          <SectionGroupHeader title="Up-coming" count={upcoming.length} color="#2D6A4F" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {upcoming.length === 0 ? <p style={{ color: '#6B7280', fontSize: 14 }}>No upcoming trips.</p> : upcoming.map((t: Trip) => <TripCardWide key={t.id} trip={t} onDelete={deleteTrip} />)}
          </div>
        </section>

        <section>
          <SectionGroupHeader title="Completed" count={completed.length} color="#1E1E1E" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {completed.length === 0 ? <p style={{ color: '#6B7280', fontSize: 14 }}>No completed trips.</p> : completed.map((t: Trip) => <TripCardWide key={t.id} trip={t} onDelete={deleteTrip} />)}
          </div>
        </section>
      </div>
    </div>
  )
}
