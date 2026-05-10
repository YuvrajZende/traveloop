'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import type { ChecklistItem } from '@/types'

interface ChecklistCategoryProps {
  category: string
  items: ChecklistItem[]
  onToggle: (id: string, packed: boolean) => void
}

export default function ChecklistCategory({ category, items, onToggle }: ChecklistCategoryProps) {
  const packed = items.filter(i => i.packed).length
  const total = items.length

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#1E1E1E]">{category}</h3>
        <Badge variant="secondary" className="bg-[#F3F4F6] text-[#6B7280] text-xs">
          {packed}/{total}
        </Badge>
      </div>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3">
            <Checkbox
              id={item.id}
              checked={item.packed}
              onCheckedChange={(checked) => onToggle(item.id, !!checked)}
            />
            <label
              htmlFor={item.id}
              className={`text-sm cursor-pointer ${item.packed ? 'line-through text-[#6B7280]' : 'text-[#1E1E1E]'}`}
            >
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
