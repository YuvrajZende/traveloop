'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Camera, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [form, setForm] = useState({
    username: '', firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '',
    city: '', country: '', info: '',
  })

  function set(field: string, val: string) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) setAvatarUrl(URL.createObjectURL(f))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.username || !form.email || !form.firstName || !form.lastName || !form.password) {
      setError('Please fill in all required fields.')
      return
    }

    if (form.username.length < 3) {
      setError('Username must be at least 3 characters.')
      return
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)
    try {
      const { authApi } = await import('@/lib/api')

      await authApi.register({
        username: form.username,
        password: form.password,
        email: form.email,
        first_name: form.firstName,
        last_name: form.lastName,
        phone_number: form.phone,
        city: form.city,
        country: form.country,
        additional_info: form.info
      })
      
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left green panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-primary p-12 text-primary-foreground relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative z-10 flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight">Traveloop</span>
        </div>
        
        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-bold leading-tight tracking-tight">
            Join a world<br />of travelers.
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-sm leading-relaxed">
            Create your account and start building unforgettable journeys with Traveloop.
          </p>
          <div className="flex gap-10 pt-4">
            <div>
              <p className="text-3xl font-bold">14k+</p>
              <p className="text-primary-foreground/70 text-sm mt-0.5">Members</p>
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
      <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md space-y-6 py-6">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <span className="text-2xl font-bold text-primary">Traveloop</span>
          </div>

          {/* Photo upload */}
          <div className="flex flex-col items-center gap-2">
            <div 
              onClick={() => fileRef.current?.click()}
              className="w-24 h-24 rounded-full border-2 border-dashed border-border bg-muted flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors relative overflow-hidden group"
            >
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
              ) : (
                <>
                  <Camera className="w-8 h-8 text-muted-foreground mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] text-muted-foreground font-medium">Upload</span>
                </>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={handleFile} />
          </div>

          <div className="border border-border rounded-2xl bg-card p-8 shadow-sm space-y-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">Create account</h2>
              <p className="text-sm text-muted-foreground mt-1">Start planning your next adventure.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-xs font-medium">Username <span className="text-destructive">*</span></Label>
                <Input id="username" placeholder="Choose a username" value={form.username} onChange={e => set('username', e.target.value)} className="h-11 bg-background" autoComplete="username" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs font-medium">First Name <span className="text-destructive">*</span></Label>
                  <Input id="firstName" placeholder="First Name" value={form.firstName} onChange={e => set('firstName', e.target.value)} className="h-11 bg-background" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs font-medium">Last Name <span className="text-destructive">*</span></Label>
                  <Input id="lastName" placeholder="Last Name" value={form.lastName} onChange={e => set('lastName', e.target.value)} className="h-11 bg-background" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium">Email Address <span className="text-destructive">*</span></Label>
                  <Input id="email" type="email" placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} className="h-11 bg-background" autoComplete="email" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-medium">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} className="h-11 bg-background" />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-medium">Password <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Min 8 characters" value={form.password} onChange={e => set('password', e.target.value)} className="h-11 bg-background pr-10" autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-xs font-medium">Confirm Password <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-enter password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} className="h-11 bg-background pr-10" autoComplete="new-password" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-xs font-medium">City</Label>
                  <Input id="city" placeholder="City" value={form.city} onChange={e => set('city', e.target.value)} className="h-11 bg-background" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="country" className="text-xs font-medium">Country</Label>
                  <Input id="country" placeholder="Country" value={form.country} onChange={e => set('country', e.target.value)} className="h-11 bg-background" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="info" className="text-xs font-medium">Bio / Additional Info</Label>
                <Textarea
                  id="info"
                  placeholder="Tell us about yourself..."
                  value={form.info}
                  onChange={e => set('info', e.target.value)}
                  rows={3}
                  className="resize-none bg-background text-sm"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className={cn(buttonVariants(), 'w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mt-2 btn-primary-glow transition-all disabled:opacity-50')}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
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
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
