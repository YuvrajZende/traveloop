'use client'

import { useState, useEffect, useRef } from 'react'
import { Lock, Eye, EyeOff, Search, Users, MapPin, Activity, TrendingUp, LogOut, ArrowUp, TrendingDown } from 'lucide-react'

/* ─── Mock data ──────────────────────────────────────── */

const MOCK_USERS = [
  { id: '1', name: 'Alex Rivera',    email: 'alex@traveloop.com',    trips: 3, status: 'active',   joined: '2024-01-15', avatar: 'AR' },
  { id: '2', name: 'Sarah Mitchell', email: 'sarah.m@example.com',   trips: 7, status: 'active',   joined: '2024-02-20', avatar: 'SM' },
  { id: '3', name: 'James Kim',      email: 'j.kim@example.com',     trips: 2, status: 'inactive', joined: '2024-03-10', avatar: 'JK' },
  { id: '4', name: 'Priya Raj',      email: 'priya.r@example.com',   trips: 5, status: 'active',   joined: '2024-01-28', avatar: 'PR' },
  { id: '5', name: 'Marco Torelli',  email: 'm.torelli@example.com', trips: 4, status: 'active',   joined: '2024-04-05', avatar: 'MT' },
  { id: '6', name: 'Emma Chen',      email: 'e.chen@example.com',    trips: 9, status: 'active',   joined: '2023-12-01', avatar: 'EC' },
  { id: '7', name: 'David Park',     email: 'd.park@example.com',    trips: 1, status: 'pending',  joined: '2024-05-12', avatar: 'DP' },
  { id: '8', name: 'Amara Diallo',   email: 'a.diallo@example.com',  trips: 6, status: 'active',   joined: '2024-02-14', avatar: 'AD' },
]

