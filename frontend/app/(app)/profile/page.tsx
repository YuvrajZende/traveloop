'use client'

import Link from 'next/link'
import Image from 'next/image'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { mockTrips, currentUser } from '@/lib/mock-data'
import { User, Pencil, Check, Camera, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api'
import { BackButton } from '@/components/back-button'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  
  // Real DB state
  const [userProfile, setUserProfile] = useState<any>(null)
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [trips, setTrips] = useState<any[]>([])
  
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function loadProfile() {
      try {
        const [user, myTrips] = await Promise.all([
          apiClient('/users/me'),
          apiClient('/trips')
        ])
        
        setUserProfile(user)
        setFirstName(user.first_name || '')
        setLastName(user.last_name || '')
        setBio(user.additional_info || 'Avid traveler and adventure seeker. Love exploring new cultures and cuisines around the world.')
        setAvatarUrl(user.photo_url || null)
        
        setTrips(Array.isArray(myTrips) ? myTrips : [])
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  async function handleSave() {
    try {
      const updated = await apiClient('/users/me', {
        method: 'PUT',
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          additional_info: bio,
        })
      })
      setUserProfile(updated)
      setEditing(false)
    } catch (err) {
      console.error('Failed to update profile:', err)
      alert('Failed to save changes.')
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setAvatarUrl(URL.createObjectURL(file))
  }

  const preplanned = trips.filter(t => !t.is_preplanned) // Or logic to separate them
  const previous = trips.filter(t => t.end_date && new Date(t.end_date) < new Date())

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      <BackButton href="/dashboard" />
      {/* User details card */}
      <div className="border border-border rounded-xl bg-card p-6 flex gap-6 items-start shadow-sm">
        {/* Avatar with upload */}
        <div className="shrink-0">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="relative group w-28 h-28 rounded-full border-2 border-border bg-muted flex items-center justify-center overflow-hidden focus:outline-none"
          >
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Profile" fill className="object-cover" sizes="112px" />
            ) : (
              <User className="w-12 h-12 text-muted-foreground" />
            )}
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </button>
          <p className="text-[10px] text-muted-foreground text-center mt-2">Click to change</p>
        </div>

        {/* Info box */}
        <div className="flex-1 border border-border rounded-xl p-5 bg-background/50 relative">
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            className={cn(
              'absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
              editing
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'border border-border text-foreground hover:bg-muted'
            )}
          >
            {editing ? <Check className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
            {editing ? 'Save' : 'Edit'}
          </button>

          {editing ? (
            <div className="space-y-3 pr-24">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">First Name</p>
                  <Input
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="text-sm font-semibold border-border bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Last Name</p>
                  <Input
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="text-sm font-semibold border-border bg-background"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <Input
                  disabled
                  defaultValue={userProfile?.email}
                  type="email"
                  className="text-sm border-border bg-muted text-muted-foreground"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Bio</p>
                <Textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="text-xs text-muted-foreground resize-none border-border bg-background"
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="pr-24">
              <p className="text-lg font-semibold text-foreground">
                {userProfile?.first_name} {userProfile?.last_name}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">{userProfile?.email}</p>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{bio}</p>
              <div className="flex gap-4 mt-4 pt-4 border-t border-border">
                <div>
                  <p className="text-base font-semibold">{trips.length}</p>
                  <p className="text-xs text-muted-foreground">Trips</p>
                </div>
                <div>
                  <p className="text-base font-semibold">0</p>
                  <p className="text-xs text-muted-foreground">Countries</p>
                </div>
                <div>
                  <p className="text-base font-semibold">0</p>
                  <p className="text-xs text-muted-foreground">Cities</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preplanned Trips */}
      <section>
        <h2 className="text-sm font-semibold mb-4">Preplanned Trips</h2>
        <div className="grid grid-cols-3 gap-4">
          {preplanned.length > 0 ? preplanned.slice(0, 3).map(trip => (
            <div key={trip.id} className="border border-border rounded-xl bg-card overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="relative h-36 bg-muted flex items-center justify-center">
                {trip.cover_image_url ? (
                  <Image src={trip.cover_image_url} alt={trip.title} fill className="object-cover" sizes="300px" />
                ) : (
                  <span className="text-muted-foreground text-xs">No Image</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="p-3 space-y-2">
                <p className="text-sm font-medium truncate">{trip.title}</p>
                <p className="text-xs text-muted-foreground">
                  {trip.start_date ? format(new Date(trip.start_date), 'MMM d, yyyy') : 'No Date'}
                </p>
                <Link
                  href={`/trips/${trip.id}/summary`}
                  className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full text-xs border-border')}
                >
                  View Summary
                </Link>
              </div>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground col-span-3">No planned trips found.</p>
          )}
        </div>
      </section>

      {/* Previous Trips */}
      <section>
        <h2 className="text-sm font-semibold mb-4">Previous Trips</h2>
        <div className="grid grid-cols-3 gap-4">
          {previous.length > 0 ? previous.slice(0, 3).map(trip => (
            <div key={trip.id} className="border border-border rounded-xl bg-card overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="relative h-36 bg-muted flex items-center justify-center">
                {trip.cover_image_url ? (
                  <Image src={trip.cover_image_url} alt={trip.title} fill className="object-cover" sizes="300px" />
                ) : (
                  <span className="text-muted-foreground text-xs">No Image</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="p-3 space-y-2">
                <p className="text-sm font-medium truncate">{trip.title}</p>
                <p className="text-xs text-muted-foreground">
                  {trip.start_date ? format(new Date(trip.start_date), 'MMM d, yyyy') : 'No Date'}
                </p>
                <Link
                  href={`/trips/${trip.id}/summary`}
                  className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full text-xs border-border')}
                >
                  View Summary
                </Link>
              </div>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground col-span-3">No previous trips found.</p>
          )}
        </div>
      </section>
    </div>
  )
}
