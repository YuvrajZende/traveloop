import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDateRange, getStatusColor } from '@/lib/utils'
import type { Trip } from '@/types'

interface TripCardWideProps {
  trip: Trip
  onDelete?: (id: string) => void
}

export default function TripCardWide({ trip, onDelete }: TripCardWideProps) {
  return (
    <div className="w-full bg-white border border-[#E5E7EB] rounded-xl px-5 py-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
      <div className="w-16 h-16 rounded-lg bg-[#F3F4F6] flex-shrink-0 overflow-hidden">
        {trip.coverPhoto ? (
          <img src={trip.coverPhoto} alt={trip.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#6B7280] text-xs">IMG</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-[#1E1E1E] truncate">{trip.name}</h3>
          <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(trip.status)}`} variant="secondary">
            {trip.status}
          </Badge>
        </div>
        <p className="text-sm text-[#6B7280]">
          {formatDateRange(trip.startDate, trip.endDate)} · {trip.stops?.length || 0} cities
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link href={`/trips/${trip.id}/view`}>
          <Button size="sm" variant="outline" className="text-xs">View</Button>
        </Link>
        <Link href={`/trips/${trip.id}/build`}>
          <Button size="sm" variant="outline" className="text-xs">Edit</Button>
        </Link>
        {onDelete && (
          <Button
            size="sm"
            variant="outline"
            className="text-xs text-red-500 border-red-200 hover:bg-red-50"
            onClick={() => onDelete(trip.id)}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  )
}
