'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import StandardHeader from '@/components/layout/StandardHeader'
import type { City, Trip } from '@/types'

export default function DashboardPage() {
  const [cities, setCities] = useState<City[]>([])
  const [trips, setTrips] = useState<Trip[]>([])

  useEffect(() => {
    api.get('/cities?limit=5').then(r => setCities(r.data.cities)).catch(() => {})
    api.get('/trips?status=completed&limit=3').then(r => setTrips(r.data.trips)).catch(() => {})
  }, [])

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Banner */}
      <div style={{ position: 'relative', height: 280, overflow: 'hidden', background: 'linear-gradient(135deg, #2D6A4F 0%, #1E1E1E 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, padding: '48px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#fff' }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>Spring 2026 · Featured</span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 48, fontWeight: 600, lineHeight: 1.05, marginTop: 8, maxWidth: 780 }}>
            Where do you want to <em style={{ color: '#F5A623', fontStyle: 'italic' }}>wander</em> next?
          </h1>
          <p style={{ fontSize: 15, opacity: 0.85, marginTop: 10, maxWidth: 540 }}>
            Plan multi-city trips, share itineraries, and keep notes that stay with you on the road.
          </p>
        </div>
      </div>

      <StandardHeader />

      <div style={{ padding: '20px 48px 0' }}>
        <Link href="/trips/new">
          <button style={{ background: '#F5A623', color: '#1E1E1E', border: 0, borderRadius: 8, height: 52, padding: '0 28px', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            + Plan a trip
          </button>
        </Link>
      </div>

      <div style={{ padding: '32px 48px 56px', display: 'flex', flexDirection: 'column', gap: 40 }}>
        {/* Top Regional Selections */}
        <section>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>Top Regional Selections</h2>
              <div style={{ color: '#6B7280', fontSize: 13.5, marginTop: 4 }}>Curated by editors this week</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18 }}>
            {(cities.length > 0 ? cities : [
              { id: '1', name: 'Paris', country: 'France' },
              { id: '2', name: 'Tokyo', country: 'Japan' },
              { id: '3', name: 'Bali', country: 'Indonesia' },
              { id: '4', name: 'Rome', country: 'Italy' },
              { id: '5', name: 'Barcelona', country: 'Spain' },
            ]).slice(0, 5).map(city => (
              <div key={city.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ height: 170, background: 'linear-gradient(135deg,#F4D9A4,#E0AC58)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0,0,0,0.45)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.04em' }}>
                  {city.imageUrl ? <img src={city.imageUrl} alt={city.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : city.name.toUpperCase()}
                </div>
                <div style={{ padding: '14px 16px 16px' }}>
                  <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'Playfair Display, serif' }}>{city.name}</div>
                  <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 2 }}>{city.country}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Previous Trips */}
        <section>
          <div style={{ marginBottom: 18 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>Previous Trips</h2>
            <div style={{ color: '#6B7280', fontSize: 13.5, marginTop: 4 }}>Pick up where you left off</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {(trips.length > 0 ? trips : [
              { id: 'p1', name: 'Andalusian Loop', startDate: '2025-03-02', endDate: '2025-03-14', stops: [{}, {}, {}, {}] },
              { id: 'p2', name: 'Northern Lights Run', startDate: '2025-01-08', endDate: '2025-01-18', stops: [{}, {}, {}] },
              { id: 'p3', name: 'Coast of Vietnam', startDate: '2024-11-12', endDate: '2024-11-26', stops: [{}, {}, {}, {}, {}] },
            ] as Trip[]).slice(0, 3).map(trip => (
              <Link href={`/trips/${trip.id}/view`} key={trip.id} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ height: 200, background: 'linear-gradient(135deg,#C7DCC8,#8FB69A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0,0,0,0.45)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.04em' }}>
                    {trip.name.toUpperCase()}
                  </div>
                  <div style={{ padding: '18px 20px' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 6px' }}>{trip.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: '#6B7280' }}>{new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span style={{ background: 'rgba(30,30,30,0.08)', color: '#1E1E1E', padding: '4px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600 }}>{trip.stops?.length || 0} stops</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
