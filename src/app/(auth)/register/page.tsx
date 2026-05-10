'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { saveToken } from '@/lib/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', city: '', country: '', additionalInfo: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/register', {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.additionalInfo || 'password123',
        phone: form.phone,
        city: form.city,
        country: form.country,
      })
      saveToken(res.data.token)
      router.push('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Registration failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { background: '#F3F4F6', border: '2px solid transparent', borderRadius: 8, height: 46, padding: '0 16px', fontFamily: 'inherit', fontSize: 14, outline: 'none', width: '100%' }
  const labelStyle = { fontSize: 13, fontWeight: 500 as const }
  const fieldStyle = { display: 'flex' as const, flexDirection: 'column' as const, gap: 6 }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FAFAF8 0%, #F1EBDF 100%)', fontFamily: 'DM Sans, sans-serif', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 620, background: '#fff', borderRadius: 16, padding: '44px 44px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 24, left: 24, fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: 700, fontSize: 18 }}>
          Traveloop<span style={{ color: '#F5A623' }}>.</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginTop: 14 }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'linear-gradient(135deg,#F4D9A4,#E0AC58)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, fontWeight: 700, marginTop: 10, margin: '10px 0 0' }}>Register Users</h1>
          <p style={{ color: '#6B7280', fontSize: 13.5 }}>A few details and you&apos;ll be on the road.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginTop: 16 }}>{error}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 24 }}>
            <div style={fieldStyle}><label style={labelStyle}>First Name</label><input style={inputStyle} placeholder="James" value={form.firstName} onChange={set('firstName')} required /></div>
            <div style={fieldStyle}><label style={labelStyle}>Last Name</label><input style={inputStyle} placeholder="Doe" value={form.lastName} onChange={set('lastName')} required /></div>
            <div style={fieldStyle}><label style={labelStyle}>Email Address</label><input type="email" style={inputStyle} placeholder="james@example.com" value={form.email} onChange={set('email')} required /></div>
            <div style={fieldStyle}><label style={labelStyle}>Phone Number</label><input style={inputStyle} placeholder="+1 555 0142" value={form.phone} onChange={set('phone')} /></div>
            <div style={fieldStyle}><label style={labelStyle}>City</label><input style={inputStyle} placeholder="Brooklyn" value={form.city} onChange={set('city')} /></div>
            <div style={fieldStyle}><label style={labelStyle}>Country</label><input style={inputStyle} placeholder="United States" value={form.country} onChange={set('country')} /></div>
          </div>
          <div style={{ ...fieldStyle, marginTop: 14 }}>
            <label style={labelStyle}>Password</label>
            <input type="password" style={inputStyle} placeholder="Create a password" value={form.additionalInfo} onChange={set('additionalInfo')} required />
          </div>
          <button type="submit" disabled={loading} style={{ background: '#F5A623', color: '#1E1E1E', border: 0, borderRadius: 8, height: 52, width: '100%', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 18, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Registering...' : 'Register Users'}
          </button>
          <div style={{ textAlign: 'center', fontSize: 13, color: '#6B7280', marginTop: 14 }}>
            Already have an account? <Link href="/login" style={{ color: '#1E1E1E', fontWeight: 600 }}>Login</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
