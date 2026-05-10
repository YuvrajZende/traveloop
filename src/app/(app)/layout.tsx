'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/context/AuthContext'
import Navbar from '@/components/layout/Navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
        Loading...
      </div>
    )
  }

  if (!user) return null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--tl-bg, #FAFAF8)' }}>
      <Navbar />
      <main>{children}</main>
    </div>
  )
}
