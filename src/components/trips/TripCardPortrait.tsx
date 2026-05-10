import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDateRange, getStatusColor } from '@/lib/utils'
import type { Trip } from '@/types'

interface TripCardPortraitProps {
  trip: Trip
  showViewButton?: boolean
}

export default function TripCardPortrait({ trip, showViewButton = true }: TripCardPortraitProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="w-full h-40 bg-[#F3F4F6] flex-shrink-0 overflow-hidden">
        {trip.coverPhoto ? (
          <img src={trip.coverPhoto} alt={trip.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#6B7280] text-sm">
            {trip.stops?.[0]?.city || 'Trip'}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-[#1E1E1E] text-sm leading-tight">{trip.name}</h3>
          <Badge className={`text-xs px-1.5 py-0 flex-shrink-0 ${getStatusColor(trip.status)}`} variant="secondary">
            {trip.status}
          </Badge>
        </div>
        <p className="text-xs text-[#6B7280] mb-3">{formatDateRange(trip.startDate, trip.endDate)}</p>
        {showViewButton && (
          <Link href={`/trips/${trip.id}/view`} className="mt-auto">
            <Button size="sm" variant="outline" className="w-full text-xs">View</Button>
          </Link>
        )}
      </div>
    </div>
  )
}
