import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateRange(start: string | Date, end: string | Date): string {
  const s = new Date(start)
  const e = new Date(end)
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  return `${s.toLocaleDateString('en-US', opts)} – ${e.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`
}

export function getDayCount(start: string | Date, end: string | Date): number {
  const ms = new Date(end).getTime() - new Date(start).getTime()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'ongoing': return 'bg-green-100 text-green-800'
    case 'upcoming': return 'bg-amber-100 text-amber-800'
    case 'completed': return 'bg-gray-100 text-gray-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}
