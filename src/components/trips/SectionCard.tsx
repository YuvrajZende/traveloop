'use client'

interface Section {
  id: string
  label: string
  description: string
  startDate: string
  endDate: string
  budget: string
}

interface SectionCardProps {
  section: Section
  index: number
  onChange: (id: string, field: keyof Section, value: string) => void
  onRemove: (id: string) => void
}

export default function SectionCard({ section, index, onChange, onRemove }: SectionCardProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-lg text-[#1E1E1E]">Section {index + 1}:</span>
        {index > 0 && (
          <button
            onClick={() => onRemove(section.id)}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        )}
      </div>
      <textarea
        value={section.description}
        onChange={e => onChange(section.id, 'description', e.target.value)}
        placeholder="Describe this part of the trip — cities, activities, notes..."
        className="w-full border border-[#E5E7EB] rounded-lg p-3 text-sm bg-[#F3F4F6] resize-none h-24 mb-3"
      />
      <div className="flex items-center gap-3 mb-3">
        <span className="text-sm text-[#6B7280] whitespace-nowrap">Date Range:</span>
        <input
          type="date"
          value={section.startDate}
          onChange={e => onChange(section.id, 'startDate', e.target.value)}
          className="border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-sm bg-[#F3F4F6] flex-1"
        />
        <span className="text-sm text-[#6B7280]">to</span>
        <input
          type="date"
          value={section.endDate}
          onChange={e => onChange(section.id, 'endDate', e.target.value)}
          className="border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-sm bg-[#F3F4F6] flex-1"
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <span className="text-sm text-[#6B7280]">Budget of this section:</span>
        <input
          type="number"
          value={section.budget}
          onChange={e => onChange(section.id, 'budget', e.target.value)}
          placeholder="0"
          className="border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-sm bg-[#F3F4F6] w-32 text-right"
        />
      </div>
    </div>
  )
}
