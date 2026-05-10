'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { currentUser } from '@/lib/mock-data'
import {
  LayoutDashboard,
  Map,
  PlusCircle,
  Settings,
  LogOut,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/trips', label: 'My Trips', icon: Map },
  { href: '/trips/new', label: 'Plan New Trip', icon: PlusCircle },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <aside className="w-60 shrink-0 flex flex-col border-r border-sidebar-border bg-sidebar h-screen sticky top-0">
      {/* Brand */}
      <div className="p-5 flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
          <span className="text-primary-foreground text-xs font-bold">TL</span>
        </div>
        <span className="font-semibold text-sidebar-foreground tracking-tight">Traveloop</span>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <Separator className="bg-sidebar-border" />
      <div className="p-3 space-y-0.5">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <Settings className="w-4 h-4 shrink-0" />
          Settings
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Log out
        </Link>
        <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
          <Avatar className="w-7 h-7">
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              {currentUser.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
