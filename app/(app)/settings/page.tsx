import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { currentUser } from '@/lib/mock-data'

export default function SettingsPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold">Settings</h1>

      <div className="border border-border rounded-xl bg-card p-6 space-y-5 shadow-sm">
        <h2 className="text-sm font-semibold">Account</h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm">Name</Label>
            <Input defaultValue={currentUser.name} className="bg-background border-border h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Email</Label>
            <Input defaultValue={currentUser.email} type="email" className="bg-background border-border h-10" />
          </div>
        </div>
        <button className={cn(buttonVariants({ size: 'sm' }), 'bg-primary text-primary-foreground hover:bg-primary/90 h-9')}>
          Save changes
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