const POPULAR_CITIES = [
  { city: 'Tokyo',     country: 'Japan',       trips: 41, trending: true,  image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80' },
  { city: 'Bali',      country: 'Indonesia',   trips: 35, trending: true,  image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
  { city: 'Paris',     country: 'France',      trips: 29, trending: false, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80' },
  { city: 'Bangkok',   country: 'Thailand',    trips: 28, trending: true,  image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&q=80' },
  { city: 'Barcelona', country: 'Spain',       trips: 24, trending: false, image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&q=80' },
  { city: 'Lisbon',    country: 'Portugal',    trips: 18, trending: true,  image: 'https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?w=400&q=80' },
]

const POPULAR_ACTIVITIES = [
  { name: 'Temple & Cultural Tours',  category: 'culture',     count: 156, rating: 4.8, trend: +12 },
  { name: 'Local Food Markets',       category: 'food',        count: 143, rating: 4.9, trend: +8  },
  { name: 'Beach & Surf Activities',  category: 'adventure',   count: 128, rating: 4.7, trend: +21 },
  { name: 'City Walking Tours',       category: 'sightseeing', count: 117, rating: 4.6, trend: -3  },
  { name: 'Museum Visits',            category: 'culture',     count: 98,  rating: 4.5, trend: +5  },
  { name: 'Cooking Classes',          category: 'food',        count: 87,  rating: 4.8, trend: +14 },
  { name: 'Hiking & Trekking',        category: 'adventure',   count: 76,  rating: 4.7, trend: +6  },
  { name: 'Spa & Wellness',           category: 'relaxation',  count: 65,  rating: 4.9, trend: -1  },
]

const LINE_DATA    = [42, 67, 53, 89, 78, 112, 98, 134, 121, 158, 143, 189]
const LINE_LABELS  = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const PIE_DATA = [
  { label: 'Upcoming',  value: 38, color: '#4eac6c' },
  { label: 'Planning',  value: 22, color: '#288dd4' },
  { label: 'Ongoing',   value: 13, color: '#f59e0b' },
  { label: 'Completed', value: 27, color: '#71717a' },
]
const BAR_DATA = [
  { label: 'Tokyo',     value: 41 },
  { label: 'Bali',      value: 35 },
  { label: 'Paris',     value: 29 },
  { label: 'Bangkok',   value: 28 },
  { label: 'Barcelona', value: 24 },
  { label: 'Lisbon',    value: 18 },
]

const CATEGORY_COLORS: Record<string, string> = {
  culture: '#288dd4', food: '#f59e0b', adventure: '#4eac6c',
  sightseeing: '#a855f7', relaxation: '#ec4899',
}

/* ─── SVG Charts ─────────────────────────────────────── */

function DonutChart() {
  const R = 58, SW = 18
  const C = 2 * Math.PI * R
  let acc = 0
  const segments = PIE_DATA.map(d => {
    const dash = (d.value / 100) * C
    const offset = C / 4 - acc
    acc += dash
    return { ...d, dash, offset }
  })
  return (
    <div className="relative w-44 h-44 shrink-0">
      <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
        <circle cx="70" cy="70" r={R} fill="none" stroke="#1e1e22" strokeWidth={SW} />
        {segments.map(s => (
          <circle key={s.label} cx="70" cy="70" r={R} fill="none"
            stroke={s.color} strokeWidth={SW}
            strokeDasharray={`${s.dash} ${C - s.dash}`}
            strokeDashoffset={s.offset}
            strokeLinecap="butt"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold text-white">243</p>
        <p className="text-[10px] text-[#71717a]">Total Trips</p>
      </div>
    </div>
  )
}

function LineChart() {
  const W = 400, H = 150
  const pad = { t: 15, b: 28, l: 32, r: 10 }
  const iW = W - pad.l - pad.r
  const iH = H - pad.t - pad.b
  const minV = 30, maxV = 200
  const pts = LINE_DATA.map((v, i) => ({
    x: pad.l + (i / (LINE_DATA.length - 1)) * iW,
    y: pad.t + (1 - (v - minV) / (maxV - minV)) * iH,
  }))
  const ptsStr = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaPath = `M ${pad.l},${H - pad.b} L ${pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')} L ${pts[pts.length - 1].x.toFixed(1)},${H - pad.b} Z`
  const gridVals = [50, 100, 150]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: '150px' }}>
      <defs>
        <linearGradient id="adminLineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4eac6c" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4eac6c" stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridVals.map(v => {
        const y = pad.t + (1 - (v - minV) / (maxV - minV)) * iH
        return (
          <g key={v}>
            <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="#1e1e22" strokeWidth="1" />
            <text x={pad.l - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#52525b">{v}</text>
          </g>
        )
      })}
      <path d={areaPath} fill="url(#adminLineGrad)" />
      <polyline points={ptsStr} fill="none" stroke="#4eac6c" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#4eac6c" stroke="#111113" strokeWidth="1.5" />
      ))}
      {pts.map((p, i) => (
        i % 2 === 0 && (
          <text key={i} x={p.x} y={H - 6} textAnchor="middle" fontSize="9" fill="#52525b">
            {LINE_LABELS[i]}
          </text>
        )
      ))}
    </svg>
  )
}

function BarChart() {
  const W = 340, H = 160
  const pad = { t: 16, b: 32, l: 10, r: 10 }
  const iW = W - pad.l - pad.r
  const iH = H - pad.t - pad.b
  const maxV = 50
  const barW = 32
  const gap = (iW - BAR_DATA.length * barW) / (BAR_DATA.length + 1)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: '160px' }}>
      {BAR_DATA.map((d, i) => {
        const x = pad.l + gap * (i + 1) + barW * i
        const barH = (d.value / maxV) * iH
        const y = pad.t + iH - barH
        const opacity = 0.45 + (d.value / maxV) * 0.55
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW} height={barH} rx="5" fill="#4eac6c" opacity={opacity} />
            <text x={x + barW / 2} y={H - 10} textAnchor="middle" fontSize="8.5" fill="#52525b">{d.label}</text>
            <text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize="9.5" fill="#f4f4f5" fontWeight="700">{d.value}</text>
          </g>
        )
      })}
    </svg>
  )
}

