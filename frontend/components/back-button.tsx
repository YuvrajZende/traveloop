'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export function BackButton({
  href,
  label = 'Back',
  className,
}: {
  href?: string
  label?: string
  className?: string
}) {
  const router = useRouter()

  return (
    <button
      onClick={() => href ? router.push(href) : router.back()}
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'sm' }),
        'gap-1.5 text-muted-foreground hover:text-foreground h-9 px-2 -ml-2',
        className
      )}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  )
}
