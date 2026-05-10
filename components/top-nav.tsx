'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { currentUser } from '@/lib/mock-data'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useTheme } from '@/components/theme-provider'
import { Sun, Moon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/trips', label: 'My Trips' },
  { href: '/trips/new', label: 'Plan a Trip' },
  { href: '/checklist', label: 'Packing Checklist' },
  { href: '/notes', label: 'Trip Notes' },
  { href: '/community', label: 'Community' },
  { href: '/profile', label: 'Profile' },
  { href: '/settings', label: 'Settings' },
]

export function TopNav() {
  const router = useRouter()
  const { theme, toggle } = useTheme()

  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0 sticky top-0 z-40">
      <Link href="/dashboard" className="font-bold text-foreground tracking-tight text-base flex items-center gap-2">
        <span className="text-primary">✦</span>
        Traveloop
      </Link>

      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={(e) => toggle(e)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="focus:outline-none rounded-full"
            render={
              <button className="focus:outline-none">
                <Avatar className="w-8 h-8 border border-border cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all">
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground font-semibold">
                    {currentUser.avatar}
                  </AvatarFallback>
                </Avatar>
              </button>
            }
          />

          <DropdownMenuContent align="end" className="w-52">
            <div className="px-3 py-2 border-b border-border mb-1">
              <p className="text-xs font-semibold">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
            </div>
            {NAV_LINKS.map(({ href, label }) => (
              <DropdownMenuItem key={href} onClick={() => router.push(href)}>
                {label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => router.push('/login')}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
