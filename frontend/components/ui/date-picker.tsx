'use client'

import { useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

interface DatePickerProps {
  value: string // YYYY-MM-DD
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

function parseYMD(value: string): Date | null {
  if (!value) return null
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function toYMD(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function displayFmt(value: string): string {
  const d = parseYMD(value)
  if (!d) return ''
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function DatePicker({ value, onChange, placeholder = 'Pick a date', className }: DatePickerProps) {
  const today = new Date()
  const sel = parseYMD(value)
  const [viewYear, setViewYear] = useState(sel?.getFullYear() ?? today.getFullYear())
  const [viewMonth, setViewMonth] = useState(sel?.getMonth() ?? today.getMonth())

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDow = new Date(viewYear, viewMonth, 1).getDay()

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const label = displayFmt(value)

  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className={cn(
              'flex items-center gap-2 text-sm border border-border rounded-lg px-3 h-10 bg-background hover:bg-muted/50 transition-colors text-left w-full',
              !label && 'text-muted-foreground',
              className
            )}
          >
            <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="flex-1">{label || placeholder}</span>
          </button>
        }
      />
      <PopoverContent className="w-72 p-0" align="start">
        <div className="p-4 space-y-3">
          {/* Month nav */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-foreground">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-foreground"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDow }).map((_, i) => <div key={`pad-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
              const isSelected = sel
                ? day === sel.getDate() && viewMonth === sel.getMonth() && viewYear === sel.getFullYear()
                : false
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => onChange(toYMD(viewYear, viewMonth, day))}
                  className={cn(
                    'w-full aspect-square flex items-center justify-center text-sm rounded-lg transition-colors',
                    isSelected && 'bg-primary text-primary-foreground font-semibold shadow-sm',
                    !isSelected && isToday && 'border border-primary text-primary font-semibold',
                    !isSelected && !isToday && 'hover:bg-muted text-foreground'
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-between pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(toYMD(today.getFullYear(), today.getMonth(), today.getDate()))
                setViewYear(today.getFullYear())
                setViewMonth(today.getMonth())
              }}
              className="text-xs text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
