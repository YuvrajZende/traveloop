'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuthContext } from '@/context/AuthContext'

export default function LoginPage() {
  const { login } = useAuthContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #FAFAF8 0%, #F1EBDF 100%)',
      fontFamily: 'DM Sans, sans-serif', padding: 24
    }}>
      <div style={{ width: '100%', maxWidth: 460, background: '#fff', borderRadius: 16, padding: '44px 44px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 24, left: 24, fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: 700, fontSize: 18 }}>
          Traveloop<span style={{ color: '#F5A623' }}>.</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, marginTop: 18 }}>
          <div style={{
            width: 88, height: 88, borderRadius: '50%', fontSize: 28,
            background: 'linear-gradient(135deg,#F4D9A4,#E0AC58)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>

          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 34, lineHeight: 1.1, fontWeight: 700, margin: 0 }}>Welcome back</h1>
            <p style={{ color: '#6B7280', fontSize: 14, marginTop: 6 }}>Sign in to keep planning your next escape.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>
                {error}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="james@traveloop.com"
                required
                style={{ background: '#F3F4F6', border: '2px solid transparent', borderRadius: 8, height: 46, padding: '0 16px', fontFamily: 'inherit', fontSize: 14, outline: 'none', width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                style={{ background: '#F3F4F6', border: '2px solid transparent', borderRadius: 8, height: 46, padding: '0 16px', fontFamily: 'inherit', fontSize: 14, outline: 'none', width: '100%' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#F5A623', color: '#1E1E1E', border: 0, borderRadius: 8,
                height: 52, padding: '0 28px', fontFamily: 'inherit', fontSize: 15,
                fontWeight: 600, cursor: 'pointer', marginTop: 6, width: '100%',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
            <div style={{ textAlign: 'center', fontSize: 13, color: '#6B7280', marginTop: 6 }}>
              Don&apos;t have an account?{' '}
              <Link href="/register" style={{ color: '#1E1E1E', fontWeight: 600 }}>Register</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
