'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface StandardHeaderProps {
  placeholder?: string
  onSearch?: (query: string) => void
}

export default function StandardHeader({ placeholder = 'Search bar......', onSearch }: StandardHeaderProps) {
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  return (
    <div className="w-full px-6 py-4 bg-white border-b border-[#E5E7EB]">
      <form onSubmit={handleSearch} className="mb-3">
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#F3F4F6] border-[#E5E7EB] text-sm"
        />
      </form>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="rounded-full text-xs border-[#E5E7EB]">Group by</Button>
        <Button variant="outline" size="sm" className="rounded-full text-xs border-[#E5E7EB]">Filter</Button>
        <Button variant="outline" size="sm" className="rounded-full text-xs border-[#E5E7EB]">Sort by...</Button>
      </div>
    </div>
  )
}