/* ─── Password Gate ──────────────────────────────────── */

function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [shaking, setShaking] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pw === 'traveloop123') {
      sessionStorage.setItem('traveloop-admin-auth', '1')
      onAuth()
    } else {
      setError('Incorrect password. Please try again.')
      setPw('')
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] p-6">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#4eac6c]/5 blur-3xl" />
      </div>

      <div className={`relative z-10 w-full max-w-sm ${shaking ? 'animate-bounce' : ''}`}>
        <div className="border border-[#1e1e22] rounded-2xl bg-[#111113] p-8 shadow-2xl space-y-6">
          {/* Logo */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#4eac6c]/15 border border-[#4eac6c]/30">
              <Lock className="w-6 h-6 text-[#4eac6c]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#4eac6c] tracking-widest uppercase mb-1">Traveloop</p>
              <h1 className="text-xl font-bold text-[#f4f4f5]">Admin Access</h1>
              <p className="text-sm text-[#71717a] mt-1">Enter your password to continue</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Admin password"
                value={pw}
                onChange={e => { setPw(e.target.value); setError('') }}
                className="w-full h-11 rounded-lg bg-[#18181b] border border-[#2a2a2e] text-[#f4f4f5] placeholder-[#52525b] px-4 pr-11 text-sm focus:outline-none focus:border-[#4eac6c] focus:ring-1 focus:ring-[#4eac6c]/30 transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525b] hover:text-[#f4f4f5] transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400 text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-[#4eac6c] text-[#000f00] text-sm font-bold hover:bg-[#5dc47b] transition-colors"
              style={{ boxShadow: '0 2px 16px rgba(78, 172, 108, 0.35)' }}
            >
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

/* ─── Admin Dashboard ────────────────────────────────── */

type Tab = 'users' | 'cities' | 'activities' | 'analytics'

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('analytics')
  const [search, setSearch] = useState('')

  const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: 'users',      label: 'Manage Users',             icon: Users      },
    { id: 'cities',     label: 'Popular Cities',           icon: MapPin     },
    { id: 'activities', label: 'Popular Activities',       icon: Activity   },
    { id: 'analytics',  label: 'User Trends & Analytics',  icon: TrendingUp },
  ]

  const STAT_CARDS = [
    { label: 'Total Users',    value: '1,284', change: '+12%', up: true  },
    { label: 'Total Trips',    value: '243',   change: '+8%',  up: true  },
    { label: 'Active Users',   value: '987',   change: '+15%', up: true  },
    { label: 'Avg Trip Days',  value: '14.2',  change: '-2%',  up: false },
  ]

  const filteredUsers = MOCK_USERS.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  )
  const filteredCities = POPULAR_CITIES.filter(c =>
    !search || c.city.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase())
  )
  const filteredActivities = POPULAR_ACTIVITIES.filter(a =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase())
  )

  const STATUS_STYLE: Record<string, string> = {
    active:   'bg-[#4eac6c]/15 text-[#4eac6c]',
    inactive: 'bg-[#1e1e22] text-[#52525b]',
    pending:  'bg-[#f59e0b]/15 text-[#f59e0b]',
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f4f4f5] flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-[#1e1e22] bg-[#111113] flex items-center px-6 gap-4 shrink-0">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[#4eac6c] font-bold text-lg">✦</span>
          <span className="font-bold text-sm">Traveloop</span>
          <span className="text-xs text-[#52525b] border border-[#1e1e22] px-2 py-0.5 rounded-full ml-1">Admin</span>
        </div>

        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#52525b]" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-8 rounded-lg bg-[#18181b] border border-[#2a2a2e] text-[#f4f4f5] placeholder-[#52525b] pl-9 pr-4 text-xs focus:outline-none focus:border-[#4eac6c]/50 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="text-xs text-[#52525b]">Logged in as Admin</div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs text-[#52525b] hover:text-[#f4f4f5] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#18181b]"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-[#1e1e22] bg-[#111113] px-6 flex items-center gap-1 shrink-0">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-all ${
              tab === id
                ? 'border-[#4eac6c] text-[#4eac6c]'
                : 'border-transparent text-[#52525b] hover:text-[#a1a1aa]'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* ── Analytics Tab ── */}
          {tab === 'analytics' && (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-4 gap-4">
                {STAT_CARDS.map(s => (
                  <div key={s.label} className="border border-[#1e1e22] rounded-xl bg-[#111113] p-4 space-y-2">
                    <p className="text-xs text-[#71717a]">{s.label}</p>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <div className={`flex items-center gap-1 text-xs font-medium ${s.up ? 'text-[#4eac6c]' : 'text-red-400'}`}>
                      {s.up ? <ArrowUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {s.change} this month
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Top users */}
                <div className="border border-[#1e1e22] rounded-xl bg-[#111113] overflow-hidden">
                  <div className="px-5 py-3 border-b border-[#1e1e22]">
                    <p className="text-sm font-semibold">Top Users by Trips</p>
                  </div>
                  <div className="p-4 space-y-3">
                    {MOCK_USERS.sort((a, b) => b.trips - a.trips).slice(0, 6).map((u, i) => (
                      <div key={u.id} className="flex items-center gap-3">
                        <span className="text-[10px] text-[#52525b] w-4 shrink-0">{i + 1}</span>
                        <div className="w-7 h-7 rounded-full bg-[#4eac6c]/15 border border-[#4eac6c]/20 flex items-center justify-center text-[9px] font-bold text-[#4eac6c] shrink-0">
                          {u.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{u.name}</p>
                          <p className="text-[10px] text-[#52525b] truncate">{u.email}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-1.5 rounded-full bg-[#4eac6c]/20" style={{ width: `${(u.trips / 9) * 60}px` }}>
                            <div className="h-full rounded-full bg-[#4eac6c]" style={{ width: '100%' }} />
                          </div>
                          <span className="text-xs font-bold text-[#4eac6c]">{u.trips}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Donut chart */}
                <div className="border border-[#1e1e22] rounded-xl bg-[#111113] overflow-hidden">
                  <div className="px-5 py-3 border-b border-[#1e1e22]">
                    <p className="text-sm font-semibold">Trip Status Distribution</p>
                  </div>
                  <div className="p-4 flex items-center gap-6">
                    <DonutChart />
                    <div className="space-y-2.5 flex-1">
                      {PIE_DATA.map(d => (
                        <div key={d.label} className="flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                          <span className="text-xs text-[#a1a1aa] flex-1">{d.label}</span>
                          <span className="text-xs font-bold">{d.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bar chart */}
                <div className="border border-[#1e1e22] rounded-xl bg-[#111113] overflow-hidden">
                  <div className="px-5 py-3 border-b border-[#1e1e22]">
                    <p className="text-sm font-semibold">Top Destinations</p>
                    <p className="text-[10px] text-[#52525b] mt-0.5">Total trips per city</p>
                  </div>
                  <div className="px-4 py-3">
                    <BarChart />
                  </div>
                </div>

                {/* Line chart */}
                <div className="border border-[#1e1e22] rounded-xl bg-[#111113] overflow-hidden">
                  <div className="px-5 py-3 border-b border-[#1e1e22] flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Monthly User Growth</p>
                      <p className="text-[10px] text-[#52525b] mt-0.5">Active users per month (2025)</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#4eac6c] font-semibold">
                      <ArrowUp className="w-3 h-3" />
                      +349%
                    </div>
                  </div>
                  <div className="px-4 pt-3 pb-1">
                    <LineChart />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Users Tab ── */}
          {tab === 'users' && (
            <div className="border border-[#1e1e22] rounded-xl bg-[#111113] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#1e1e22] flex items-center justify-between">
                <p className="text-sm font-semibold">Registered Users</p>
                <span className="text-xs text-[#71717a]">{filteredUsers.length} users</span>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1e1e22]">
                    {['User', 'Email', 'Trips', 'Status', 'Joined'].map(h => (
                      <th key={h} className="text-left text-[10px] font-semibold text-[#52525b] uppercase tracking-wider px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e22]">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-[#18181b] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#4eac6c]/15 border border-[#4eac6c]/20 flex items-center justify-center text-[10px] font-bold text-[#4eac6c] shrink-0">
                            {u.avatar}
                          </div>
                          <span className="text-sm font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#71717a]">{u.email}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-[#4eac6c]">{u.trips}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLE[u.status]}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#71717a]">{u.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Cities Tab ── */}
          {tab === 'cities' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Popular Destinations</p>
                <span className="text-xs text-[#71717a]">Based on user trip data</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {filteredCities.map((city, i) => (
                  <div key={city.city} className="border border-[#1e1e22] rounded-xl bg-[#111113] overflow-hidden group hover:border-[#4eac6c]/30 transition-all">
                    <div className="relative h-36 bg-[#18181b] overflow-hidden">
                      <img src={city.image} alt={city.city} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-2 left-2 bg-[#0a0a0b]/80 rounded-full px-2 py-0.5 flex items-center gap-1">
                        <span className="text-[10px] font-bold text-[#f4f4f5]">#{i + 1}</span>
                      </div>
                      {city.trending && (
                        <div className="absolute top-2 right-2 bg-[#4eac6c]/20 border border-[#4eac6c]/30 rounded-full px-2 py-0.5 flex items-center gap-1">
                          <TrendingUp className="w-2.5 h-2.5 text-[#4eac6c]" />
                          <span className="text-[9px] font-semibold text-[#4eac6c]">Trending</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">{city.city}</p>
                        <p className="text-xs text-[#71717a]">{city.country}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#4eac6c]">{city.trips}</p>
                        <p className="text-[10px] text-[#52525b]">trips</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Activities Tab ── */}
          {tab === 'activities' && (
            <div className="border border-[#1e1e22] rounded-xl bg-[#111113] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#1e1e22] flex items-center justify-between">
                <p className="text-sm font-semibold">Popular Activities</p>
                <span className="text-xs text-[#71717a]">{filteredActivities.length} activities</span>
              </div>
              <div className="divide-y divide-[#1e1e22]">
                {filteredActivities.map((a, i) => (
                  <div key={a.name} className="flex items-center gap-4 px-5 py-4 hover:bg-[#18181b] transition-colors">
                    <span className="text-xs text-[#52525b] w-5 shrink-0 font-mono">{String(i + 1).padStart(2, '0')}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{a.name}</p>
                      <span
                        className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 capitalize"
                        style={{ background: `${CATEGORY_COLORS[a.category]}20`, color: CATEGORY_COLORS[a.category] }}
                      >
                        {a.category}
                      </span>
                    </div>
                    <div className="text-center shrink-0">
                      <p className="text-sm font-bold">{a.count}</p>
                      <p className="text-[10px] text-[#52525b]">bookings</p>
                    </div>
                    <div className="text-center shrink-0">
                      <p className="text-sm font-bold">{'★'.repeat(Math.floor(a.rating))}</p>
                      <p className="text-[10px] text-[#52525b]">{a.rating}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-semibold shrink-0 ${a.trend >= 0 ? 'text-[#4eac6c]' : 'text-red-400'}`}>
                      {a.trend >= 0 ? <ArrowUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {a.trend >= 0 ? '+' : ''}{a.trend}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────── */

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('traveloop-admin-auth') === '1') setAuthed(true)
    setLoaded(true)
  }, [])

  function handleLogout() {
    sessionStorage.removeItem('traveloop-admin-auth')
    setAuthed(false)
  }

  if (!loaded) return <div className="min-h-screen bg-[#0a0a0b]" />

  return authed
    ? <AdminDashboard onLogout={handleLogout} />
    : <PasswordGate onAuth={() => setAuthed(true)} />
}
