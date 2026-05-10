import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ActivityTemplate } from '@/types'

interface ResultCardProps {
  item: ActivityTemplate
  onAdd?: (item: ActivityTemplate) => void
}

export default function ResultCard({ item, onAdd }: ResultCardProps) {
  return (
    <div className="w-full bg-white border border-[#E5E7EB] rounded-xl px-5 py-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
      <div className="w-16 h-16 rounded-lg bg-[#F3F4F6] flex-shrink-0 overflow-hidden">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#6B7280] text-xs">IMG</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[#1E1E1E] mb-1">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-[#6B7280] mb-1 truncate">{item.description}</p>
        )}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs bg-[#F3F4F6] text-[#6B7280]">{item.type}</Badge>
          {item.duration && <span className="text-xs text-[#6B7280]">{item.duration}</span>}
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="font-semibold text-[#1E1E1E]">
          {item.cost ? `$${item.cost}` : 'Free'}
        </span>
        {onAdd && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAdd(item)}
            className="text-xs border-[#F5A623] text-[#F5A623] hover:bg-[#F5A623] hover:text-white"
          >
            Add to Trip
          </Button>
        )}
      </div>
    </div>
  )
}
