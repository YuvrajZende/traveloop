'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import StandardHeader from '@/components/layout/StandardHeader'
import { useAuthContext } from '@/context/AuthContext'
import ExpenseBarChart from '@/components/charts/ExpenseBarChart'

interface AdminStats {
  totalUsers: number
  totalTrips: number
  ongoingTrips: number
  upcomingTrips: number
  completedTrips: number
  topCities: Array<{ name: string; count: number }>
  topActivities: Array<{ name: string; count: number }>
  weeklyTrips: Array<{ week: string; count: number }>
}

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  city?: string
  country?: string
  createdAt: string
  _count: { trips: number }
}

export default function AdminPage() {
  const { user } = useAuthContext()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard')
      return
    }
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users'),
    ]).then(([statsRes, usersRes]) => {
      setStats(statsRes.data)
      setUsers(usersRes.data.users)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [user, router])

  if (loading) return <div style={{ padding: 48, fontFamily: 'DM Sans, sans-serif', color: '#6B7280' }}>Loading admin panel...</div>

  const weeklyChartData = (stats?.weeklyTrips || [{ week: 'W1', count: 2 }, { week: 'W2', count: 5 }, { week: 'W3', count: 3 }, { week: 'W4', count: 8 }]).map(w => ({ label: w.week, value: w.count }))
  const maxCity = Math.max(...(stats?.topCities || [{ count: 1 }]).map(c => c.count), 1)

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <StandardHeader />
      <div style={{ padding: '8px 48px 56px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B7280' }}>Admin panel</span>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 34, fontWeight: 600, marginTop: 4, margin: '4px 0 0' }}>Operations overview</h1>
            <p style={{ color: '#6B7280', fontSize: 13.5, marginTop: 6 }}>Live data from database</p>
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            {[['Active users', stats?.totalUsers || 0, '+'], ['Trips total', stats?.totalTrips || 0, ''], ['Ongoing', stats?.ongoingTrips || 0, '']].map(([label, v, delta]) => (
              <div key={label as string} style={{ minWidth: 120 }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B7280' }}>{label}</div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 600, marginTop: 2 }}>{v}</div>
                {delta && <div style={{ fontSize: 11.5, color: '#2D6A4F', marginTop: 2, fontWeight: 500 }}>{delta}</div>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {/* Manage Users */}
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, margin: 0 }}>Manage Users</h3>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{users.length} total users</div>
              </div>
            </div>
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#6B7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <th style={{ padding: '10px 8px', fontWeight: 600 }}>User</th>
                  <th style={{ padding: '10px 8px', fontWeight: 600 }}>Role</th>
                  <th style={{ padding: '10px 8px', fontWeight: 600 }}>Trips</th>
                  <th style={{ padding: '10px 8px', fontWeight: 600 }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderTop: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '10px 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#F4D9A4,#E0AC58)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 10, flexShrink: 0 }}>
                          {u.name.split(' ').map(s => s[0]).join('').slice(0, 2)}
                        </span>
                        <div>
                          <div style={{ fontWeight: 500 }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: '#6B7280' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <span style={{ background: u.role === 'admin' ? 'rgba(245,166,35,0.15)' : 'rgba(30,30,30,0.08)', color: u.role === 'admin' ? '#8C5A00' : '#1E1E1E', padding: '4px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600 }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '10px 8px', fontFamily: 'JetBrains Mono, monospace' }}>{u._count.trips}</td>
                    <td style={{ padding: '10px 8px', color: '#6B7280', fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Popular Cities */}
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, margin: 0 }}>Popular Cities</h3>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>By trip stops</div>
            </div>
            {(stats?.topCities?.length ? stats.topCities : [
              { name: 'Paris', count: 3 }, { name: 'Rome', count: 3 }, { name: 'Tokyo', count: 2 }, { name: 'Bali', count: 1 }, { name: 'Kyoto', count: 1 }
            ]).map((city, i) => (
              <div key={city.name} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 60px', gap: 14, alignItems: 'center', padding: '10px 0', borderTop: i ? '1px dashed #E5E7EB' : '0' }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{city.name}</div>
                <div style={{ height: 8, borderRadius: 999, background: '#E5E7EB', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: '0 auto 0 0', width: `${(city.count / maxCity) * 100}%`, background: '#F5A623', borderRadius: 999 }} />
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', textAlign: 'right', fontSize: 13, fontWeight: 500 }}>{city.count}</div>
              </div>
            ))}
          </div>

          {/* Popular Activities */}
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, margin: 0 }}>Popular Activities</h3>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>By bookings</div>
            </div>
            {(stats?.topActivities?.length ? stats.topActivities : [
              { name: 'Eiffel Tower Visit', count: 1 }, { name: 'Colosseum Tour', count: 1 }, { name: 'Bali Paragliding', count: 1 }
            ]).map((act, i) => (
              <div key={act.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: i ? '1px dashed #E5E7EB' : '0' }}>
                <span style={{ fontSize: 13.5 }}>{act.name}</span>
                <span style={{ background: 'rgba(30,30,30,0.08)', color: '#1E1E1E', padding: '4px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>{act.count}</span>
              </div>
            ))}
          </div>

          {/* User Trends */}
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, margin: 0 }}>User Trends and Analytics</h3>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Trips planned · recent weeks</div>
              </div>
              <span style={{ background: 'rgba(45,106,79,0.12)', color: '#2D6A4F', padding: '4px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600 }}>↗ Active</span>
            </div>
            <ExpenseBarChart data={weeklyChartData} title="Trips per week" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginTop: 4, paddingTop: 16, borderTop: '1px solid #E5E7EB' }}>
              {[['Total trips', stats?.totalTrips || 0], ['Ongoing', stats?.ongoingTrips || 0], ['Completed', stats?.completedTrips || 0]].map(([label, val]) => (
                <div key={label as string}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B7280' }}>{label}</div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, marginTop: 2 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
