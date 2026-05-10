'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import TripCardPortrait from '@/components/trips/TripCardPortrait'
import { useAuthContext } from '@/context/AuthContext'
import type { Trip } from '@/types'

export default function ProfilePage() {
  const { user } = useAuthContext()
  const [upcoming, setUpcoming] = useState<Trip[]>([])
  const [completed, setCompleted] = useState<Trip[]>([])

  useEffect(() => {
    api.get('/trips?status=upcoming&limit=3').then(r => setUpcoming(r.data.trips)).catch(() => {})
    api.get('/trips?status=completed&limit=3').then(r => setCompleted(r.data.trips)).catch(() => {})
  }, [])

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'JD'

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', padding: '32px 48px 56px' }}>
      {/* Profile Card */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 28, display: 'grid', gridTemplateColumns: '180px 1fr auto', gap: 28, alignItems: 'center', marginBottom: 40 }}>
        <div style={{ width: 160, height: 160, borderRadius: 16, background: 'linear-gradient(135deg,#F4D9A4,#E0AC58)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, fontWeight: 700, color: '#1E1E1E' }}>
          {initials}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B7280' }}>Profile</span>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 34, fontWeight: 600, marginTop: 2, margin: '2px 0 0' }}>{user?.name || 'James Doe'}</h1>
            <p style={{ color: '#6B7280', fontSize: 13.5, margin: '4px 0 0' }}>Member · {[...(upcoming || []), ...(completed || [])].length} trips</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginTop: 6 }}>
            {[['Email', user?.email || '—'], ['Phone', user?.phone || '—'], ['City', user?.city || '—'], ['Country', user?.country || '—']].map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B7280' }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button style={{ background: '#F5A623', color: '#1E1E1E', border: 0, borderRadius: 8, height: 44, padding: '0 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>✎ Edit profile</button>
          <button style={{ background: 'transparent', color: '#1E1E1E', border: '1.5px solid #1E1E1E', borderRadius: 8, height: 34, padding: '0 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Settings</button>
        </div>
      </div>

      {/* Preplanned Trips */}
      <section style={{ marginBottom: 40 }}>
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 600, margin: 0 }}>Preplanned Trips</h2>
          <div style={{ color: '#6B7280', fontSize: 13.5, marginTop: 4 }}>Drafts &amp; confirmed itineraries waiting for you</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {upcoming.length > 0 ? upcoming.map(t => <TripCardPortrait key={t.id} trip={t} />) : (
            <p style={{ color: '#6B7280', fontSize: 14 }}>No upcoming trips planned.</p>
          )}
        </div>
      </section>

      {/* Previous Trips */}
      <section>
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 600, margin: 0 }}>Previous Trips</h2>
          <div style={{ color: '#6B7280', fontSize: 13.5, marginTop: 4 }}>The journeys behind you</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {completed.length > 0 ? completed.map(t => <TripCardPortrait key={t.id} trip={t} />) : (
            <p style={{ color: '#6B7280', fontSize: 14 }}>No completed trips yet.</p>
          )}
        </div>
      </section>
    </div>
  )
}
