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
import { User, Camera } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    city: '', country: '', info: '',
  })

  function set(field: string, val: string) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) setAvatarUrl(URL.createObjectURL(f))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left green panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-primary p-12 text-primary-foreground">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight">Traveloop</span>
        </div>
        <div className="space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
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
        <p className="text-primary-foreground/40 text-sm">© 2026 Traveloop</p>
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
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative group w-20 h-20 rounded-full border-2 border-border bg-muted flex items-center justify-center overflow-hidden hover:border-primary transition-colors"
            >
              {avatarUrl
                ? <Image src={avatarUrl} alt="Avatar" fill className="object-cover" sizes="80px" />
                : <User className="w-8 h-8 text-muted-foreground" />
              }
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </button>
            <p className="text-xs text-muted-foreground">Upload photo</p>
          </div>

          <div className="border border-border rounded-2xl bg-card p-8 shadow-sm space-y-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">Create account</h2>
              <p className="text-sm text-muted-foreground mt-1">Start planning your next adventure.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs font-medium">First Name</Label>
                  <Input id="firstName" placeholder="Alex" value={form.firstName} onChange={e => set('firstName', e.target.value)} className="h-10 bg-background" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs font-medium">Last Name</Label>
                  <Input id="lastName" placeholder="Rivera" value={form.lastName} onChange={e => set('lastName', e.target.value)} className="h-10 bg-background" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                  <Input id="email" type="email" placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} className="h-10 bg-background" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-medium">Phone</Label>
                  <Input id="phone" type="tel" placeholder="+1 234 567 890" value={form.phone} onChange={e => set('phone', e.target.value)} className="h-10 bg-background" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-xs font-medium">City</Label>
                  <Input id="city" placeholder="New York" value={form.city} onChange={e => set('city', e.target.value)} className="h-10 bg-background" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="country" className="text-xs font-medium">Country</Label>
                  <Input id="country" placeholder="USA" value={form.country} onChange={e => set('country', e.target.value)} className="h-10 bg-background" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="info" className="text-xs font-medium">Additional Information</Label>
                <Textarea
                  id="info"
                  placeholder="Tell us a bit about yourself and your travel style..."
                  value={form.info}
                  onChange={e => set('info', e.target.value)}
                  rows={3}
                  className="resize-none bg-background text-sm"
                />
              </div>

              <button
                type="submit"
                className={cn(buttonVariants(), 'w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-medium mt-1')}
              >
                Create account
              </button>
            </form>

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
