'use client'

import Link from 'next/link'
import { useAuthContext } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const { user, logout } = useAuthContext()
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="w-full bg-[#1E1E1E] px-6 py-4 flex items-center justify-between">
      <Link href="/dashboard" className="brand text-white text-2xl font-bold">
        Traveloop
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="text-white text-sm hover:text-amber-400 transition-colors">Dashboard</Link>
        <Link href="/trips" className="text-white text-sm hover:text-amber-400 transition-colors">Trips</Link>
        <Link href="/search" className="text-white text-sm hover:text-amber-400 transition-colors">Search</Link>
        <Link href="/community" className="text-white text-sm hover:text-amber-400 transition-colors">Community</Link>
        <Link href="/profile" className="text-white text-sm hover:text-amber-400 transition-colors">Profile</Link>
        {user?.role === 'admin' && (
          <Link href="/admin" className="text-white text-sm hover:text-amber-400 transition-colors">Admin</Link>
        )}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            background: 'transparent',
            border: '1.5px solid rgba(255,255,255,0.3)',
            borderRadius: 8,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="text-white border-white hover:bg-white hover:text-[#1E1E1E] bg-transparent"
        >
          Logout
        </Button>
      </div>
    </nav>
  )
}
