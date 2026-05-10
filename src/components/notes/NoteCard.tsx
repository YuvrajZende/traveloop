import { formatDate } from '@/lib/utils'
import type { Note } from '@/types'

interface NoteCardProps {
  note: Note
}

export default function NoteCard({ note }: NoteCardProps) {
  return (
    <div className="w-full bg-white border border-[#E5E7EB] rounded-xl p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-[#1E1E1E]">{note.title}</h3>
        <span className="text-xs text-[#6B7280] flex-shrink-0 ml-4">{formatDate(note.createdAt)}</span>
      </div>
      <p className="text-sm text-[#6B7280] leading-relaxed">{note.content}</p>
    </div>
  )
}
