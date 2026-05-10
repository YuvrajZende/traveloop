import { Badge } from '@/components/ui/badge'
import type { Activity } from '@/types'

interface DayBlockProps {
  day: string
  date?: string
  activities: Activity[]
}

export default function DayBlock({ day, date, activities }: DayBlockProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-[#1E1E1E] text-white px-3 py-1 rounded-lg text-sm font-semibold">{day}</div>
        {date && <span className="text-sm text-[#6B7280]">{date}</span>}
      </div>
      <div className="space-y-3 ml-4">
        {activities.map(activity => (
          <div key={activity.id} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-[#1E1E1E] text-sm">{activity.name}</h4>
                <Badge variant="secondary" className="text-xs bg-[#F3F4F6] text-[#6B7280]">{activity.type}</Badge>
              </div>
              {activity.description && (
                <p className="text-xs text-[#6B7280]">{activity.description}</p>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              {activity.duration && (
                <p className="text-xs text-[#6B7280] mb-1">{activity.duration}</p>
              )}
              {activity.cost !== undefined && (
                <p className="font-semibold text-[#1E1E1E] text-sm">${activity.cost}</p>
              )}
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-sm text-[#6B7280] italic">No activities planned for this day.</p>
        )}
      </div>
    </div>
  )
}
