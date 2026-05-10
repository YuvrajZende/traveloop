'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = ['Plan a Trip', 'Build Itinerary', 'Packing Checklist', 'Summary']

export function TripFlowSteps({ current }: { current: number }) {
  return (
    <div className="border border-border rounded-xl bg-card px-6 py-5 shadow-sm">
      <div className="flex items-start">
        {STEPS.map((step, i) => (
          <div key={step} className={cn('flex items-start', i < STEPS.length - 1 && 'flex-1')}>
            <div className="flex flex-col items-center gap-2">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all duration-300 shrink-0',
                i < current  ? 'bg-primary border-primary text-primary-foreground' :
                i === current ? 'bg-card border-primary text-primary' :
                                'bg-muted/50 border-border text-muted-foreground'
              )}>
                {i < current ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <p className={cn(
                'text-[11px] font-medium whitespace-nowrap text-center leading-tight',
                i < current  ? 'text-primary' :
                i === current ? 'text-foreground font-semibold' :
                                'text-muted-foreground'
              )}>{step}</p>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                'flex-1 h-0.5 rounded-full mt-4 mx-3',
                i < current ? 'bg-primary' : 'bg-border'
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
