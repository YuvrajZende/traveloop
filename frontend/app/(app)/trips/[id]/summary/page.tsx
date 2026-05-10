'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { TripFlowSteps } from '@/components/trip-flow-steps'
import { format } from 'date-fns'
import { MapPin, Calendar, DollarSign, Package, CheckCircle2, ArrowRight, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api'

export default function TripSummaryPage() {
  const params = useParams()
  const router = useRouter()
  const tripId = (params.id as string) ?? '1'

  const [trip, setTrip] = useState<any>(null)
  const [sectionsData, setSectionsData] = useState<any[]>([])
  const [packInfo, setPackInfo] = useState({ packed: 0, total: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadSummary() {
      try {
        const [tripRes, checklistRes] = await Promise.all([
          apiClient(`/itinerary/view/${tripId}`),
          apiClient(`/checklist/${tripId}`)
        ])
        
        setTrip(tripRes.trip)
        setSectionsData(tripRes.sections || [])
        setPackInfo({
          packed: checklistRes.progress?.packed_items || 0,
          total: checklistRes.progress?.total_items || 0
        })
      } catch (err) {
        console.error('Failed to load summary:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadSummary()
  }, [tripId])

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading trip summary...</div>
  }

  if (!trip) {
    return <div className="p-8 text-center text-muted-foreground">Trip not found.</div>
  }

  const packPct = packInfo.total ? Math.round((packInfo.packed / packInfo.total) * 100) : 0
  const sectionsCount = sectionsData.length
  const totalDays = trip.start_date && trip.end_date 
    ? Math.ceil((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / 86400000) + 1
    : 0

  const totalActivities = sectionsData.reduce((sum: number, s: any) => sum + (s.activities?.length || 0), 0)

  // Calculate budget: use trip total_budget if set, otherwise sum section budgets
  const sectionBudgetSum = sectionsData.reduce((sum: number, s: any) => sum + (parseFloat(s.budget) || 0), 0)
  const displayBudget = (trip.total_budget && trip.total_budget > 0) ? trip.total_budget : sectionBudgetSum

  const stats = [
    { icon: Calendar,    label: 'Total Days',    value: `${totalDays} days` },
    { icon: MapPin,      label: 'Destinations',  value: trip.place ? '1 destination' : '0 destinations' },
    { icon: FileText,    label: 'Itinerary',     value: `${sectionsCount} sections planned` },
    { icon: DollarSign,  label: 'Budget',        value: displayBudget > 0 ? `$${displayBudget.toLocaleString()}` : 'Not set' },
    { icon: Package,     label: 'Packed',        value: `${packInfo.packed}/${packInfo.total} items` },
    { icon: CheckCircle2,label: 'Activities',    value: `${totalActivities} planned` },
  ]

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto pb-16">
      <TripFlowSteps current={3} />

      {/* Hero celebration card */}
      <div className="relative rounded-2xl overflow-hidden border border-border shadow-lg">
        <div className="absolute inset-0 bg-muted">
          {trip.cover_image_url ? (
            <Image src={trip.cover_image_url} alt={trip.title} fill className="object-cover opacity-30" sizes="800px" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-muted opacity-50" />
          )}
        </div>
        <div className="relative z-10 px-8 py-10 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/15 border-2 border-primary mb-2">
            <CheckCircle2 className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Your trip is ready!</h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            You've planned your itinerary and started packing. Here's a full summary of <span className="font-semibold text-foreground">{trip.title}</span>.
          </p>
        </div>
      </div>

      {/* Trip overview */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3 border-b border-border bg-muted/40">
          <div className="w-1 h-4 rounded-full bg-primary" />
          <h2 className="text-sm font-semibold">Trip Overview</h2>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-bold">{trip.title}</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {trip.start_date ? format(new Date(trip.start_date), 'MMMM d') : 'TBD'} – {trip.end_date ? format(new Date(trip.end_date), 'MMMM d, yyyy') : 'TBD'}
              </p>
            </div>
            <span className={cn(
              'text-xs px-2.5 py-1 rounded-full font-medium capitalize',
              trip.status === 'upcoming'  ? 'bg-primary/10 text-primary' :
              trip.status === 'planning'  ? 'bg-accent text-accent-foreground' :
              trip.status === 'past'      ? 'bg-muted text-muted-foreground' :
                                            'bg-muted text-muted-foreground'
            )}>{trip.status || 'planning'}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{trip.place || 'Unknown destination'}</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="border border-border rounded-xl bg-card p-4 space-y-2 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
            <p className="text-base font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Itinerary sections */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3 border-b border-border bg-muted/40">
          <div className="w-1 h-4 rounded-full bg-primary" />
          <h2 className="text-sm font-semibold">Itinerary Sections</h2>
          <span className="text-xs text-muted-foreground ml-auto">{sectionsCount} sections built</span>
        </div>
        <div className="divide-y divide-border">
          {sectionsData.map((section: any, i: number) => (
            <div key={section.id} className="flex items-center gap-4 px-5 py-3.5">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{section.title}</p>
                <p className="text-xs text-muted-foreground">{section.activities?.length || 0} activities planned</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {section.start_date ? format(new Date(section.start_date), 'MMM d') : ''}
              </span>
            </div>
          ))}
          {sectionsData.length === 0 && (
             <div className="px-5 py-4 text-center text-sm text-muted-foreground">No itinerary sections built yet.</div>
          )}
        </div>
      </div>

      {/* Packing checklist progress */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3 border-b border-border bg-muted/40">
          <div className="w-1 h-4 rounded-full bg-primary" />
          <h2 className="text-sm font-semibold">Packing Progress</h2>
          <span className="text-xs font-bold text-primary ml-auto">{packPct}% packed</span>
        </div>
        <div className="p-5 space-y-3">
          <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${packPct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{packInfo.packed} of {packInfo.total} items packed</p>
          {packPct < 100 && (
            <button
              onClick={() => router.push(`/trips/${tripId}/checklist`)}
              className="text-xs text-primary hover:underline"
            >
              Finish packing →
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Link
          href={`/trips`}
          className={cn(buttonVariants({ variant: 'outline' }), 'flex-1 border-border h-11')}
        >
          View Full Trip
        </Link>
        <Link
          href="/trips"
          className={cn(buttonVariants(), 'flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-11 gap-2 btn-primary-glow transition-all')}
        >
          Go to My Trips
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
