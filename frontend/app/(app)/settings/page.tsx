'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api'
import { BackButton } from '@/components/back-button'

export default function SettingsPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await apiClient('/users/me')
        setFirstName(data.first_name || '')
        setLastName(data.last_name || '')
        setEmail(data.email || '')
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  async function handleSave() {
    setIsSaving(true)
    try {
      await apiClient('/users/me', {
        method: 'PUT',
        body: JSON.stringify({ first_name: firstName, last_name: lastName })
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading settings...</div>
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-2xl mx-auto">
      <BackButton href="/dashboard" />
      <h1 className="text-xl font-semibold">Settings</h1>

      <div className="border border-border rounded-xl bg-card p-6 space-y-5 shadow-sm">
        <h2 className="text-sm font-semibold">Account</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm">First Name</Label>
              <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="bg-background border-border h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Last Name</Label>
              <Input value={lastName} onChange={e => setLastName(e.target.value)} className="bg-background border-border h-10" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Email</Label>
            <Input disabled value={email} type="email" className="bg-muted border-border h-10 text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground mt-1">Email cannot be changed directly.</p>
          </div>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className={cn(buttonVariants({ size: 'sm' }), 'bg-primary text-primary-foreground hover:bg-primary/90 h-9')}
        >
          {isSaving ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      <div className="border border-border rounded-xl bg-card p-6 space-y-4 shadow-sm">
        <h2 className="text-sm font-semibold">Preferences</h2>
        <div className="space-y-3">
          {[
            { label: 'Email notifications', desc: 'Receive trip reminders and updates' },
            { label: 'Community highlights', desc: 'Weekly digest of top community posts' },
          ].map(pref => (
            <div key={pref.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium">{pref.label}</p>
                <p className="text-xs text-muted-foreground">{pref.desc}</p>
              </div>
              <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer shrink-0">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-border rounded-xl bg-card p-6 space-y-4 shadow-sm">
        <h2 className="text-sm font-semibold text-destructive">Danger zone</h2>
        <p className="text-sm text-muted-foreground">Permanently delete your account and all data. This cannot be undone.</p>
        <button className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-destructive text-destructive hover:bg-destructive/10 h-9')}>
          Delete account
        </button>
      </div>

      <Link href="/login" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-border h-9')}>
        Log out
      </Link>
    </div>
  )
}
