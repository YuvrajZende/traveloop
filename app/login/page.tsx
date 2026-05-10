'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { User } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username || !password) { setError('Please fill in all fields.'); return }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left green panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-primary p-12 text-primary-foreground relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative z-10">
          <span className="text-2xl font-bold tracking-tight">Traveloop</span>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-bold leading-tight tracking-tight">
            Plan your next<br />adventure.
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-sm leading-relaxed">
            Build multi-city itineraries, track your budget, and share your trips with the world.
          </p>
          <div className="flex gap-10 pt-4">
            <div>
              <p className="text-3xl font-bold">14k+</p>
              <p className="text-primary-foreground/70 text-sm mt-0.5">Trips planned</p>
            </div>
            <div>
              <p className="text-3xl font-bold">80+</p>
              <p className="text-primary-foreground/70 text-sm mt-0.5">Countries</p>
            </div>
            <div>
              <p className="text-3xl font-bold">4.9★</p>
              <p className="text-primary-foreground/70 text-sm mt-0.5">Rating</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-primary-foreground/40 text-sm">© 2026 Traveloop</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <span className="text-2xl font-bold text-primary">Traveloop</span>
          </div>

          {/* Photo circle */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-border bg-muted flex items-center justify-center shadow-sm">
              <User className="w-9 h-9 text-muted-foreground" />
            </div>
          </div>

          <div className="border border-border rounded-2xl bg-card p-8 shadow-sm space-y-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {mode === 'login' ? 'Sign in to your account.' : 'Start planning your adventure.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-medium">Full name</Label>
                  <Input
                    id="name"
                    placeholder="Alex Rivera"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="h-10 bg-background"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-xs font-medium">Username</Label>
                <Input
                  id="username"
                  placeholder="your@email.com"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="h-10 bg-background"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium">Password</Label>
                  {mode === 'login' && (
                    <span className="text-xs text-primary cursor-pointer hover:underline font-medium">Forgot password?</span>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="h-10 bg-background"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button
                type="submit"
                className={cn(
                  buttonVariants(),
                  'w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mt-1 btn-primary-glow transition-all'
                )}
              >
                {mode === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-3 text-xs text-muted-foreground">or</span>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
                className="text-primary font-semibold hover:underline"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
